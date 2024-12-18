import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf"; // Ensure you import from 'react-pdf'
import "@react-pdf-viewer/core/lib/styles/index.css";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Set the workerSrc for pdf.js (Note: If using react-pdf, this could be handled by that library)
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const ThumbnailViewer = ({ file ,style}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  // Define fixed dimensions for the thumbnail wrapper
  const fixedWidth = style?400:200;
  const fixedHeight = style?500:250;

  useEffect(() => {
    if (file) {
      console.log(file)
      const url = URL.createObjectURL(file);
      setThumbnailUrl(null); // Reset thumbnail before loading

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(async (pdf) => {
        // Get the first page of the PDF
        const page = await pdf.getPage(1);
        
        // Calculate scale to fit the thumbnail dimensions
        const scale = Math.min(fixedWidth / page.getViewport({ scale: 1 }).width, fixedHeight / page.getViewport({ scale: 1 }).height);
        
        // Create a viewport for rendering
        const viewport = page.getViewport({ scale });

        // Create a canvas element
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the PDF page into the canvas
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Convert the canvas to a data URL (image)
        const thumbnailDataUrl = canvas.toDataURL();
        setThumbnailUrl(thumbnailDataUrl); // Set the thumbnail URL
      }).catch((error) => {
        console.error("Error loading PDF: ", error);
      });

      // Cleanup URL after component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  return (
    <div
      className="thumbnail-wrapper flex justify-center items-center bg-gray-200 shadow-md"
      style={{
        width: `${fixedWidth}px`,
        height: `${fixedHeight}px`,
        position: 'relative', // Ensure image is centered inside the wrapper
      }}
    >
      {thumbnailUrl && (
        <img
          className="shadow-md"
          src={thumbnailUrl}
          alt="PDF Thumbnail"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain', // Ensure the image fits within the wrapper
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Center the image
            padding: "2px",
            border: "5px solid #ddd", // Add a border for better visibility
          }}
        />
      )}
    </div>
  );
};

export default ThumbnailViewer;
