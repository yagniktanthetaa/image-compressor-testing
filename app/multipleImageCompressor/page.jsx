"use client";
import JSZip from "jszip";
import React, { useRef } from "react";

const MultipleImageCompressor = () => {
  const fileInputRef = useRef();

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    // Create a zip file to store the compressed images
    const zip = new JSZip();

    const compressImage = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Handle file read completion
        reader.onload = (loadEvent) => {
          const img = new Image();

          // Load the image
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set the canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            // Get the compressed data URL of the canvas image
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.5); // Change the compression quality as needed

            // Add the compressed image to the zip file
            zip.file(`${file.name}`, compressedDataUrl.split(",")[1], {
              base64: true,
            });

            resolve();
          };
          // Handle image load errors
          img.onerror = () => {
            console.error(`Error loading image: ${file.name}`);
            reject();
          };

          // Set the source of the image
          img.src = loadEvent.target.result;
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
      });
    };

    // Function to handle the download
    const downloadZip = () => {
      zip
        .generateAsync({ type: "blob" })
        .then((content) => {
          // Create a download link
          const link = document.createElement("a");
          link.href = URL.createObjectURL(content);
          link.download = "compressed_images.zip";

          // Trigger the download
          link.click();

          // Clean up
          URL.revokeObjectURL(link.href);
        })
        .catch((error) => {
          console.error("Error generating zip file:", error);
        });
    };

    // Compress and add each image to the zip file
    const compressPromises = files.map(compressImage);
    Promise.all(compressPromises)
      .then(downloadZip)
      .catch((error) => {
        console.error("Error compressing images:", error);
      });
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleImageSelection}
      />
    </>
  );
};

export default MultipleImageCompressor;
