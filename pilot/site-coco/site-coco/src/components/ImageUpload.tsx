"use client";
import React, { useState } from "react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

interface ImageUploadProps {
  user: KindeUser | null;
  isAuth: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ user, isAuth }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{ message: string; imageUrl?: string } | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
    setUploadResult(null); // Clear previous results
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuth || !user) {
      alert("Please log in to upload an image.");
      return;
    }

    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/user/images", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadResult(data);
      } else {
        const errorData = await response.json();
        alert(`Error uploading image: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error uploading image: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-20">
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Upload Image:
        </label>
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>

      {uploadResult && (
        <div>
          <p>{uploadResult.message}</p>
          {uploadResult.imageUrl && (
            <div>
              <p>Image URL: {uploadResult.imageUrl}</p>
              {/* You could display the uploaded image here */}
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default ImageUpload;
