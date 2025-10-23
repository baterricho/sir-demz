import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Upload, X, Camera, AlertCircle, Check } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (base64Image: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
  label?: string;
  description?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImage,
  label = "Upload ID Photo",
  description = "Upload a clear photo of your government-issued ID",
  maxSizeMB = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        throw new Error(`Image size must be less than ${maxSizeMB}MB`);
      }

      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      onImageUpload(base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onImageRemove();
    setError(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-4">
          {currentImage ? (
            // Preview uploaded image
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={currentImage}
                  alt="Uploaded ID"
                  className="w-full max-w-sm mx-auto rounded-lg border shadow-sm"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span>ID photo uploaded successfully</span>
              </div>
              
              <Button
                variant="outline"
                onClick={handleUploadClick}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Replace Image
              </Button>
            </div>
          ) : (
            // Upload interface
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">{description}</p>
                <p className="text-xs text-gray-500">
                  Accepted formats: JPG, PNG, GIF • Max size: {maxSizeMB}MB
                </p>
              </div>
              
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </>
                )}
              </Button>
            </div>
          )}
          
          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <p className="text-xs text-gray-500">
        Your ID information is used for identity verification and will be handled securely according to our privacy policy.
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}