import React, { useState, useRef, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import { v4 as uuidv4 } from 'uuid';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
}

interface AdvancedFileUploadProps {
  bucketName: string;
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
  onUploadComplete?: (result: FileUploadResult) => void;
  onUploadProgress?: (progress: UploadProgress) => void;
  multiple?: boolean;
}

export const AdvancedFileUpload: React.FC<AdvancedFileUploadProps> = ({
  bucketName,
  folder = '',
  allowedTypes = ['image/*', 'application/pdf', 'audio/*', 'video/*'],
  maxSize = 50 * 1024 * 1024, // 50MB default
  onUploadComplete,
  onUploadProgress,
  multiple = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side validation
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(1)}MB)`;
    }

    // Check file type
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.replace('/*', '');
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }

    // Check filename for security
    const filename = file.name;
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (dangerousChars.test(filename)) {
      return 'Filename contains invalid characters';
    }

    if (filename.includes('..')) {
      return 'Filename cannot contain ".."';
    }

    return null;
  };

  // Generate unique filename
  const generateUniqueFilename = (originalName: string): string => {
    const timestamp = Date.now();
    const uuid = uuidv4().substring(0, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    
    return `${timestamp}_${uuid}_${nameWithoutExt}.${extension}`;
  };

  // Upload with progress tracking using XMLHttpRequest
  const uploadWithProgress = async (file: File): Promise<FileUploadResult> => {
    return new Promise((resolve) => {
      const uniqueFilename = generateUniqueFilename(file.name);
      const filePath = folder ? `${folder}/${uniqueFilename}` : uniqueFilename;

      // Get Supabase session for auth
      const session = supabase.auth.getSession();
      
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progressData: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          setProgress(progressData);
          onUploadProgress?.(progressData);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Get public URL
          const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          resolve({
            success: true,
            url: data.publicUrl,
            filename: uniqueFilename
          });
        } else {
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}`
          });
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Network error during upload'
        });
      });

      // Prepare request
      const url = `${supabase.supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;
      xhr.open('POST', url);
      
      // Set headers
      xhr.setRequestHeader('Authorization', `Bearer ${supabase.supabaseKey}`);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('x-upsert', 'false'); // Prevent overwrites

      // Send file
      xhr.send(file);
    });
  };

  // Retry logic with exponential backoff
  const uploadWithRetry = async (file: File, maxRetries = 3): Promise<FileUploadResult> => {
    let lastError: string = '';
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await uploadWithProgress(file);
        if (result.success) {
          return result;
        }
        
        // Don't retry on permanent errors (409 conflict, etc.)
        if (result.error?.includes('409') || result.error?.includes('conflict')) {
          return result;
        }
        
        lastError = result.error || 'Unknown error';
        
        // Exponential backoff delay
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Upload failed';
      }
    }
    
    return {
      success: false,
      error: `Upload failed after ${maxRetries} attempts: ${lastError}`
    };
  };

  // Handle file selection
  const handleFiles = async (files: FileList) => {
    setError('');
    setUploading(true);

    const fileArray = Array.from(files);
    
    // Validate all files first
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setUploading(false);
        return;
      }
    }

    // Upload files
    for (const file of fileArray) {
      try {
        const result = await uploadWithRetry(file);
        onUploadComplete?.(result);
        
        if (!result.success) {
          setError(result.error || 'Upload failed');
          break;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setError(errorMessage);
        break;
      }
    }

    setUploading(false);
    setProgress(null);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <div>
              <p className="text-lg font-medium">Uploading...</p>
              {progress && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {progress.percentage}% ({(progress.loaded / 1024 / 1024).toFixed(1)}MB / {(progress.total / 1024 / 1024).toFixed(1)}MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-gray-400">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium">
                {dragOver ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-gray-600">or click to browse</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Supported formats: {allowedTypes.join(', ')}</p>
              <p>Maximum file size: {(maxSize / 1024 / 1024).toFixed(1)}MB</p>
              {multiple && <p>Multiple files allowed</p>}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Files are automatically renamed to prevent conflicts</li>
          <li>• Upload progress is tracked in real-time</li>
          <li>• Failed uploads are automatically retried</li>
          <li>• All files are validated for security</li>
          <li>• Uploaded files are immediately available via public URL</li>
        </ul>
      </div>
    </div>
  );
};
