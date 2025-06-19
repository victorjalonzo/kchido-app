import { useRef, useState } from "react";

export function useImageUpload(){
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null)

    const handleImageUpload = () => {
        fileInputRef.current?.click();
      };
      
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
  
        console.log(file)
      
        const url = URL.createObjectURL(file);
        
        setPreviewUrl(url);
        setFile(file)
      };

      return {
        fileInputRef,
        previewUrl,
        file,
        handleImageUpload,
        handleFileChange
      }
}