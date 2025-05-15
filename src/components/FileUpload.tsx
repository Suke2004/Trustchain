import { useState, useRef } from 'react';
import { UploadCloud, X, File, Image, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileChange: (files: File[]) => void;
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, maxFiles = 5 }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.slice(0, maxFiles - files.length);
    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFileChange(updatedFiles);
  };
  
  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onFileChange(updatedFiles);
  };
  
  const getFileIcon = (file: File) => {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-safespeak-blue" />;
    } else if (fileType.startsWith('video/')) {
      return <Film className="h-5 w-5 text-purple-400" />;
    } else {
      return <File className="h-5 w-5 text-safespeak-green" />;
    }
  };
  
  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
          dragActive ? 'border-safespeak-blue bg-safespeak-blue/10' : 'border-white/20 hover:border-white/40'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          multiple 
          onChange={handleChange} 
          className="hidden" 
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
        
        <UploadCloud className="h-12 w-12 mx-auto mb-4 text-white/60" />
        <p className="text-sm font-medium mb-1">
          Drag & drop or click to upload
        </p>
        <p className="text-xs text-white/60">
          Upload up to {maxFiles} files (images, videos, or documents)
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploaded Files ({files.length}/{maxFiles})</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFilePreview(file) ? (
                    <img 
                      src={getFilePreview(file)} 
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded">
                      {getFileIcon(file)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm font-medium truncate max-w-[180px]">{file.name}</p>
                    <p className="text-xs text-white/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
