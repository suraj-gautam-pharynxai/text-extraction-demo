import { useState } from "react";
import "tailwindcss/tailwind.css";
import Header from "../header";
import axios from "axios";
import img1 from "/dropbox.png";
import img2 from "/drive.png";
import deleteIcon from "/delete-icon.png";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import {truncateFileName} from "@/components/utils/truncateFilename";


const JpgToPdf = () => {
  const [items, setItems] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [bigButtonClicked, setBigButtonClicked] = useState(false);
  const [smallButtonClicked, setSmallButtonClicked] = useState(false);
  const [noMarginButtonClicked, setNoMarginButtonClicked] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [landscape, setLandscape] = useState(false);
  const [paddingImg, setPaddingImg] = useState("p-5");
  const [landScapeValue, setLandScapeValue] = useState("h-20");
  const [pageSize, setPageSize] = useState("A4");
  const [pageOrientation, setPageOrientation] = useState("portrait");
  const [rotations, setRotations] = useState({});
  const [mergeAllImage, setMergeAllImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isIcon, setIsIcon] = useState(true)
  const [orders, setOrders] = useState("asc")
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map((file, index) => ({
      id: items.length + index + 1, // Unique ID for each file
      image: URL.createObjectURL(file),
      fileName: file.name, // Store the file name
      file: file, // Store the file object
    }));
    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const rotateImage = (id) => {
    setRotations((prevRotations) => {
      const currentRotation = prevRotations[id] || 0;
      const newRotation = (currentRotation + 90) % 360;
      return {
        ...prevRotations,
        [id]: newRotation > 270 ? 0 : newRotation, // Reset to 0 after 270
      };
    });
  };

  const createPdf = () => {
    setIsLoading(true);
    const pdfPayload = new FormData();

    items.forEach((item) => {
      if (item.file) {
        pdfPayload.append("files", item.file);
      } else if (item.base64) {
        try {
          const blob = base64ToBlob(item.base64); // Convert base64 to Blob
          pdfPayload.append("files", blob, item.fileName);
        } catch (error) {
          console.error(
            `Error converting base64 for item ${item.fileName}:`,
            error
          );
        }
      } else {
        console.error(
          `Item ${item.fileName} is missing both file and base64 properties.`
        );
      }
    });

    console.log("PDF Payload:", pdfPayload);

    const url1 = `${
      import.meta.env.VITE_BACKEND_URL
    }/pdf/convert_to_pdf/img?is_sep=False`;
    const url2 = `${import.meta.env.VITE_BACKEND_URL}/pdf/convert_to_pdf/img`;
    const url = mergeAllImage ? url1 : url2;
    console.log(url);

    axios
      .post(url, pdfPayload, {
        responseType: "blob", // Specify response type as blob
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("PDF Created Successfully:", response.data);

        // Create a link element
        const link = document.createElement("a");
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        link.href = url;

        if (mergeAllImage) {
          link.download = "converted.pdf"; // Set default file name
        } else if (items.length > 1) {
          link.download = "converted.zip"; // Set default file name
        } else {
          link.download = "converted.pdf";
        }

        // Append link to body
        document.body.appendChild(link);
        // Programmatically click the link to trigger download
        link.click();
        // Remove link from body
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error Creating PDF:", error);
        // Handle error (e.g., show error message)
      })
      .finally(() => {
        setIsLoading(false);
        setItems([]);
        setMergeAllImage(false)
      });
  };

  const getImageClass = () => {
    let baseClass = "rounded object-cover";
    if (smallButtonClicked) baseClass += " h-28 w-28 m-2";
    else if (bigButtonClicked) baseClass += " h-24 w-24 m-4" ;
    else baseClass += " h-40 w-42";
    return baseClass;
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

  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-75">
            <div className="loader"></div>
          </div>
        )}

        <div className="flex items-center justify-center rounded-lg w-screen p-0 min-h-screen">
          {items.length === 0 ? (
            <div className="mb-4">
              <div className="flex flex-col min-h-screen">
                <div className="flex flex-col items-center justify-center mt-8 px-4 sm:px-8 md:px-16 lg:px-24">
                  <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800 mt-28">
                    JPG-to-PDF
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-2xl text-gray-700 text-center mt-4">
                    Convert JPG images to PDF in seconds. Easily adjust
                    orientation and margins.
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                      />
                      <label
                        htmlFor="fileInput"
                        className="p-8 sm:p-6 md:p-8 bg-purple-600 sm:w-[400px] max-w-xs hover:bg-purple-700 rounded-xl text-white font-bold text-lg sm:text-xl md:text-2xl cursor-pointer"
                      >
                        Select JPG images
                      </label>
                    </div>
                    {/* <div className="flex flex-row gap-10 sm:flex-col mt-4 sm:mt-0 sm:gap-1">
                      <button className="rounded-full p-4 bg-purple-600 text-white">
                        <img src={img1} alt="" className="w-4 h-4" />
                      </button>
                      <button className="rounded-full p-4 bg-purple-600 text-white">
                        <img src={img2} alt="" className="w-4 h-4" />
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-[#f2f2f2] pt-0 w-[100%] min-h-screen">
              <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-40 mt-[2rem] relative">
                <div className="flex flex-wrap justify-center max-sm:justify-start items-start h-[750px] ml-auto mr-auto mt-[4rem] rounded gap-4 w-full lg:w-[80%] px-[4rem] max-md:py-[4rem] py-[6rem] overflow-y-auto ">
                  {/* <div className="bg-purple-500 rounded justify-center items-center hover:cursor-pointer  p-2 px-3 absolute top-5 mr-16 right-80 text-white">
                    <input
                      type="file"
                      accept=".pdf, image/jpeg, image/png"
                      multiple
                      onChange={handleFileChange}
                      className="absolute  top-2 right-0 w-28 h-full opacity-0 cursor-pointer"
                    />
                     
                    <label htmlFor="h-10 w-10" className="text-5xl">
                      +
                    </label>
                    <div className="flex justify-center items-center absolute top-0 left-0 rounded-full bg-blue-500 w-5 h-5">
                      <p className="text-white text-xs">{items.length}</p>
                    </div>
                  </div> */}
                  {items.map((item) => (
                    <div  className="p-2 h-[280px] w-[220px] rounded-lg flex  flex-col items-center justify-center bg-white">
                                          <div
                      key={item.id}
                      className={`flex items-center justify-center h-[auto] w-[auto]  shadow-lg border-[#ffd3d3] relative 
                        border-[1px]  cursor-move overflow-y-auto ${
                          item === draggingItem ? "opacity-60" : ""
                        }`}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item)}
                    >
                      <img
                        src={item.image}
                        alt={`Image ${item.id}`}
                        className={getImageClass()}
                        style={{
                          transform: `rotate(${rotations[item.id] || 0}deg)`,
                        }}
                      />

                      <button
                        className="absolute top-2 right-2 text-white rounded-full p-1"
                        onClick={() => rotateImage(item.id)}
                      >
                        <svg
                          fill="#a30000"
                          height="14px"
                          width="14px"
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 214.367 214.367"
                          xmlSpace="preserve"
                          stroke="#a30000"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M202.403,95.22c0,46.312-33.237,85.002-77.109,93.484v25.663l-69.76-40l69.76-40v23.494 c27.176-7.87,47.109-32.964,47.109-62.642c0-35.962-29.258-65.22-65.22-65.22s-65.22,29.258-65.22,65.22 c0,9.686,2.068,19.001,6.148,27.688l-27.154,12.754c-5.968-12.707-8.994-26.313-8.994-40.441C11.964,42.716,54.68,0,107.184,0 S202.403,42.716,202.403,95.22z"></path>
                          </g>
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className={`absolute top-1 left-0 text-white rounded-full p-1 transition-transform duration-300 ${
                          isDeleting === item.id ? "scale-150" : ""
                        }`}
                      >
                        <img src={deleteIcon} alt="" className="w-6 h-6" />
                      </button>
                    </div>
               <div className="flex justify-center items-center p-1"> {truncateFileName(item.fileName)}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col justify-between items-center w-full lg:w-[560px] border border-[#a6a6a6] bg-white gap-4 min-h-[96vh] relative">
                  {/* <div
                    className="bg-purple-500 mt-[4rem] mr-[10rem] z-[10] rounded-full justify-center items-center hover:cursor-pointer 
                    pb-2 px-5 absolute top-5 right-5 lg:top-5 lg:right-80 text-white"
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      className="absolute top-2 right-0 w-28 h-full opacity-0 cursor-pointer"
                    />
                    <label
                      htmlFor="fileInput"
                      className="text-[2.5rem] rounded-full relative z-10"
                    >
                      +
                    </label>
                    <div className="flex justify-center items-center absolute top-0 left-0 rounded-full bg-blue-500 w-5 h-5">
                      <p className="text-white text-xs">{items.length}</p>
                    </div>
                  </div> */}
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
                  accept="image/jpeg, image/png"
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

                {
                  isIcon ? < FaSortAlphaDownAlt className="text-xl" /> :
                    <  FaSortAlphaDown className="text-xl" />


                }



              </div>

                  <div className="bg-white p-4 border rounded-lg shadow-md w-full max-w-md">
                    <div className="px-[0rem] py-[3rem] flex flex-col gap-[1rem] w-[100%] items-center justify-center">
                      <p className="text-[1.6rem] text-center font-medium">
                        Image To PDF Options
                      </p>
                      <div className="w-[100%] h-[1px] bg-[#a6a6a6]"></div>
                      <div className="flex flex-col mb-4">
                        <p className="mb-2">Page orientation</p>
                        <div className="flex gap-2">
                          <button
                            className={`border p-2 md:p-10 rounded-lg ${
                              portrait ? "bg-purple-500 text-white font-bold" : ""
                            }`}
                            onClick={() => {
                              setPortrait(true);
                              setLandscape(false);
                              setPageOrientation("portrait");
                            }}
                          >
                            Portrait
                          </button>
                          <button
                            className={`border p-2 md:p-10 rounded-lg ${
                              landscape ? "bg-purple-500 text-white font-bold" : ""
                            }`}
                            onClick={() => {
                              setLandscape(true);
                              setPortrait(false);
                              setPageOrientation("landscape");
                            }}
                          >
                            Landscape
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col mb-4 w-full">
                        <p className="mb-2">Page size</p>
                        <select
                          className="border px-4 py-2 rounded-lg"
                          value={pageSize}
                          onChange={(e) => setPageSize(e.target.value)}
                        >
                          <option value="A4">A4 (297x210 mm)</option>
                          <option value="Letter">Letter (8.5x11 in)</option>
                          <option value="Legal">Legal (8.5x14 in)</option>
                        </select>
                      </div>
                      <div className="flex flex-col mb-4">
                        <p className="mb-2">Margin</p>
                        <div className="flex gap-2">
                          <button
                            className={`border px-2 py-5 md:px-5 md:py-10 rounded-lg ${
                              noMarginButtonClicked
                                ? "bg-purple-500 text-white font-bold"
                                : ""
                            }`}
                            onClick={() => {
                              setNoMarginButtonClicked(true);
                              setSmallButtonClicked(false);
                              setBigButtonClicked(false);
                              setPaddingImg("p-5");
                            }}
                          >
                            No margin
                          </button>
                          <button
                            className={`border px-2 py-5 md:px-5 md:py-10 rounded-lg ${
                              smallButtonClicked
                                ? "bg-purple-500 text-white font-bold"
                                : ""
                            }`}
                            onClick={() => {
                              setSmallButtonClicked(true);
                              setNoMarginButtonClicked(false);
                              setBigButtonClicked(false);
                              setPaddingImg("p-6");
                            }}
                          >
                            Small
                          </button>
                          <button
                            className={`border px-2 py-5 md:px-5 md:py-10 rounded-lg ${
                              bigButtonClicked
                                ? "bg-purple-500 text-white font-bold"
                                : ""
                            }`}
                            onClick={() => {
                              setBigButtonClicked(true);
                              setNoMarginButtonClicked(false);
                              setSmallButtonClicked(false);
                              setPaddingImg("p-7");
                            }}
                          >
                            Big
                          </button>
                        </div>
                        <hr className="mt-2" />
                        <div className="flex gap-2 mt-2 items-center">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onClick={() => setMergeAllImage(true)}
                            className="w-5 h-5"
                          />
                          <label
                            htmlFor=""
                            className="justify-center items-center"
                          >
                            Check marge all image.
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-[1rem] py-[1rem] w-[100%]">
                    <button
                      className="bg-purple-600 text-white px-[4rem] py-[1rem] rounded-lg w-full"
                      onClick={createPdf}
                    >
                      Convert to PDF
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

export default JpgToPdf;
