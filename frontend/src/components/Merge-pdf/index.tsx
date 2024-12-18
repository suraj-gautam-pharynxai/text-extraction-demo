import { useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import ThumbnailViewer from "../ThumnailPdfViewer/Thumbnail.jsx";
import deleteIcon from "/delete-icon.png";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import DragDrop from "../Dragdrop.tsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const MergePdf = () => {
  const [items, setItems] = useState([]);
  const [isIcon, setIsIcon] = useState(true);
  const [orders, setOrders] = useState("asc");
  const [draggingItem, setDraggingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mergeAllImage, setMergeAllImage] = useState(false);

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetItem) => {
    if (!draggingItem) return;

    const currentIndex = items.indexOf(draggingItem);
    const targetIndex = items.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updatedItems = [...items];
      updatedItems.splice(currentIndex, 1);
      updatedItems.splice(targetIndex, 0, draggingItem);
      setItems(updatedItems);
    }
  };

  console.log("itemraja:", items);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("fileraja:", files);

    if (files.length === 0) {
      toast.warn("Please select at valid file.");
      return;
    }
    const filteredFiles = files.filter((file) => file.size > 0);

    // if (filteredFiles.length > 0) {
    //   toast.success(`${filteredFiles.length} file(s) processed successfully!`);
    // } else {
    //   toast.error('No valid files to process.');
    // }
    const zeroKbFiles = files.filter((file) => file.size === 0);

    if (zeroKbFiles.length > 0) {
      const zeroKbFileNames = zeroKbFiles.map((file) => file.name).join(", ");
      toast.warn(
        `The following file(s) have 0 KB size: ${zeroKbFileNames}. Please upload valid files.`
      );
      return;
    }

    const invalidFiles = files.filter((file) => !file.name.endsWith(".pdf"));

    if (invalidFiles.length > 0) {
      toast.warn("Please select only PDF files.");
      return;
    }

    const duplicateFiles = files.filter((newFile) =>
      items.some((existingFile) => existingFile.fileName === newFile.name)
    );

    if (duplicateFiles.length > 0) {
      const duplicateNames = duplicateFiles.map((file) => file.name).join(", ");
      toast.warn(`Duplicate file name(s) detected: ${duplicateNames}`);
      return;
    }

    const newItems = files.map((file, index) => ({
      id: items.length + index + 1,
      fileName: file.name,
      file: file,
    }));

    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const createPdf = () => {
    setIsLoading(true);
    const pdfPayload = new FormData();
    items.forEach((item) => {
      if (item.file) {
        pdfPayload.append("files", item.file);
      } else {
        console.error(`Item ${item.fileName} is missing the file property.`);
      }
    });

    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }organize_pdf/MERGE?page_num=2,1&is_merge_all=0&ranges=[[1,2], [1,6]]`;
    console.log(url);

    axios
      .post(url, pdfPayload, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("PDF Created Successfully:", response.data);
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        link.href = url;

        if (mergeAllImage) {
          link.download = "converted.pdf";
          toast.success("PDF Downloaded Successfully!");
        } else if (items.length > 1) {
          link.download = "converted.pdf";
          toast.success("PDF Downloaded Successfully!");
        } else {
          link.download = "converted.pdf";
          toast.success("PDF Downloaded Successfully!");
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error Creating PDF:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setItems([]);
      });
  };

  const handleDelete = (id: any) => {
    const updatedItems = items.filter((i) => i.id !== id);
    setItems(updatedItems);
    console.log("HandleDelete :----", items, items.length - 1);
  };

  const handleDeleteClick = (id) => {
    setIsDeleting(id);
    setTimeout(() => {
      handleDelete(id);
      setIsDeleting(false);
    }, 300); // Match the duration of your animation
  };

  const sortFiles = () => {
    setIsIcon(!isIcon);

    const newOrder = orders === "asc" ? "desc" : "asc";
    setOrders(newOrder);
    const sortedFiles = [...items].sort((a, b) => {
      console.log("sort:", items);

      if (newOrder === "asc") {
        return a.fileName.localeCompare(b.fileName);
      } else {
        return b.fileName.localeCompare(a.fileName);
      }
    });
    console.log(sortedFiles);
    setItems(sortedFiles);
  };
  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-75">
            <div className="loader"></div>
          </div>
        )}

        <div className="flex items-center justify-center rounded-lg w-[100%] p-0 min-h-screen">
          {items.length === 0 ? (
            <DragDrop items={items} setItems={setItems}>
              <div className="mb-4">
                <div className="flex flex-col min-h-screen">
                  <div className="flex flex-col items-center justify-center mt-8 px-4 sm:px-8 md:px-16 lg:px-24">
                    <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800 mt-28">
                      Merge PDF File
                    </h1>
                    <h2
                      className="text-lg sm:text-xl md:text-2xl text-gray-700 md:items-center md:text-center 
                  md:justify-center text-center items-center justify-center mt-4"
                    >
                      Combine PDFs in the order you want with the easiest PDF
                      merger available.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                      />
                      <label
                        htmlFor="fileInput"
                        className="p-8 sm:p-6 md:p-8 text-center bg-purple-600 sm:w-[400px] max-w-xs hover:bg-purple-700 
                      rounded-xl text-white font-bold text-lg sm:text-xl md:text-2xl cursor-pointer"
                      >
                        Select PDF Files
                      </label>
                      {/* <div className="flex flex-row gap-10 sm:flex-col mt-4 sm:mt-0 sm:gap-1">
                      <button className="rounded-full p-4 bg-purple-600 text-white">
                        <img src={img1} alt="" className="w-4 h-4" />
                      </button>
                      <button className="rounded-full p-4 bg-purple-600 text-white">
                        <img src={img2} alt="" className="w-4 h-4" />
                      </button>
                    </div> */}
                    </div>
                    <div className="py-2 text-gray-500">or drop PDF here </div>
                  </div>
                </div>
              </div>
            </DragDrop>
          ) : (
            <div className="relative bg-[#f2f2f2] pt-0 w-screen min-h-screen">
              {" "}
              <div
                className="bg-purple-500 mt-[4rem] mr-[10rem] z-[10] h-16 w-16 rounded-full justify-center items-center hover:cursor-pointer 
                    pb-2 px-5 absolute top-10 right-2 md-right-10 lg:right-80 text-white"
              >
                <label
                  htmlFor="fileInput"
                  className="text-[2.5rem] rounded-full relative z-10"
                >
                  +
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="absolute top-2 right-0 w-28 h-full opacity-0 cursor-pointer"
                />

                <div className="flex justify-center items-center absolute top-0   left-0 rounded-full bg-blue-500 w-5 h-5">
                  <p className="text-white text-xs">{items.length}</p>
                </div>
              </div>
              <div
                className="bg-gray-400 mt-[4rem] mr-[10rem] z-[10]  h-16 w-16 rounded-full  flex justify-center items-center hover:cursor-pointer 
                    pb-2 px-5 absolute top-28 right-2 md-right-10 lg:right-80 text-white"
                onClick={sortFiles}
              >
                {isIcon ? (
                  <FaSortAlphaDown className="text-xl" />
                ) : (
                  <FaSortAlphaDownAlt className="text-xl" />
                )}
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-40 mt-[2rem] relative">
                <div
                  className="flex flex-wrap justify-center max-sm:justify-start items-start h-[750px] ml-auto mr-auto mt-[4rem] 
                  rounded gap-4 w-full lg:w-[80%] px-[4rem] max-md:py-[4rem] py-[6rem] overflow-y-auto"
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start justify-start relative h-[auto] w-[auto] rounded-md p-1 border-[#b9b9b9]  
                        border-[1px] shadow-sm cursor-move overflow-y-auto ${
                          item === draggingItem ? "opacity-60" : ""
                        }`}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item)}
                    >
                      <div className="text-center rounded-md gap-2 relative w-full">
                        {console.log("image", item.file)}

                        {/* <img src={pdf} alt="" /> */}
                        <ThumbnailViewer file={item.file} />
                        <p className="relative ml-auto mr-auto max-w-[98%] bottom-2 text-[0.7rem] font-semibold py-[0.2rem] bg-[#f2f2f2] shadow-inner text-center">
                          {item.fileName.length > 10
                            ? `${item.fileName.slice(0, 10)}...`
                            : item.fileName}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className={`absolute top-2 right-2 text-white rounded-full p-1 transition-transform duration-300 ${
                          isDeleting === item.id ? "scale-150" : ""
                        }`}
                      >
                        <img src={deleteIcon} alt="" className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  className="flex flex-col justify-between items-center w-full lg:w-[560px] border border-[#a6a6a6]
                  bg-white gap-4 min-h-[96vh] relative"
                >
                  {/* <div
                    className="bg-red-500 mt-[4rem] mr-[10rem] z-[10] rounded-full justify-center items-center hover:cursor-pointer 
                    pb-2 px-5 absolute top-5 right-5 lg:top-5 lg:right-80 text-white"
                  >
                    <label
                      htmlFor="fileInput"
                      className="text-[2.5rem] rounded-full relative z-10"
                    >
                      +
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      className="absolute top-2 right-0 w-28 h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex justify-center items-center absolute top-0 left-0 rounded-full bg-blue-500 w-5 h-5">
                      <p className="text-white text-xs">{items.length}</p>
                    </div>
                  </div> */}

                  <div className="px-[0rem] py-[3rem] flex flex-col gap-[1rem] w-[100%] items-center justify-center">
                    <p className="text-[1.6rem] text-center font-medium">
                      Merge PDF
                    </p>
                    <div className="w-[100%] h-[1px] bg-[#a6a6a6]"></div>
                    <div className="px-[1.5rem] ml-auto mr-auto rounded-md bg-[#d4edf6] py-[1.5rem] w-[90%]">
                      <p className="text-[1rem] font-normal">
                        To change the order of your PDFs, drag and drop the
                        files as you want.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4  mb-2 border rounded-lg shadow-md w-full max-w-md">
                    <button
                      onClick={() => {
                        if (items.length < 2) {
                          toast.warn("Please add at least 2 files");
                        } else {
                          createPdf();
                        }
                      }}
                      className={`bg-purple-600 text-white px-6 py-2 rounded-lg w-full`}
                      // disabled={items.length < 2} // Disable the button when there are less than 2 files
                    >
                      Merge PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MergePdf;
