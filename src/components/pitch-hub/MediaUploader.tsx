
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, X, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { uploadPitchMedia } from '@/api/pitch';

interface MediaUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  userId?: string;
  maxFiles?: number;
}

const MediaUploader = ({ value = [], onChange, userId, maxFiles = 5 }: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload media",
        variant: "destructive",
      });
      return;
    }
    
    // Check if adding these files would exceed the maximum
    if (value.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Upload limit reached",
        description: `You can only upload up to ${maxFiles} files`,
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Process each file
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds the 5MB size limit`);
        }
        
        return uploadPitchMedia(file, userId);
      });
      
      const results = await Promise.all(uploadPromises);
      const validUrls = results.filter((url): url is string => !!url);
      
      if (validUrls.length) {
        onChange([...value, ...validUrls]);
        
        toast({
          title: "Upload successful",
          description: `${validUrls.length} file${validUrls.length > 1 ? 's' : ''} uploaded`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, userId, maxFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxFiles - value.length,
    disabled: isUploading || value.length >= maxFiles
  });
  
  const removeMedia = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragActive ? 'border-idolyst-purple bg-idolyst-purple/5' : 'border-gray-300 hover:border-idolyst-purple hover:bg-gray-50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${value.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center gap-2">
          {isDragActive ? (
            <>
              <Upload className="h-12 w-12 text-idolyst-purple animate-bounce" />
              <p className="text-lg font-medium text-idolyst-purple">Drop your images here</p>
            </>
          ) : (
            <>
              <Camera className="h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium">
                {isUploading ? 'Uploading...' : 'Drag & drop your images here'}
              </p>
              <p className="text-sm text-gray-500">or click to browse your files</p>
              <p className="text-xs text-gray-400 mt-2">
                Max {maxFiles} images, 5MB each (JPEG, PNG, GIF)
              </p>
            </>
          )}
        </div>
      </div>
      
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div 
              key={index} 
              className="relative aspect-square rounded-md overflow-hidden border group"
            >
              <img 
                src={url} 
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeMedia(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(url, '_blank');
                  }}
                >
                  <Image className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
