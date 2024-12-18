import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

export const   PdfViewer = ({ pdfUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (pdfUrl) {
      const loadPdf = async () => {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Load the first page
        const viewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
      };

      loadPdf();
    }
  }, [pdfUrl]);

  return <canvas ref={canvasRef}></canvas>;
};
