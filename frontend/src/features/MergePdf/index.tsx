import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import deleteIcon from "/delete-icon.png";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
// import DragDrop from "../Dragdrop.tsx"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import DragDrop from "@/components/Dragdrop";
import ThumbnailViewer from "../../components/ThumnailPdfViewer/Thumbnail.jsx";
import PDFUpload from "@/components/FileUploder.js";
import PreviewSection from "@/components/PreviewSection.js";
const MergePdf = () => {
  const [items, setItems] = useState([]);
  const [isIcon, setIsIcon] = useState(true)
  const [orders, setOrders] = useState("asc")
  const [draggingItem, setDraggingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mergeAllImage, setMergeAllImage] = useState(false);
  const [files, setFiles] = useState([]);


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

useEffect(()=>{
  const newItems = files.map((file, index) => ({
    id: items.length + index + 1,
    fileName: file.name,
    file: file,
  }));

  setItems((prevItems) => [...prevItems, ...newItems]);

} , [files ])

  console.log("setFiles:",files );
  console.log("items:",items );


  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
    // const files = Array.from(e.target.files);
  
    if (files.length === 0) {
      toast.warn("Please select at valid file.");
      return;
    }
    const filteredFiles = files.filter(file => file.size > 0);


    const zeroKbFiles = files.filter(file => file.size === 0);

    if (zeroKbFiles.length > 0) {
      const zeroKbFileNames = zeroKbFiles.map(file => file.name).join(', ');
      toast.warn(`The following file(s) have 0 KB size: ${zeroKbFileNames}. Please upload valid files.`);
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
      const duplicateNames = duplicateFiles.map(file => file.name).join(', ');
      toast.warn(`Duplicate file name(s) detected: ${duplicateNames}`);
      return;
    }


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

    const url = `${import.meta.env.VITE_BACKEND_URL
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
    setIsIcon(!isIcon)

    const newOrder = orders === "asc" ? "desc" : "asc"
    setOrders(newOrder)
    const sortedFiles = [...items].sort((a, b) => {
      console.log("sort:", items);

      if (newOrder === "asc") {
        return a.fileName
          .localeCompare(b.fileName
          )
      } else {
        return b.fileName
          .localeCompare(a.fileName
          )
      }
    })
    console.log(sortedFiles);
    setItems(sortedFiles)


  }
  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-75">
            <div className="loader"></div>
          </div>
        )}

          {items.length === 0 ? (
           <PDFUpload files = {files} setFiles = {setFiles} heading={"Merge PDF"}  subheading={"Convert each PDF page into a JPG or extract all images contained in a PDF."}/>
          ) : (
            <PreviewSection items ={items}/>
          )}
        </div>
    </>
  );
};

export default MergePdf;



