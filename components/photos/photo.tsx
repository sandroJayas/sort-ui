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

  // Hooks
  const { data: sessionPhotos, isLoading: isLoadingPhotos } =
    useSessionPhotos(sessionId);
  const uploadMutation = useUploadPhotos();
  const deleteMutation = useDeletePhoto();

  // Get current photo URLs from session data - memoized to prevent unnecessary renders
  const currentPhotoUrls = useMemo(() => {
    return (
      sessionPhotos?.photos?.map((photo) => photo.url).filter(Boolean) || []
    );
  }, [sessionPhotos]);

  // Notify parent of photo changes when session photos change
  useEffect(() => {
    if (onPhotosChange && currentPhotoUrls.length >= 0) {
      onPhotosChange(currentPhotoUrls);
    }
  }, [currentPhotoUrls, onPhotosChange]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
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

  // Cleanup preview URL
  const cleanupPreviewUrl = useCallback((url: string) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
      previewUrlsRef.current.delete(url);
    }
  }, []);

  // File validation
  const validateFile = useCallback(
    (file: File): string | null => {
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
      const fileArray = Array.from(files);
      const currentCount = currentPhotoUrls.length + uploadingFiles.length;
      const remainingSlots = maxFiles - currentCount;

      if (remainingSlots <= 0) {
        return;
      }

      // Limit files to available slots
      const filesToProcess = fileArray.slice(0, remainingSlots);
      const validFiles: File[] = [];
      const newUploadingFiles: UploadingFile[] = [];

      // Process and validate files
      filesToProcess.forEach((file) => {
        const error = validateFile(file);
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const preview = createPreviewUrl(file);

        if (error) {
          newUploadingFiles.push({
            file,
            preview,
            id,
            status: "error",
            error,
          });
        } else {
          validFiles.push(file);
          newUploadingFiles.push({
            file,
            preview,
            id,
            status: "uploading",
            progress: 0,
          });
        }
      });

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

      // Upload valid files
      if (validFiles.length > 0) {
        try {
          await uploadMutation.mutateAsync(
            { sessionId, photos: validFiles },
            {
              onSuccess: () => {
                // Mark successful uploads
                setUploadingFiles((prev) =>
                  prev.map((uploadingFile) => {
                    const wasUploaded = validFiles.some(
                      (validFile) =>
                        validFile.name === uploadingFile.file.name &&
                        validFile.size === uploadingFile.file.size &&
                        validFile.lastModified ===
                          uploadingFile.file.lastModified,
                    );

                    if (wasUploaded && uploadingFile.status === "uploading") {
                      return {
                        ...uploadingFile,
                        status: "success" as const,
                        progress: 100,
                      };
                    }
                    return uploadingFile;
                  }),
                );

                // Remove successful uploads after delay
                setTimeout(() => {
                  setUploadingFiles((prev) => {
                    const successful = prev.filter(
                      (f) => f.status === "success",
                    );
                    const remaining = prev.filter(
                      (f) => f.status !== "success",
                    );

                    // Cleanup preview URLs for successful uploads
                    successful.forEach((file) => {
                      cleanupPreviewUrl(file.preview);
                    });

                    return remaining;
                  });
                }, 1500);
              },
              onError: (error) => {
                // Mark failed uploads
                setUploadingFiles((prev) =>
                  prev.map((uploadingFile) => {
                    const wasInUpload = validFiles.some(
                      (validFile) =>
                        validFile.name === uploadingFile.file.name &&
                        validFile.size === uploadingFile.file.size,
                    );

                    if (wasInUpload && uploadingFile.status === "uploading") {
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
          cleanupPreviewUrl(file.preview);
        }
        return prev.filter((f) => f.id !== id);
      });
    },
    [cleanupPreviewUrl],
  );

  // Delete photo
  const handleDeletePhoto = useCallback(
    (photoId: string) => {
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
                  src={item.preview || "/placeholder.svg"}
                  alt={item.file.name}
                  fill
                  className={`object-cover transition-opacity ${
                    item.status === "error" ? "opacity-50" : ""
                  }`}
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
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center scale-100 animate-[scale-in_0.2s_ease-out]">
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
          {currentPhotoUrls.map((url, index) => {
            const photo = sessionPhotos?.photos?.[index];
            if (!photo) return null;

            return (
              <div key={photo.id} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={url || "/placeholder.svg"}
                    alt={photo.file_name}
                    fill
                    className="object-cover"
                  />

                  {/* Delete Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={deleteMutation.isPending}
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
                    {photo.file_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(photo.file_size / 1024 / 1024).toFixed(1)} MB
                  </p>
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
    </div>
  );
}
