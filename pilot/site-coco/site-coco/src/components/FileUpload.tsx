'use client';

import { useState, useRef } from 'react';
import { Input, Button, Box, Text, Image, useToast } from '@chakra-ui/react';

interface FileUploadProps {
  onImageUpload: (file: File | null) => void; // Callback for parent
}

const FileUpload = ({ onImageUpload }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      toast({
        title: file ? 'Invalid file or size' : 'No file selected',
        description: file ? 'Image must be 2MB or less.' : 'Please select an image.',
        status: 'error',
      });
    }
  };

  const handleUpload = () => {
    onImageUpload(selectedFile);
    setSelectedFile(null); // Clear selection after upload
  };

  return (
    <Box>
      <Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} display="none" />
      <Button onClick={() => fileInputRef.current?.click()} colorScheme="purple" variant="outline">
        Choose from Gallery
      </Button>

      {selectedFile && (
        <Box mt={4}>
          <Image src={URL.createObjectURL(selectedFile)} alt="Selected" maxH="200px" objectFit="cover" />
          <Button mt={2} onClick={handleUpload} colorScheme="purple" isDisabled={!selectedFile}>
            Upload
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
