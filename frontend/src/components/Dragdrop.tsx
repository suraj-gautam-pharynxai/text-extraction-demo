import React, { useState, ReactNode, DragEvent } from 'react';

    interface DragProps {
  children: ReactNode;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  items: React.Dispatch<React.SetStateAction<any[]>>;

  dragOverClass?: string;
  maxFiles?: number;
  allowedFileTypes?: string[];
}

const DragDrop: React.FC<DragProps> = ({
  children,
  setItems,
  items,
  dragOverClass = "bg-purple-200",
  maxFiles = Infinity,
  allowedFileTypes = [],
}) => {
//   const [items, setItems] = useState<any[]>([]);

  const handleFileDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add(dragOverClass);
  };

  const handleFileDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove(dragOverClass);
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove(dragOverClass);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const newItems = droppedFiles.map((file, index) => ({
      id: items.length + index + 1,
      fileName: file.name,
      file: file,
    }));

    console.log("this is newItems", newItems);
    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      onDragOver={handleFileDragOver}
      onDragLeave={handleFileDragLeave}
      onDrop={handleFileDrop}
    >
      {children}
    </div>
  );
};

export default DragDrop;
