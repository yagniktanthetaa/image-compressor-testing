"use client";
import React, { useState } from "react";
import imageCompression from "browser-image-compression"; // Library for compressing images

const ImageUploader = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [fileSizes, setFileSizes] = useState([]);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = e.target.files;
    const imagesArray = Array.from(files);

    setSelectedImages(imagesArray);

    // Calculate and set file sizes
    const sizes = imagesArray.map((image) => ({
      name: image.name,
      size: Math.round(image.size / 1024), // Convert to KB
    }));
    setFileSizes(sizes);
  };

  // Compress and download images
  const handleDownload = async () => {
    const compressedImages = await Promise.all(
      selectedImages.map(async (image) => {
        const options = {
          maxSizeMB: 1, // Maximum size limit in MB for compression
          //   maxWidthOrHeight: 800, // Maximum width or height for compression
        };

        try {
          const compressedImage = await imageCompression(image, options);
          return compressedImage;
        } catch (error) {
          console.error("Error compressing image:", error);
          return null;
        }
      })
    );

    // Create and download compressed images
    compressedImages.forEach((compressedImage, index) => {
      if (compressedImage) {
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(compressedImage);
        // downloadLink.download = `compressed_${selectedImages[index].name}`;
        downloadLink.download = `${selectedImages[index].name}`;
        downloadLink.click();
      }
    });
  };

  return (
    <>
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <button
          className="bg-emerald-700 rounded-xl text-white text-xl py-2 px-4"
          onClick={handleDownload}
        >
          Compress and Download
        </button>
        <ul>
          {fileSizes.map((file) => (
            <li key={file.name}>{`${file.name}: ${file.size} KB`}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ImageUploader;
