import { useRef, useState, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface FormFileUploadProps {
  value?: string;
  onChange: (value: string) => void;
  accept?: string;
  error?: string;
}

export default function FormFileUpload({
  value,
  onChange,
  accept = 'image/*',
  error,
}: FormFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const isImage = value && (value.startsWith('data:image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value));

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
  };

  if (value && isImage) {
    return (
      <div className="relative">
        <div className="relative w-full h-40 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {fileName && (
          <p className="text-xs text-gray-500 mt-1">{fileName}</p>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging
            ? 'border-green-500 bg-green-50'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
        }`}
      >
        <div className={`p-2 rounded-full ${isDragging ? 'bg-green-100' : 'bg-gray-100'}`}>
          {isDragging ? (
            <Upload className="w-5 h-5 text-green-600" />
          ) : (
            <ImageIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-green-600">Seleccionar archivo</span>
            {' '}o arrastrar aqui
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF hasta 5MB</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
