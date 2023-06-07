/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";

const InputImageCompressor = () => {
  const [file, setFile] = useState("");
  const [compressedImage, SetCompressedImage] = useState("");
  // const [maxWidth, setMaxWidth] = useState(null);
  // const [maxHeight, setMaxHeight] = useState(null);
  // const [quality, setQuality] = useState(null);
  const [imageData, setImageData] = useState({
    maxWidth: "",
    maxHeight: "",
    quality: "",
  });

  const compressImage = (file, maxWidth, maxHeight, quality) => {
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
          // Calculate the new dimensions
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          // Create a canvas element
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set the canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Get the compressed data URL
          const compressedDataURL = canvas.toDataURL("image/jpeg", quality);

          // Resolve the promise with the compressed data URL
          resolve(compressedDataURL);
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
    // const maxWidth = 800; // Maximum width of the compressed image
    // const maxHeight = 600; // Maximum height of the compressed image
    // const quality = 0.8; // Quality of the compressed image (0.0 - 1.0)

    const { maxWidth, maxHeight, quality } = imageData;

    try {
      const compressedDataURL = await compressImage(
        imageFile,
        maxWidth,
        maxHeight,
        quality
      );
      SetCompressedImage(compressedDataURL);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setImageData({ ...imageData, [name]: value });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
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

        <input
          type="number"
          name="maxWidth"
          value={imageData.maxWidth}
          onChange={handleInputChange}
          placeholder="Width"
          className="border-2 rounded-xl outline-none py-2.5 px-4 my-2"
        />

        <input
          type="number"
          name="maxHeight"
          value={imageData.maxHeight}
          onChange={handleInputChange}
          placeholder="Height"
          className="border-2 rounded-xl outline-none py-2.5 px-4 my-2"
        />

        <input
          type="number"
          name="quality"
          value={imageData.quality}
          onChange={handleInputChange}
          placeholder="Quality"
          className="border-2 rounded-xl outline-none py-2.5 px-4 my-2"
        />
      </div>
    </>
  );
};

export default InputImageCompressor;
