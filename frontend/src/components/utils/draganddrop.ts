export const handleFileDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add("bg-purple-200 "); // Add visual cue on drag over
  };
  
  // Handle drag leave event
  export const handleFileDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("bg-purple-200"); // Remove visual cue when drag leaves
  };
  
  // Handle file drop event
  export const  handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("bg-purple-200"); // Remove visual cue when file is dropped
  
        const droppedFiles = Array.from(e.dataTransfer.files);
      const newItems = droppedFiles.map((file, index) => ({
        id: items.length + index + 1,
        fileName: file.name,
        file: file,
      }));
      setItems((prevItems) => [...prevItems, ...newItems]);
  //   };
  
  };
  