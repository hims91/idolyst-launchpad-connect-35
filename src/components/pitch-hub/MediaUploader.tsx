
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadPitchMedia } from '@/api/pitch';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface MediaUploaderProps {
  maxFiles?: number;
  mediaUrls: string[];
  onChange: (urls: string[]) => void;
}

const MediaUploader = ({ maxFiles = 3, mediaUrls, onChange }: MediaUploaderProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to upload media files.',
        variant: 'destructive',
      });
      return;
    }

    // Check if adding these files would exceed the limit
    if (mediaUrls.length + acceptedFiles.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `You can only upload up to ${maxFiles} files.`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    // Create a fake progress indicator
    const newProgress = { ...progress };
    acceptedFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setProgress(newProgress);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const updated = { ...prev };
        acceptedFiles.forEach(file => {
          if (updated[file.name] < 90) {
            updated[file.name] += Math.floor(Math.random() * 10) + 5;
          }
        });
        return updated;
      });
    }, 300);

    try {
      // Upload each file and collect URLs
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: `${file.name} exceeds the 5MB size limit.`,
            variant: 'destructive',
          });
          return null;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file type',
            description: 'Only image files are allowed.',
            variant: 'destructive',
          });
          return null;
        }

        return await uploadPitchMedia(file, user.id);
      });

      const newUrls = await Promise.all(uploadPromises);
      
      // Filter out nulls and combine with existing URLs
      const validNewUrls = newUrls.filter(Boolean) as string[];
      onChange([...mediaUrls, ...validNewUrls]);
      
      // Clear progress
      clearInterval(progressInterval);
      setProgress({});
      
      toast({
        title: 'Upload successful',
        description: 'Your media files have been uploaded.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  }, [user, maxFiles, mediaUrls, onChange, progress]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    disabled: isUploading || mediaUrls.length >= maxFiles,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeMedia = (indexToRemove: number) => {
    onChange(mediaUrls.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mediaUrls.map((url, index) => (
          <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200">
            <img
              src={url}
              alt={`Upload ${index + 1}`}
              className="w-full h-32 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeMedia(index)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {Object.keys(progress).map(fileName => (
          <div 
            key={fileName} 
            className="border border-gray-200 rounded-md h-32 flex flex-col items-center justify-center p-4 bg-gray-50"
          >
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
            <div className="text-xs text-gray-500 text-center">{fileName}</div>
            <div className="w-full mt-2 bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${progress[fileName]}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        {mediaUrls.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center h-32 cursor-pointer
              ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Image className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-center text-gray-500">
              {isDragActive ? 'Drop the files here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {mediaUrls.length}/{maxFiles} • Max 5MB each
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
