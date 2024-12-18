import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Header from "../header";
import axios from "axios";
import img1 from "/dropbox.png";
import img2 from "/drive.png";
import currect from "/currect-icon.png";

const OrganizePdf = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState([]);
  const [totalPagesNo, setTotalPagesNo] = useState(null);
  const [pages, setPages] = useState([]);
  const [apiPages, setApiPages] = useState([]);
  const [value, setValue] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [editDisable, setEditDisable] = useState(false);

  const [files, setFiles] = useState([{ name: "A: MCA Syllabus 2022.pdf" }]);

  const handleFileRemove = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFiles([]);
  };

  function base64ToDataUrl(base64String, mimeType = "image/png") {
    if (base64String.startsWith("data:")) {
      return base64String;
    }
    return `data:${mimeType};base64,${base64String}`;
  }

  const handleFileChange = async (e) => {
    setIsLoading(true);
    const files = Array.from(e.target.files);
    setPdfFile(files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pdf_pages_with_number?files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "json",
        }
      );
      const totalNoOfPages = response.data[0];

      setTotalPagesNo(totalNoOfPages["Total pages"]);

      if (Array.isArray(response.data) && response.data.length > 1) {
        const newApiPages = response.data
          .slice(1)
          .map((item) => {
            if (item.file) {
              const base64String = item.file;
              const dataUrl = base64ToDataUrl(base64String);
              return dataUrl;
            } else {
              console.error(
                "Missing file property in response data item:",
                item
              );
              return null;
            }
          })
          .filter((dataUrl) => dataUrl !== null);
        setApiPages((prevApiPages) => [...prevApiPages, ...newApiPages]);
      } else {
        console.error(
          "Insufficient data in response or response is not an array"
        );
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (totalPagesNo !== null) {
      setPages(Array.from({ length: totalPagesNo }, (_, i) => i + 1));
    }
  }, [totalPagesNo]);

  const handleCardClick = (cardIndex) => {
    setEditDisable(true);
    setSelectedCards((prevSelectedCards) => {
      let updatedSelectedCards;

      if (prevSelectedCards.includes(cardIndex)) {
        updatedSelectedCards = prevSelectedCards.filter(
          (index) => index !== cardIndex
        );
      } else {
        updatedSelectedCards = [...prevSelectedCards, cardIndex];
      }

      updatedSelectedCards.sort((a, b) => a - b);

      const formatted = updatedSelectedCards.join(",");
      setValue(formatted);
      console.log("Formatted indices:", formatted);

      return updatedSelectedCards;
    });
  };

  const [totalPages] = useState(1);
  const [pagesToRemove, setPagesToRemove] = useState("");

  return (
    <>
      <div className="flex items-center justify-center min-h-screen relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-75">
            <div className="loader"></div>
          </div>
        )}
        <div className="flex items-center justify-center rounded-lg w-[100%] p-0 min-h-screen">
          {apiPages.length === 0 ? (
            <div className="mb-4">
              <div className="flex flex-col min-h-screen">
                <div className="flex flex-col items-center justify-center mt-8 px-4 sm:px-8 md:px-16 lg:px-24">
                  <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800 mt-28">
                    Organize PDF
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-3xl text-gray-700 text-center mt-4">
                    Sort, add and delete PDF pages. Drag and drop the page
                    thumbnails and sort them in our PDF organizer.
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileInput"
                    />
                    <label
                      htmlFor="fileInput"
                      className="p-8 sm:p-6 md:p-8 text-center bg-purple-600 sm:w-[400px] max-w-xs hover:bg-purple-700 rounded-xl text-white font-bold text-lg sm:text-xl md:text-2xl cursor-pointer"
                    >
                      Select Pdf Files
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
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-[#f2f2f2] pt-0 w-screen min-h-screen">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-75">
                  <div className="loader"></div>
                </div>
              )}
              {/* <div className="bg-purple-500 mt-20 mr-32 rounded justify-center items-center hover:cursor-pointer p-2 px-3 absolute top-5 right-5 lg:top-5 lg:right-80 text-white">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="absolute top-2 right-0 w-28 h-full opacity-0 cursor-pointer"
                />
                <label
                  htmlFor="fileInput"
                  className="text-3xl rounded-full relative z-10"
                >
                  +
                </label>
                <div className="flex justify-center items-center absolute -top-1 -left-1 rounded-full bg-blue-500 w-5 h-5">
                  <p className="text-white text-xs">{items.length}</p>
                </div>
              </div>
               <button className="bg-purple-500 hover:cursor-pointer flex flex-col text-sm mt-40  mr-32 rounded-full justify-center items-center px-6 py-2 absolute top-5 right-5 lg:top-5 lg:right-80 text-white">
               
               <span className="hover:cursor-pointer">0</span>
               
               <span className="hover:cursor-pointer">9</span>
                
              </button> */}
              <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-40 mt-10 relative">
                <div
                  className="flex flex-wrap justify-center max-sm:justify-start items-start h-[750px] ml-auto mr-auto mt-[4rem] 
                  rounded gap-4 w-full lg:w-[80%] px-[4rem] max-md:py-[4rem] py-[6rem] overflow-y-auto"
                >
                  <div className="flex flex-wrap gap-4">
                    {apiPages.length > 0 &&
                      apiPages.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-start justify-start relative h-[auto] w-[auto] rounded-md p-1 border-[#b9b9b9]  
                          border-[1px] shadow-sm cursor-move overflow-y-auto ${
                            selectedCards.includes(index + 1)
                              ? "bg-blue-100"
                              : "opacity-60"
                          }`}
                          onClick={() => handleCardClick(index + 1)}
                        >
                          <div className="text-center rounded-md gap-2 relative w-full flex flex-col justify-center items-center">
                            <img
                              src={item}
                              alt={`Card ${index + 1}`}
                              className="w-[100%] h-[100%] object-cover"
                            />
                            {selectedCards.includes(index + 1) && (
                              <div className="absolute -top-2 -left-2 flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                                <img
                                  src={currect}
                                  alt="Checkmark"
                                  className="w-[100%] h-[100%]"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div
                  className="flex flex-col justify-between items-center w-full lg:w-[560px] border border-[#a6a6a6]
                  bg-white gap-4 min-h-[96vh] relative p-6"
                >
                  <div className="px-[0rem] py-[3rem] flex flex-col gap-[1rem] w-[100%] items-center justify-center">
                    <h2 className="text-3xl font-bold mb-4 text-center">
                      Organize pdf
                    </h2>

                    <div className="w-full max-w-md">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Files:</p>
                        <button
                          onClick={handleReset}
                          className="text-purple-500 font-medium hover:underline"
                        >
                          Reset all
                        </button>
                      </div>

                      {/* File List */}
                      {files.length > 0 ? (
                        <div className="bg-purple-100 p-4 border-2 border-purple-300 rounded-lg flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="material-icons">swap_vert</span>
                            <p>{files[0].name}</p>
                          </div>
                          <button
                            onClick={() => handleFileRemove(0)}
                            className="text-xl font-semibold text-purple-600"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-500">No files added</p>
                      )}
                    </div>

                    {/* Organize Button */}
                    <button 
                      onClick={handleFileChange} className="mb-0 absolute bottom-[1rem] bg-purple-500 text-white py-2 px-4 ml-auto mr-auto max-w-[90%] rounded-lg w-full flex items-center justify-center space-x-2 hover:bg-purple-600 transition-all">
                      <span className="text-xl font-bold">Organize</span>
                      <svg
                        fill="#ffffff"
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ffffff"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g data-name="Layer 2">
                            {" "}
                            <g data-name="arrow-forward">
                              {" "}
                              <rect
                                width="24"
                                height="24"
                                transform="rotate(-90 12 12)"
                                opacity="0"
                              ></rect>{" "}
                              <path d="M5 13h11.86l-3.63 4.36a1 1 0 0 0 1.54 1.28l5-6a1.19 1.19 0 0 0 .09-.15c0-.05.05-.08.07-.13A1 1 0 0 0 20 12a1 1 0 0 0-.07-.36c0-.05-.05-.08-.07-.13a1.19 1.19 0 0 0-.09-.15l-5-6A1 1 0 0 0 14 5a1 1 0 0 0-.64.23 1 1 0 0 0-.13 1.41L16.86 11H5a1 1 0 0 0 0 2z"></path>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
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

export default OrganizePdf;
