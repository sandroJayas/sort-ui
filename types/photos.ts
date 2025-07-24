/**
 * Represents a single uploaded photo
 */
export interface PhotoUploadResponse {
  id: string; // UUID
  file_name: string;
  file_size: number; // int64 in Go -> number in TS
  url: string;
  uploaded_at: string; // ISO 8601 date string
  session_id: string; // UUID
  order_id?: string; // UUID, optional field
}

/**
 * Represents multiple uploaded photos
 */
export interface PhotoUploadBulkResponse {
  session_id: string; // UUID
  total_uploaded: number;
  total_size: number; // int64 in Go -> number in TS
  uploaded_photos: PhotoUploadResponse[];
  errors?: PhotoUploadError[]; // optional field
}

/**
 * Represents an error during photo upload
 */
export interface PhotoUploadError {
  file_name: string;
  error: string;
}

/**
 * Represents a paginated list of photos
 */
export interface PhotoListResponse {
  photos: PhotoUploadResponse[];
  total: number;
  limit?: number; // optional field
  offset?: number; // optional field
}

/**
 * Request payload for uploading photos
 * Used when submitting multipart form data
 */
export interface PhotoUploadRequest {
  session_id: string; // UUID, required
  order_id?: string; // UUID, optional
  photos: File[]; // Array of File objects for multipart upload
}

/**
 * Utility type for handling photo upload form data
 */
export type PhotoUploadFormData = {
  session_id: string;
  order_id?: string;
  photos: FileList | File[];
};
