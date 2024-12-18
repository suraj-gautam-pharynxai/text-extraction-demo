import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Header from "../header";
import axios from "axios";
import img1 from "/dropbox.png";
import img2 from "/drive.png";
import currect from "/currect-icon.png";

const RemovePages = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState([]);
  const [ranges, setRanges] = useState([{ id: 1, fromPage: "", toPage: "" }]);
  const [totalPagesNo, setTotalPagesNo] = useState(null);
  const [pages, setPages] = useState([]);
  const [apiPages, setApiPages] = useState([]);
  const [value, setValue] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [editDisable, setEditDisable] = useState(false);
  const [selectedPages, setSelectedPages] = useState(
    ranges.reduce(
      (acc, range) => ({
        ...acc,
        [range.id]: { from: pages[0], to: pages[0] },
      }),
      {}
    )
  );

  const handleInputChange = (e) => {
    const input = e.target.value;

    const formattedValue = input.split(",").slice(0, 100000000).join(",");

    console.log("Formated values:::", formattedValue);
    setValue(formattedValue);
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

  const getPageNumbersString = (from, to) => {
    // Convert from and to to integers to avoid type issues
    from = parseInt(from, 10);
    to = parseInt(to, 10);

    if (from > to) {
      return "";
    }
    return Array.from({ length: to - from + 1 }, (_, i) => from + i).join(",");
  };

  const removePages = () => {
    setIsLoading(true);
    const pdfPayload = new FormData();
    items.forEach((item) => {
      if (item.file) {
        pdfPayload.append("files", item.file);
      } else {
        console.error(`Item ${item.fileName} is missing the file property.`);
      }
    });

    const url = `${import.meta.env.VITE_BACKEND_URL}organize_pdf/remove_pages?ranges=[[1,2], [1,6]]`;

    const pdf = pdfFile;
    const formData = new FormData();
    pdf.forEach((file) => {
      formData.append("files", file);
    });

    const rangeId = 1;
    const { from, to } = selectedPages[rangeId] || { from: 0, to: 0 };

    const result = getPageNumbersString(from, to);
    console.log("this is page: ", result);
    axios
      .post(url, formData, {
        params: {
          page_num: value,
          // ranges:[[1,2], [1,6]]
          //   is_merge_all: isChecked,
        },
        
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        link.href = url;

        link.download = "converted.pdf";

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
        <div className="flex items-center justify-center rounded-lg w-screen p-0 min-h-screen">
          {apiPages.length === 0 ? (
            <div className="mb-4">
              <div className="flex flex-col min-h-screen">
                <div className="flex flex-col items-center justify-center mt-8 px-4 sm:px-8 md:px-16 lg:px-24">
                  <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800 mt-28">
                    Remove PDF pages{" "}
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-3xl text-gray-700 text-center mt-4">
                    Select and remove the PDF pages you don’t need. Get a new
                    file without your deleted pages.{" "}
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
                      className="p-8 sm:p-6 md:p-8 text-center bg-purple-600 sm:w-[400px] max-w-xs hover:bg-purple-700 
                      rounded-xl text-white font-bold text-lg sm:text-xl md:text-2xl cursor-pointer"
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
            <div className="relative bg-[#f2f2f2] pt-0 w-[100%] min-h-screen">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-75">
                  <div className="loader"></div>
                </div>
              )}
              <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-40 mt-[2rem] relative">
                <div
                  className="flex flex-wrap justify-center max-sm:justify-start items-start h-[750px] ml-auto mr-auto mt-[4rem] 
                  rounded gap-4 w-full lg:w-[80%] px-[4rem] max-md:py-[4rem] py-[6rem] overflow-y-auto"
                >
                  <div className="flex flex-wrap gap-4">
                    {apiPages.length > 0 &&
                      apiPages.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-start justify-start h-[auto] w-[auto] rounded-md p-1 border-[#b9b9b9]  
                          border-[1px] shadow-sm cursor-move overflow-y-auto ${
                            selectedCards.includes(index + 1)
                              ? "bg-blue-100"
                              : "opacity-[1]"
                          }`}
                          onClick={() => handleCardClick(index + 1)}
                        >
                          <div className="text-center rounded-md gap-2 relative w-full">
                            <img
                              src={item}
                              alt={`Card ${index + 1}`}
                              className="w-36 h-40 object-contain p-1"
                            />
                            {selectedCards.includes(index + 1) && (
                              <div className="absolute -top-2 -left-2 flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                                <img
                                  src={currect}
                                  alt="Checkmark"
                                  className="w-6 h-6"
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
                  bg-white gap-4 min-h-[96vh] relative"
                >
                  <div className="flex flex-col gap-[1rem] mt-[2rem]">
                    <h2 className="text-2xl font-semibold text-gray-800 mt-4 text-center">
                      Remove pages
                    </h2>

                    <div className="p-4 mb-4 bg-blue-100 text-blue-800 rounded-md">
                      <p>Click on pages to remove from document.</p>
                    </div>

                    <div className="mb-4">
                      <p className="font-medium text-gray-700">
                        Total pages: {apiPages.length}
                      </p>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="pagesToRemove"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Pages to remove:
                      </label>
                      <input
                        disabled={editDisable}
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={removePages}
                    className="w-full py-[1rem] px-[0] ml-auto mr-auto max-w-[80%] my-[1rem] text-white bg-purple-500 hover:bg-purple-600 rounded-md flex justify-center items-center"
                  >
                    Remove pages
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
          )}
        </div>
      </div>
    </>
  );
};

export default RemovePages;
