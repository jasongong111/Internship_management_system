import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '../ui/button';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  existingFiles?: File[];
}

export function FileUpload({ 
  onFilesChange, 
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  maxSizeMB = 10,
  multiple = true,
  existingFiles = []
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(existingFiles);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      setError(`File type not accepted. Allowed types: ${acceptedTypes.join(', ')}`);
      return false;
    }
    
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-[#003366] bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="mb-2 text-gray-700">
          Drag and drop your files here, or
        </p>
        <Button 
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500 mt-4">
          Accepted formats: {acceptedTypes.join(', ')} (Max {maxSizeMB}MB)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Uploaded Files:</p>
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
