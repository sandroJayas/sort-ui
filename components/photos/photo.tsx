"use client";

import type React from "react";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { Upload, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSessionPhotos } from "@/hooks/photos/useSessionPhotos";
import { useUploadPhotos } from "@/hooks/photos/useUploadPhotos";
import { useDeletePhoto } from "@/hooks/photos/useDeletePhoto";

interface PhotoUploadProps {
  sessionId: string;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
  onPhotosChange?: (photos: string[]) => void;
}

interface UploadingFile {
  file: File;
  preview: string;
  id: string;
  status: "uploading" | "success" | "error";
  error?: string;
  progress?: number;
  uploadId: string; // Added for better tracking
}

const DEFAULT_MAX_FILES = 10;
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PhotoUpload({
  sessionId,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  onPhotosChange,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Hooks
  const { data: sessionPhotos, isLoading: isLoadingPhotos } =
    useSessionPhotos(sessionId);
  const uploadMutation = useUploadPhotos();
  const deleteMutation = useDeletePhoto();

  // Get current photo URLs from session data - memoized to prevent unnecessary renders
  const currentPhotoUrls = useMemo(() => {
    if (!sessionPhotos?.photos) return [];
    return sessionPhotos.photos
      .map((photo) => photo.url)
      .filter((url): url is string => Boolean(url));
  }, [sessionPhotos]);

  // Notify parent of photo changes when session photos change
  useEffect(() => {
    if (onPhotosChange && mountedRef.current) {
      onPhotosChange(currentPhotoUrls);
    }
  }, [currentPhotoUrls, onPhotosChange]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Cleanup all preview URLs
      previewUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error("Error revoking URL:", e);
        }
      });
      previewUrlsRef.current.clear();
    };
  }, []);

  // Create and track preview URL
  const createPreviewUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    previewUrlsRef.current.add(url);
    return url;
  }, []);

  // Cleanup preview URL safely
  const cleanupPreviewUrl = useCallback((url: string) => {
    if (url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
        previewUrlsRef.current.delete(url);
      } catch (e) {
        console.error("Error revoking URL:", e);
      }
    }
  }, []);

  // Generate unique upload ID
  const generateUploadId = useCallback((): string => {
    return `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // File validation
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check if it's actually a file
      if (!file || !(file instanceof File)) {
        return "Invalid file object";
      }

      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        const acceptedExtensions = acceptedTypes
          .map((type) => type.split("/")[1])
          .join(", ");
        return `Invalid file type. Accepted: ${acceptedExtensions}`;
      }

      // Check file size
      if (file.size > maxFileSize) {
        const maxSizeMB = Math.round(maxFileSize / 1024 / 1024);
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
        return `File too large (${fileSizeMB}MB). Max size: ${maxSizeMB}MB`;
      }

      // Check if file is actually an image
      if (!file.type.startsWith("image/")) {
        return "File must be an image";
      }

      return null;
    },
    [acceptedTypes, maxFileSize],
  );

  // Handle file uploads
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!mountedRef.current) return;

      const fileArray = Array.from(files);
      const currentCount = currentPhotoUrls.length + uploadingFiles.length;
      const remainingSlots = maxFiles - currentCount;

      if (remainingSlots <= 0) {
        return;
      }

      // Limit files to available slots
      const filesToProcess = fileArray.slice(0, remainingSlots);
      const validFiles: File[] = [];
      const fileUploadMap = new Map<string, File>(); // Track files by unique upload ID
      const newUploadingFiles: UploadingFile[] = [];

      // Process and validate files
      filesToProcess.forEach((file) => {
        const error = validateFile(file);
        const id = generateUploadId();
        const uploadId = generateUploadId(); // Unique ID for tracking this specific upload
        const preview = createPreviewUrl(file);

        if (error) {
          newUploadingFiles.push({
            file,
            preview,
            id,
            uploadId,
            status: "error",
            error,
          });
        } else {
          validFiles.push(file);
          fileUploadMap.set(uploadId, file);
          newUploadingFiles.push({
            file,
            preview,
            id,
            uploadId,
            status: "uploading",
            progress: 0,
          });
        }
      });

      if (!mountedRef.current) return;

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

      // Upload valid files
      if (validFiles.length > 0) {
        try {
          const uploadIds = Array.from(fileUploadMap.keys());

          await uploadMutation.mutateAsync(
            { sessionId, photos: validFiles },
            {
              onSuccess: () => {
                if (!mountedRef.current) return;

                // Mark successful uploads using unique upload IDs
                setUploadingFiles((prev) =>
                  prev.map((uploadingFile) => {
                    if (
                      uploadIds.includes(uploadingFile.uploadId) &&
                      uploadingFile.status === "uploading"
                    ) {
                      return {
                        ...uploadingFile,
                        status: "success" as const,
                        progress: 100,
                      };
                    }
                    return uploadingFile;
                  }),
                );

                // Remove successful uploads after delay with cleanup
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                  if (!mountedRef.current) return;

                  setUploadingFiles((prev) => {
                    const toRemove = prev.filter(
                      (f) =>
                        uploadIds.includes(f.uploadId) &&
                        f.status === "success",
                    );

                    // Cleanup preview URLs after state update
                    setTimeout(() => {
                      toRemove.forEach((file) => {
                        cleanupPreviewUrl(file.preview);
                      });
                    }, 100);

                    return prev.filter(
                      (f) =>
                        !(
                          uploadIds.includes(f.uploadId) &&
                          f.status === "success"
                        ),
                    );
                  });

                  timeoutRef.current = null;
                }, 1500);
              },
              onError: (error) => {
                if (!mountedRef.current) return;

                // Mark failed uploads using unique upload IDs
                setUploadingFiles((prev) =>
                  prev.map((uploadingFile) => {
                    if (
                      uploadIds.includes(uploadingFile.uploadId) &&
                      uploadingFile.status === "uploading"
                    ) {
                      return {
                        ...uploadingFile,
                        status: "error" as const,
                        error: error.message || "Upload failed",
                      };
                    }
                    return uploadingFile;
                  }),
                );
              },
            },
          );
        } catch (error) {
          console.error("Upload error:", error);
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [
      currentPhotoUrls,
      uploadingFiles,
      maxFiles,
      validateFile,
      createPreviewUrl,
      generateUploadId,
      uploadMutation,
      sessionId,
      cleanupPreviewUrl,
    ],
  );

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      // Check if we're leaving the drop zone entirely
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      if (
        x <= rect.left ||
        x >= rect.right ||
        y <= rect.top ||
        y >= rect.bottom
      ) {
        setDragActive(false);
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles],
  );

  // Remove uploading file
  const removeUploadingFile = useCallback(
    (id: string) => {
      setUploadingFiles((prev) => {
        const file = prev.find((f) => f.id === id);
        if (file) {
          // Delay cleanup to ensure image has finished rendering
          setTimeout(() => {
            cleanupPreviewUrl(file.preview);
          }, 100);
        }
        return prev.filter((f) => f.id !== id);
      });
    },
    [cleanupPreviewUrl],
  );

  // Delete photo
  const handleDeletePhoto = useCallback(
    (photoId: string) => {
      if (!mountedRef.current) return;

      deleteMutation.mutate(photoId, {
        onError: (error) => {
          console.error("Failed to delete photo:", error);
        },
      });
    },
    [deleteMutation],
  );

  // Calculate totals
  const totalPhotos =
    currentPhotoUrls.length +
    uploadingFiles.filter((f) => f.status !== "error").length;
  const hasPhotos = totalPhotos > 0 || isLoadingPhotos;
  const canUploadMore = totalPhotos < maxFiles;
  const uploadingCount = uploadingFiles.filter(
    (f) => f.status === "uploading",
  ).length;
  const errorCount = uploadingFiles.filter((f) => f.status === "error").length;

  // Loading state
  if (isLoadingPhotos) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">Loading photos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {canUploadMore && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-all
            ${
              dragActive
                ? "border-blue-500 bg-blue-50 scale-[1.02]"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }
            ${uploadingCount > 0 ? "opacity-75 pointer-events-none" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Upload photos"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
          <div className="space-y-1">
            <p className="font-medium">
              {dragActive
                ? "Drop photos here"
                : "Drop photos here or click to browse"}
            </p>
            <p className="text-sm text-gray-500">
              {maxFiles - totalPhotos} of {maxFiles} photos remaining
            </p>
            <p className="text-xs text-gray-400">
              Max {Math.round(maxFileSize / 1024 / 1024)}MB per file
            </p>
          </div>

          <Button
            size="sm"
            className="mt-3"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingCount > 0}
            aria-label={
              uploadingCount > 0 ? "Uploading files" : "Choose files to upload"
            }
          >
            {uploadingCount > 0 ? "Uploading..." : "Choose Files"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Error Alert */}
      {errorCount > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorCount} file{errorCount !== 1 ? "s" : ""} failed to upload.
            Check the file requirements and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Photo Grid */}
      {hasPhotos && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Uploading Files */}
          {uploadingFiles.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.preview}
                  alt={item.file.name}
                  fill
                  className={`object-cover transition-opacity ${
                    item.status === "error" ? "opacity-50" : ""
                  }`}
                  sizes="(max-width: 640px) 50vw, 33vw"
                  onError={(e) => {
                    // Fallback for broken images
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  {item.status === "uploading" && (
                    <div className="text-center text-white w-full px-2">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p className="text-xs">Uploading...</p>
                    </div>
                  )}
                  {item.status === "success" && (
                    <div
                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                      style={{ animation: "scale-in 0.2s ease-out" }}
                    >
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {item.status === "error" && (
                    <div className="text-center text-white px-2">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs">{item.error}</p>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeUploadingFile(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-xs text-gray-600 mt-1 truncate">
                {item.file.name}
              </p>
            </div>
          ))}

          {/* Uploaded Photos from Session */}
          {sessionPhotos?.photos?.map((photo) => {
            if (!photo || !photo.url) return null;

            return (
              <div key={photo.id} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={photo.url}
                    alt={photo.file_name || "Uploaded photo"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />

                  {/* Delete Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={deleteMutation.isPending}
                    aria-label={`Delete ${photo.file_name || "photo"}`}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="mt-1">
                  <p className="text-xs text-gray-600 truncate">
                    {photo.file_name || "Unnamed"}
                  </p>
                  {photo.file_size && (
                    <p className="text-xs text-gray-400">
                      {(photo.file_size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status Summary */}
      {(hasPhotos || uploadingCount > 0) && !isLoadingPhotos && (
        <div className="text-sm text-gray-600 text-center">
          {currentPhotoUrls.length} photo
          {currentPhotoUrls.length !== 1 ? "s" : ""} uploaded
          {uploadingCount > 0 && <span>, {uploadingCount} uploading</span>}
          {errorCount > 0 && (
            <span className="text-red-600">, {errorCount} failed</span>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasPhotos &&
        !isLoadingPhotos &&
        totalPhotos === 0 &&
        uploadingFiles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No photos uploaded yet</p>
          </div>
        )}

      {/* Add keyframe animation via style tag */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
