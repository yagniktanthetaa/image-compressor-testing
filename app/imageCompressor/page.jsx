"use client";
import React, { useState } from "react";

const ImageCompressor = () => {
  const [file, setFile] = useState("");
  const [compressedImage, SetCompressedImage] = useState(null);

  // Function to compress and download the image
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      // Create an HTMLImageElement
      const img = new Image();

      // Create a FileReader to read the image file
      const reader = new FileReader();

      // Set up the FileReader onload event
      reader.onload = function (event) {
        // Set the image source to the FileReader result
        img.src = event.target.result;

        // When the image has loaded
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas dimensions to match the image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Get the compressed base64 image data
          const compressedData = canvas.toDataURL("image/jpeg", 0.1); // Adjust compression quality as needed
          resolve(compressedData);
        };

        // If there was an error loading the image
        img.onerror = function () {
          reject(new Error("Failed to load the image."));
        };
      };

      // Read the image file as a data URL
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const imageFile = e.target.files[0];
    // console.log("imageFile", imageFile);
    setFile(imageFile);
    try {
      const compressedDataURL = await compressImage(imageFile);
      SetCompressedImage(compressedDataURL);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="my-4"
      />
      {file && (
        <>
          <img
            src={compressedImage}
            id="compressedImage"
            alt="compressedImage"
            draggable="false"
            className="my-10"
          />
          <a
            href={compressedImage}
            className="bg-blue-500 py-2.5 px-6 mt-4 rounded-xl"
            download={file.name}
          >
            Download
          </a>
        </>
      )}
    </>
  );
};

export default ImageCompressor;
