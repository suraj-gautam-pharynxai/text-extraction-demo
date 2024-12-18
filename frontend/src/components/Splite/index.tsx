import { useState, useEffect, useRef } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import img1 from "/dropbox.png";
import img2 from "/drive.png";
import currect from "/currect-icon.png";
import { MdDelete } from "react-icons/md";

const SplitPdf = () => {
  const [items, setItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [split, setSplit] = useState(true);
  const [extract, setExtract] = useState(false);
  const [selectedRange, setSelectedRange] = useState("custom");
  const [pdfFile, setPdfFile] = useState([]);
  const [ranges, setRanges] = useState([{ id: 0, fromPage: 1, toPage: 0 }]);
  const [totalPagesNo, setTotalPagesNo] = useState(null);
  const [splitedChunk, setSplitedChunk] = useState([]);
  const [pages, setPages] = useState([]);
  const [rangeArray, setRangeArray] = useState<number[][]>([]);
  const rangeRef = useRef(null);
  const [fixedRangeInput, setFixedRangeInput] = useState("");
  const [newRanges, setNewRanges] = useState([]);
  const [fixedRangeArray, setFixedRangeArray] = useState();
  const [modeExtractPages, setModeExtractPages] = useState("");
  const [selectedRangeForExtract, setselectedRangeForExtract] = useState("");
  const [selectedPagesForExtract, setSelectedPagesForExtract] = useState([]);
  const [formatedInputForExtract, setFormatedInputForExtract] = useState();
  const [apiPages, setApiPages] = useState([]);
  // console.log("Api pages is ::: ", apiPages);
  const [error, setError] = useState("");
  const [isRangeValid, setIsRangeValid] = useState(true); // Added state for range validity

  const [selectedPages, setSelectedPages] = useState(
    ranges.reduce(
      (acc, range) => ({
        ...acc,
        [range.id]: {
          from: pages[0] ?? 0,
          to: totalPagesNo ? parseInt(totalPagesNo) - 1 : 1,
        },
      }),
      {}
    )
  );

  console.log("Ranges is ", ranges.length);
  useEffect(() => {
    // Create a new array for transformed ranges
    const transformedRanges: number[][] = [];

    ranges.forEach((range) => {
      transformedRanges.push([
        parseInt(range.fromPage, 10),
        parseInt(range.toPage, 10),
      ]);
    });

    // Update the state with the transformed ranges
    setRangeArray(transformedRanges);
    // Validate ranges after transformation
    setIsRangeValid(validateRanges(transformedRanges));
  }, [ranges]);

  const validateRanges = (ranges) => {
    // Add your range validation logic here.  This is a placeholder.
    // Return true if ranges are valid, false otherwise.
    return ranges.every(range => range[0] <= range[1] && range[0] > 0);
  };

  console.log("rangepdf:", selectedPages, pages);


  // const handleChange = (rangeId, field, value) => {
  //   const parsedValue = parseInt(value, 10);

  //   setRanges((prevRanges) => {
  //     return prevRanges.map((range) => {
  //       if (range.id === rangeId) {
  //         let newFromPage = range.fromPage;
  //         let newToPage = range.toPage;

  //         if (field === "from") {
  //           newFromPage = Math.min(parsedValue, range.toPage);
  //         } else if (field === "to") {
  //           newToPage = parsedValue;
  //         }

  //         // Ensure values are within valid range
  //         newFromPage = Math.max(1, Math.min(newFromPage, totalPagesNo));
  //         newToPage = Math.max(newFromPage, Math.min(newToPage, totalPagesNo));

  //         return { ...range, fromPage: newFromPage, toPage: newToPage };
  //       }
  //       return range;
  //     });
  //   });

  //   setSelectedPages((prev) => ({
  //     ...prev,
  //     [rangeId]: {
  //       ...prev[rangeId],
  //       [field]: Math.min(Math.max(parsedValue, 1), totalPagesNo),
  //     },
  //   }));
  // };

   const handleChange = (rangeId, field, value) => {
    const parsedValue = parseInt(value, 10);

    if (field === "from" && ranges.map((value)=> value.fromPage<value.toPage)) {
      const adjustedValue = parsedValue > totalPagesNo ? pages[0] : parsedValue;
      setRanges((prevRange) =>
        prevRange.map((rangeChunk, i) =>
          i === rangeId
            ? { ...rangeChunk, fromPage: adjustedValue }
            : rangeChunk
        )
      );
    }

    if (field === "to") {
      const adjustedValue =
        parsedValue > totalPagesNo ? totalPagesNo : parsedValue;

      setRanges((prevRange) =>
        prevRange.map((rangeChunk, i) =>
          i === rangeId
            ? { ...rangeChunk, toPage: adjustedValue }
            : rangeChunk
        )
      );

      setSelectedPages((prev) => ({
        ...prev,
        [rangeId]: { ...prev[rangeId], to: adjustedValue },
      }));
    }
  };
 
  const addRange = () => {
    setRanges((prevRanges) => {
      const newId = Math.max(...prevRanges.map((range) => range.id), 0) + 1;
      return [
        ...prevRanges,
        {
          id: newId,
          fromPage: prevRanges[prevRanges.length - 1]?.toPage < totalPagesNo
            ? Number(prevRanges[prevRanges.length - 1]?.toPage) + 1
            : Number(prevRanges[prevRanges.length - 1]?.toPage),
          toPage: Number(totalPagesNo),
        },
      ];
    });
    setSplitedChunk(apiPages);
  };

  const deleteRange = (rangeId) => {
    setRanges((prevrange) =>
      prevrange.length > 1 ? prevrange.filter((range) => range.id !== rangeId) : prevrange
    );
  };
  useEffect(() => {
    if (rangeRef.current) {
      const lastChild = rangeRef.current.lastChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [ranges]);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  function base64ToDataUrl(base64String, mimeType = "image/png") {
    if (base64String.startsWith("data:")) {
      return base64String;
    }
    return `data:${mimeType};base64,${base64String}`;
  }

  const handleFileChange = async (e) => {
    // alert(e)
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
      console.log("pages:", totalNoOfPages);

      setTotalPagesNo(totalNoOfPages["Total pages"]);
      console.log("final:", totalNoOfPages);

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
      setError("Error sending PDF: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("apiPAges", apiPages);

  useEffect(() => {
    if (apiPages?.length > 0) {
      if (typeof apiPages === "object" && apiPages !== null) {
        setSplitedChunk(apiPages);
      } else {
        console.error("Invalid JSON object:", apiPages);
      }

      console.log("setSplitedChunk : ", splitedChunk);
    }
  }, [apiPages]);

  useEffect(() => {
    if (totalPagesNo !== null) {
      setPages(Array.from({ length: totalPagesNo }, (_, i) => i + 1));
      setRanges((prevRanges) =>
        prevRanges.map((range) =>
          range.id === 0 ? { ...range, toPage: totalPagesNo } : range
        )
      );
    }
  }, [totalPagesNo]);

  const createPdf = async () => {
    setIsLoading(true);
    const pdfPayload = new FormData();

    items.forEach((item) => {
      if (item.file) {
        pdfPayload.append("files", item.file);
      } else {
        console.error(`Item ${item.fileName} is missing the file property.`);
      }
    });

    const urlToSplit = `${import.meta.env.VITE_BACKEND_URL}organize_pdf/SPLIT`;
    const urlToExtract = `${
      import.meta.env.VITE_BACKEND_URL
    }organize_pdf/EXTRACT_PAGES`;
    const formData = new FormData();

    pdfFile.forEach((file) => {
      formData.append("files", file);
    });

    const rangesFormatted = JSON.stringify(rangeArray);
    const fixedRangeArrayFormate = JSON.stringify(fixedRangeArray);
    console.log("fixedRangeAeeayFormate", fixedRangeArray);
    // Log the payload for debugging
    console.log("FormData:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log("Params:", {
      extract_page_num: 1,
      is_merge_all: isChecked,
      ranges: selectedRange === "fixed" ? fixedRangeArray : rangesFormatted,
    });
    console.log("Formated input is for extract", formatedInputForExtract);
    const dummyRange = JSON.stringify([[1, 2]]);
    const pageString = Array.from(
      { length: pages.length },
      (_, i) => i + 1
    ).join(",");

    await axios
      .post(extract ? urlToExtract : urlToSplit, formData, {
        params: {
          page_num: extract
            ? formatedInputForExtract ||
              (modeExtractPages === "extract_all_pages" ? pageString : 1)
            : 1,

          is_merge_all:
            modeExtractPages === "extract_all_pages" ? false : isChecked,
          ranges: extract
            ? dummyRange
            : selectedRange === "fixed"
            ? fixedRangeArrayFormate
            : rangesFormatted,
        },
        responseType: "blob",
        // headers: {
        //   Authorization:
        //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWZhdWx0dXNlciJ9.7tPuoXa76NJjM0Xmf7m4vR4JrgbIRctSzfn-7ZKXzn4",
        // },
      })
      .then((response) => {
        console.log("This is my response:--", response.data);
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        link.href = url;
        link.download =
          (ranges.length <= 1 && !isChecked) || isChecked
            ? "converted.pdf"
            : "converted.zip";

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

  const calculateRanges = (input) => {
    const chunkSize = parseInt(input);
    const newRanges = [];

    for (let i = 1; i <= pages.length; i += chunkSize) {
      const fromPage = i;
      const toPage = Math.min(i + chunkSize - 1, pages.length);
      newRanges.push({ fromPage, toPage });
    }
    setFixedRangeArray(
      newRanges.map((range) => [range.fromPage, range.toPage])
    );

    setNewRanges(newRanges);
  };


  useEffect(() => {
    if (totalPagesNo) {
      setFixedRangeInput("1");
    }
  }, [totalPagesNo]);
  
  useEffect(() => {
    if (fixedRangeInput && totalPagesNo) {
      console.log("useEffect");
      calculateRanges(fixedRangeInput);
    }
  }, [fixedRangeInput, totalPagesNo]);
  
  // const handleFixedRangeInput = async () =>{
  //     if (fixedRangeInput !== "") {
  //     console.log("useEffect")
  //     calculateRanges(fixedRangeInput);
  //   }

  // }


  const parseSelectedPages = (input) => {
    const pages = new Set();
    input.split(",").forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      } else {
        pages.add(Number(part));
      }
    });
    return [...pages];
  };

  const formatSelectedPagesForExtract = (input) => {
    let formattedPages = [];

    input.split(",").forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        for (let i = start; i <= end; i++) {
          formattedPages.push(i);
        }
      } else {
        formattedPages.push(Number(part));
      }
    });

    const formattedString = formattedPages.join(",");

    setFormatedInputForExtract(formattedString);

    return formattedString;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    setselectedRangeForExtract(value);
    setSelectedPagesForExtract(parseSelectedPages(value));
    formatSelectedPagesForExtract(value);
  };


  console.log("selectedRange", selectedRange);

  const RangeAlert = () => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline">
        Please ensure that the 'to' value is greater than or equal to the 'from' value in each range.
      </span>
    </div>
  );

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
                    Split PDF file{" "}
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-3xl text-gray-700 text-center mt-4">
                    Separate one page or a whole set for easy conversion into
                    independent PDF files.{" "}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <input
                      type="file"
                      // multiple
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
              <div className="flex  flex-col lg:flex-row justify-between gap-10 lg:gap-40 mt-[2rem] relative">
                <div
                  className="flex  flex-wrap justify-center max-sm:justify-start items-start h-[750px] ml-auto mr-auto mt-[4rem] 
                  rounded gap-4 w-full lg:w-[80%] px-[4rem] max-md:py-[4rem] py-[6rem] overflow-y-auto"
                >
                  <div className="flex  items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1 relative cursor-move overflow-y-auto">
                    {ranges.length > 0 &&
                      selectedRange === "custom" &&
                      ranges.map((chunkedPages, index) => {
                        console.log("chunkedNewPAges", chunkedPages, splitedChunk);
                        return splitedChunk.length > 0 ? (
                          <>
                            {/* First page image */}
                            <div className="flex m-3 border-[#b9b9b9] border-[1px] p-4 shadow-lg items-center justify-center rounded-sm">
                              {/* <div className="relative flex flex-col items-center justify-center h-auto w-36 p-1 bg-gray-200 border-[#f2f2f2] border-2 shadow-sm"> */}
                              <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
                                <img
                                  src={
                                    ranges[index].fromPage === 0
                                      ? splitedChunk[chunkedPages.fromPage]
                                      : splitedChunk[chunkedPages.fromPage - 1]
                                  }
                                  alt="First Page"
                                  className="w-36 h-40 object-contain"
                                />
                                <span className="mt-2 text-sm font-semibold">
                                  Page:
                                  {ranges[index].fromPage === 0
                                    ? ranges[index].fromPage + 1
                                    : ranges[index].fromPage}
                                </span>
                              </div>
                              {/* </div> */}

                              <div className="text-[2rem] items-center justify-center">
                                ...
                              </div>

                              {/* Last page image */}
                              {/* <div className="relative flex flex-col items-center justify-center h-auto w-36 p-1 border-[#f2f2f2] bg-gray-200 border-2 shadow-sm"> */}
                              <div className="text-center rounded-lg bg-gray-100 shadow-md relative p-1.5">
                                <img
                                  src={splitedChunk[chunkedPages.toPage - 1]}
                                  alt="Last Page"
                                  className="w-36 h-40 items-center object-contain"
                                />
                                <span className="mt-2 text-sm font-semibold">
                                  Page: {ranges[index].toPage}
                                </span>
                              </div>
                            </div>
                            {/* </div>  */}
                          </>
                        ) : null;
                      })}
                  </div>
                  {/* fixed range */}
                  {selectedRange === "fixed" && (
    <>
      <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1 cursor-move overflow-y-auto">
        {newRanges.map((chunkedPages, index) => (
          <div
            key={index}
            className="flex m-3 border-[#b9b9b9] border-[1px] p-4 shadow-lg items-center justify-center rounded-sm"
          >
            <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
              <img
                src={splitedChunk[chunkedPages.fromPage - 1]}
                alt={`Page ${chunkedPages.fromPage}`}
                className="w-36 h-40 object-contain"
              />
              <span className="mt-2 text-sm font-semibold">
                Page: {chunkedPages.fromPage}
              </span>
            </div>
            <div className="text-[2rem] items-center justify-center">
              ...
            </div>
            <div className="text-center rounded-lg bg-gray-100 shadow-md rounded-sm relative p-1.5">
              <img
                src={splitedChunk[chunkedPages.toPage - 1]}
                alt={`Page ${chunkedPages.toPage}`}
                className="w-36 h-40 items-center object-contain"
              />
              <span className="mt-2 text-sm font-semibold">
                Page: {chunkedPages.toPage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )}

                  {/* {selectedRange === "fixed" && (
                    <>
                      <div className="flex items-center  flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1  cursor-move overflow-y-auto">
                        {apiPages.length > 0 &&
                          !fixedRangeInput &&
                          apiPages.map((item, index) => (
                            <div
                              key={index}
                              className="flex m-3 border-[#b9b9b9] border-[1px] p-4 shadow-lg  items-center justify-center rounded-sm"
                            >
                              <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
                                <img
                                  src={item}
                                  alt={`Card ${index + 1}`}
                                  className="w-36 h-40 object-contain"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}


                  <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1  cursor-move overflow-y-auto">
                    {fixedRangeInput !== "" && newRanges.length > 0 &&
                      selectedRange === "fixed" &&
                      newRanges.map((chunkedPages, index) => {
                        console.log(
                          "chunkedPages",
                          chunkedPages,
                          splitedChunk[chunkedPages.fromPage - 1]
                        );
                        return (
                          <div
                            key={index}
                            className="flex m-3 border-[#b9b9b9] border-[1px] p-4 shadow-lg items-center justify-center rounded-sm"
                          >
                            <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
                              <img
                                src={splitedChunk[chunkedPages.fromPage - 1]}
                                alt={`Page ${chunkedPages.fromPage}`}
                                className="w-36 h-40 object-contain"
                              />
                              <span className="mt-2 text-sm font-semibold">
                                Page: {chunkedPages.fromPage}
                              </span>
                            </div>
                            <div className="text-[2rem] items-center justify-center">
                              ...
                            </div>
                            <div className="text-center rounded-lg bg-gray-100 shadow-md rounded-sm relative p-1.5">
                              <img
                                src={splitedChunk[chunkedPages.toPage - 1]}
                                alt={`Page ${chunkedPages.toPage}`}
                                className="w-36 h-40 items-center object-contain"
                              />
                              <span className="mt-2 text-sm font-semibold">
                                Page: {chunkedPages.toPage}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
 */}
                  {/* last */}
                  {modeExtractPages === "extract_all_pages" && extract && (
                    <>
                      <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1  cursor-move overflow-y-auto">
                        {apiPages.length > 0 &&
                          // !fixedRangeInput &&

                          apiPages.map((item, index) => (
                            <div
                              key={index}
                              className="flex m-3 relative border-[#b9b9b9] border-[1px] p-4 shadow-lg  items-center justify-center rounded-sm"
                            >
                              <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
                                <img
                                  src={item}
                                  alt={`Card ${index + 1}`}
                                  className="w-36 h-40 object-contain"
                                />
                              </div>
                              <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                                <img
                                  src={currect}
                                  alt="Check Icon"
                                  className="w-4 h-4"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}

                  {modeExtractPages === "select_pages" &&
                    selectedRangeForExtract === "" && (
                      <>
                        <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1  cursor-move overflow-y-auto">
                          {apiPages.length > 0 &&
                            // !fixedRangeInput &&

                            apiPages.map((item, index) => (
                              <div
                                key={index}
                                className="flex m-3 relative border-[#b9b9b9] border-[1px] p-4 shadow-lg  items-center justify-center rounded-sm"
                              >
                                <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
                                  <img
                                    src={item}
                                    alt={`Card ${index + 1}`}
                                    className="w-36 h-40 object-contain"
                                  />
                                </div>
                                {/* <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                            <img
                              src={currect}
                              alt="Check Icon"
                              className="w-4 h-4"
                            />
                          </div> */}
                              </div>
                            ))}
                        </div>
                      </>
                    )}

                  <>
                    <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1 cursor-move overflow-y-auto">
                      {apiPages.length > 0 &&
                        modeExtractPages === "select_pages" &&
                        extract &&
                        selectedRangeForExtract &&
                        apiPages.map((item, index) => {
                          const pageIndex = index + 1; // Pages are 1-based index
                          const isSelected =
                            selectedPagesForExtract.includes(pageIndex); // Check if this page is selected

                          return (
                            <div
                              key={index}
                              className={`flex m-3 relative border-[1px] p-4 shadow-lg items-center justify-center rounded-sm ${
                                isSelected
                                  ? "border-green-500"
                                  : "border-[#b9b9b9]"
                              }`}
                            >
                              <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
                                <img
                                  src={item}
                                  alt={`Card ${pageIndex}`}
                                  className="w-36 h-40 object-contain"
                                />
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                                  <img
                                    src={currect}
                                    alt="Check Icon"
                                    className="w-4 h-4"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </>
                </div>

                <div
                  className="flex flex-col justify-between  flex-wrap items-center w-full lg:w-[560px] 
                  border border-[#a6a6a6] bg-white gap-4 min-h-[96vh] 
                  relative overflow-y-auto bottom-0"
                >
                  <div className="px-[2rem] py-[3rem] flex flex-col gap-[1rem] w-[100%]  justify-center">
                    <p className="text-[1.6rem] text-center font-medium">
                      Split PDF
                    </p>
                    <div className="w-[100%] h-[1px] bg-[#a6a6a6]"></div>
                    <div className="flex justify-between gap-4 w-full">
                      <div
                        className={`relative ${
                          split ? "bg-gray-200" : "bg-gray-50"
                        } flex flex-col items-center py-[0.5rem] px-[2rem] justify-center rounded-lg hover:cursor-pointer`}
                        onClick={() => {
                          setSplit(true);
                          setExtract(false);
                          setSelectedRange("custom");
                        }}
                      >
                        {split && (
                          <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                            <img
                              src={currect}
                              alt="Check Icon"
                              className="w-4 h-4"
                            />
                          </div>
                        )}
                        <img
                          src="split.png"
                          alt="Split PDF Icon"
                          className="mb-2 rounded-xl w-[20%]"
                        />
                        <p className="font-bold text-lg">Split PDF</p>
                      </div>
                      <div
                        className={`relative ${
                          extract ? "bg-gray-200" : "bg-gray-50"
                        } flex flex-col items-center py-[0.5rem] px-[2rem] justify-center rounded-lg hover:cursor-pointer`}
                        onClick={() => {
                          setExtract(true);
                          setSplit(false);
                          setModeExtractPages("extract_all_pages");
                          setSelectedRange("");
                        }}
                      >
                        {extract && (
                          <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                            <img
                              src={currect}
                              alt="Check Icon"
                              className="w-4 h-4"
                            />
                          </div>
                        )}
                        <img
                          src="extract.png"
                          alt="Extract PDF Icon"
                          className="mb-2 rounded-xl w-[20%]"
                        />
                        <p className="font-bold text-lg">Extract PDF</p>
                      </div>
                    </div>

                    {split && (
                      <>
                        <div className="w-full">
                          <h1 className="font-bold text-lg mb-4">Range Mode</h1>
                          <div className="flex justify-between gap-4 mb-6">
                            <button
                              className={`px-4 py-2 border rounded-lg border-purple-500 transition-colors ${
                                selectedRange === "custom"
                                  ? "bg-purple-500 text-white"
                                  : "hover:bg-purple-500 hover:text-white"
                              }`}
                              onClick={() => {
                                setSelectedRange("custom");
                              }}
                            >
                              Custom Ranges
                            </button>
                            <button
                              className={`px-4 py-2 border rounded-lg border-purple-500 transition-colors ${
                                selectedRange === "fixed"
                                  ? "bg-purple-500 text-white"
                                  : "hover:bg-purple-500 hover:text-white"
                              }`}
                              onClick={() => setSelectedRange("fixed")}
                            >
                              Fixed Ranges
                            </button>
                          </div>
                        </div>
                        {selectedRange === "custom" && (
                          <>
                            <div
                              className="flex items-center justify-center flex-wrap overflow-y-auto h-[240px]"
                              ref={rangeRef}
                            >
                              {ranges.map((range, index) => (
                                <div key={range.id} className="w-full mb-6">
                                  <h1 className="text-lg font-bold mb-2">
                                    Range {index + 1}
                                  </h1>
                                  <div className="flex items-center justify-start gap-[1rem] w-[auto]">
                                    <div className="flex w-[40%] h-[100%] border-[1px] border-[#212121] rounded-md">
                                      <div className="flex items-center justify-center text-center px-[0.5rem] py-[0rem] border-r-[1px] border-[#212121]">
                                        <p className="text-[0.8rem] font-semibold">
                                          from range
                                        </p>
                                      </div>
                                      <div className="flex w-[40%] items-center justify-end text-center px-[0rem] py-[1rem]">
                                        <input
                                          type="number"
                                          name={`fromPage-${range.id}`}
                                          id={`fromPage-${range.id}`}
                                          value={
                                            ranges[index].fromPage != "0"
                                              ? ranges[index].fromPage
                                              : "1"
                                          }
                                          onChange={(e) => {
                                            handleChange(
                                              range.id,
                                              "from",
                                              e.target.value
                                            );
                                            console.log(
                                              "index : ",
                                              index,
                                              range.id,
                                              range?.fromPage,
                                              range?.toPage
                                            );
                                          }}
                                          className="text-[1rem] font-normal w-[80%] border-none outline-none"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex w-[40%] h-[100%] border-[1px] border-[#212121] rounded-md">
                                      <div className="flex items-center justify-center text-center px-[0.5rem] py-[0rem] border-r-[1px] border-[#212121]">
                                        <p className="text-[0.8rem] font-semibold">
                                          to range
                                        </p>
                                      </div>
                                      <div className="flex w-[40%] items-center justify-end text-center px-[0rem] py-[1rem]">
                                        <input
                                          type="number"
                                          name={`toPage-${range.id}`}
                                          id={`toPage-${range.id}`}
                                          value={ranges[index].toPage}
                                          onChange={(e) => {
                                            handleChange(
                                              range.id,
                                              "to",
                                              e.target.value
                                            );
                                          }}
                                          className="text-[1rem] font-normal w-[80%] border-none outline-none"
                                        />
                                      </div>
                                    </div>
                                    <MdDelete
                                      onClick={() => deleteRange(range.id)}
                                      className="text-red-500 text-3xl"
                                    />
                                  </div>
                                </div>
                              ))}

                              <div className="mb-6">
                                <button
                                  className="px-4 py-2 border border-purple-500 rounded-lg text-lg font-bold hover:bg-purple-500 hover:text-white flex gap-2 items-center justify-center"
                                  onClick={addRange}
                                >
                                  <span className="text-2xl">+</span> Add Range
                                </button>
                              </div>
                            </div>

                            {!isRangeValid && <RangeAlert />}

                            <div className="flex items-start mb-4 w-full">
                              <input
                                type="checkbox"
                                id="toggleCheckbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                className={`form-checkbox h-6 w-6 rounded transition-colors duration-300 ${
                                  isChecked
                                    ? "bg-blue-500 border-blue-500 rounded-full"
                                    : "bg-white border-gray-300 rounded-full"
                                }`}
                              />
                              <label
                                htmlFor="toggleCheckbox"
                                className="ml-2  text-gray-700 font-semibold"
                              >
                                Merge all ranges in one PDF file.
                              </label>
                            </div>
                          </>
                        )}

                        {selectedRange === "fixed" && (
                          <>
                            <div className="flex  gap-16 w-full">
                              <div className="  items-center">
                                <h1 className="font-semibold">
                                  Split into page ranges of:
                                </h1>
                              </div>
                              <div>
                                <input
                                  type="number"
                                  className="border rounded-sm p-1 border-black w-20"
                                  value={fixedRangeInput}
                                  onChange={(e) => {
                                    setFixedRangeInput(e.target.value);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="bg-blue-100 p-6 mt-5 rounded-sm">
                              <p className="font-semibold">
                                This PDF will be split into{" "}
                                {newRanges.length}{" "}
                                file(s) of{" "}
                                {fixedRangeInput || totalPagesNo}{" "}
                                page(s) each.
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}


                    {extract && (
                      <>
                        <div className="w-full">
                          <>
                            <h1 className="font-bold text-lg mb-4">
                              Extract Mode:
                            </h1>
                            <div className="flex justify-between gap-4 mb-6">
                              <button
                                className={`px-4 py-2 border rounded-lg border-purple-500 transition-colors ${
                                  modeExtractPages === "extract_all_pages"
                                    ? "bg-purple-500 text-white"
                                    : "hover:bg-purple-500 hover:text-white"
                                }`}
                                onClick={() => {
                                  setModeExtractPages("extract_all_pages");
                                }}
                              >
                                Extract all pages
                              </button>
                              <button
                                className={`px-4 py-2 border rounded-lg border-purple-500 transition-colors ${
                                  modeExtractPages === "select_pages"
                                    ? "bg-purple-500 text-white"
                                    : "hover:bg-purple-500 hover:text-white"
                                }`}
                                onClick={() =>
                                  setModeExtractPages("select_pages")
                                }
                              >
                                Select pages
                              </button>
                            </div>
                          </>

                          {modeExtractPages === "select_pages" && (
                            <>
                              <div className=" flex flex-col mb-4">
                                <h1 className="font-bold text-lg mb-4">
                                  Pages to extract:
                                </h1>
                                <input
                                  type="text"
                                  value={selectedRangeForExtract}
                                  onChange={handleInputChange}
                                  placeholder="e.g., 1,3-5,7"
                                  className="w-full p-2 border border-black rounded-sm"
                                />
                              </div>

                              <div className="flex items-start mb-4 w-full ">
                                <input
                                  type="checkbox"
                                  id="toggleCheckbox"
                                  checked={isChecked}
                                  onChange={handleCheckboxChange}
                                  className={`form-checkbox h-6 w-6 rounded transition-colors duration-300 ${
                                    isChecked
                                      ? "bg-blue-500 border-blue-500 rounded-full"
                                      : "bg-white border-gray-300 rounded-full"
                                  }`}
                                />
                                <label
                                  htmlFor="toggleCheckbox"
                                  className="ml-2  text-gray-700 font-semibold"
                                >
                                  Merge all ranges in one PDF file.
                                </label>
                              </div>
                            </>
                          )}

                          {modeExtractPages === "extract_all_pages" && (
                            <>
                              <div className="bg-blue-100 p-6 mt-5 rounded-sm">
                                <p className="font-semibold ">
                                  Selected pages will be converted into separate
                                  PDF files. {pages.length} PDF will be created.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}

                  </div>
                  <div className="bg-white relative border rounded-lg shadow-md w-full flex justify-center bottom-[1rem]">
                    <button
                      className={`bg-purple-600 text-white px-[2rem] py-[1.2rem] w-[90%] text-[1.4rem] rounded-lg ${
                        !isRangeValid && "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={createPdf}
                      disabled={!isRangeValid}
                    >
                      Split PDF
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

export default SplitPdf;






// import { useState, useEffect, useRef } from "react";
// import "tailwindcss/tailwind.css";
// import axios from "axios";
// import img1 from "/dropbox.png";
// import img2 from "/drive.png";
// import currect from "/currect-icon.png";
// import { MdDelete } from "react-icons/md";

// const SplitPdf = () => {
//   const [items, setItems] = useState([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [split, setSplit] = useState(true);
//   const [extract, setExtract] = useState(false);
//   const [selectedRange, setSelectedRange] = useState("custom");
//   const [pdfFile, setPdfFile] = useState([]);
//   const [ranges, setRanges] = useState([{ id: 0, fromPage: 1, toPage: 0 }]);
//   const [totalPagesNo, setTotalPagesNo] = useState(null);
//   const [splitedChunk, setSplitedChunk] = useState([]);
//   const [pages, setPages] = useState([]);
//   const [rangeArray, setRangeArray] = useState<number[][]>([]);
//   const rangeRef = useRef(null);
//   const [fixedRangeInput, setFixedRangeInput] = useState("");
//   const [newRanges, setNewRanges] = useState([]);
//   const [fixedRangeArray, setFixedRangeArray] = useState();
//   const [modeExtractPages, setModeExtractPages] = useState("");
//   const [selectedRangeForExtract, setselectedRangeForExtract] = useState("");
//   const [selectedPagesForExtract, setSelectedPagesForExtract] = useState([]);
//   const [formatedInputForExtract, setFormatedInputForExtract] = useState();
//   const [apiPages, setApiPages] = useState([]);
//   // console.log("Api pages is ::: ", apiPages);
//   const [error, setError] = useState("");
//   const [isRangeValid, setIsRangeValid] = useState(true); // Added state for range validity

//   const [selectedPages, setSelectedPages] = useState(
//     ranges.reduce(
//       (acc, range) => ({
//         ...acc,
//         [range.id]: {
//           from: pages[0]?? 0,
//           to: totalPagesNo ? parseInt(totalPagesNo) - 1 : 1,
//         },
//       }),
//       {}
//     )
//   );

//   console.log("Ranges is ", ranges.length);
//   useEffect(() => {
//     // Create a new array for transformed ranges
//     const transformedRanges: number[][] = [];

//     ranges.forEach((range) => {
//       transformedRanges.push([
//         parseInt(range.fromPage, 10),
//         parseInt(range.toPage, 10),
//       ]);
//     });

//     // Update the state with the transformed ranges
//     setRangeArray(transformedRanges);
//   }, [ranges]);

//   console.log("rangepdf:", selectedPages,pages);

 
//   const handleChange = (rangeId, field, value) => {
//     const parsedValue = parseInt(value, 10);

//     if (field === "from" && ranges.map((value)=> value.fromPage<value.toPage)) {
//       const adjustedValue = parsedValue > totalPagesNo ? pages[0] : parsedValue;
//       setRanges((prevRange) =>
//         prevRange.map((rangeChunk, i) =>
//           i === rangeId
//             ? { ...rangeChunk, fromPage: adjustedValue }
//             : rangeChunk
//         )
//       );
//     }

//     if (field === "to") {
//       const adjustedValue =
//         parsedValue > totalPagesNo ? totalPagesNo : parsedValue;

//       setRanges((prevRange) =>
//         prevRange.map((rangeChunk, i) =>
//           i === rangeId
//             ? { ...rangeChunk, toPage: adjustedValue }
//             : rangeChunk
//         )
//       );

//       setSelectedPages((prev) => ({
//         ...prev,
//         [rangeId]: { ...prev[rangeId], to: adjustedValue },
//       }));
//     }
//   };

//   const addRange = () => {
//     setRanges((prevRanges) => {
//       const newId = Math.max(...prevRanges.map(range=>range.id) , 0)+1;
//       return [
//         ...prevRanges,
//         {
//           id: newId,
//           fromPage: prevRanges[prevRanges.length-1]?.toPage < totalPagesNo ? Number(prevRanges[prevRanges.length-1]?.toPage) + 1 : Number(prevRanges[prevRanges.length-1]?.toPage),
//           toPage: Number(totalPagesNo),
//         },
//       ];
//     });  
//     setSplitedChunk(apiPages);
//   };

//   const deleteRange = (rangeId) => {
//     setRanges((prevrange) => prevrange.length>1? prevrange.filter((range) => range.id !== rangeId):prevrange);
//   };
//   useEffect(() => {
//     if (rangeRef.current) {
//       const lastChild = rangeRef.current.lastChild;
//       if (lastChild) {
//         lastChild.scrollIntoView({ behavior: "smooth" });
//       }
//     }
//   }, [ranges]);

//   const [isChecked, setIsChecked] = useState(false);

//   const handleCheckboxChange = () => {
//     setIsChecked((prevChecked) => !prevChecked);
//   };

//   function base64ToDataUrl(base64String, mimeType = "image/png") {
//     if (base64String.startsWith("data:")) {
//       return base64String;
//     }
//     return `data:${mimeType};base64,${base64String}`;
//   }

//   const handleFileChange = async (e) => {
//     // alert(e)
//     setIsLoading(true);
//     const files = Array.from(e.target.files);
//     setPdfFile(files);
//     const formData = new FormData();
//     files.forEach((file) => {
//       formData.append("files", file);
//     });

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/pdf_pages_with_number?files`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           responseType: "json",
//         }
//       );
//       const totalNoOfPages = response.data[0];
//       console.log("pages:", totalNoOfPages);

//       setTotalPagesNo(totalNoOfPages["Total pages"]);
//       console.log("final:", totalNoOfPages);

//       if (Array.isArray(response.data) && response.data.length > 1) {
//         const newApiPages = response.data
//           .slice(1)
//           .map((item) => {
//             if (item.file) {
//               const base64String = item.file;
//               const dataUrl = base64ToDataUrl(base64String);
//               return dataUrl;
//             } else {
//               console.error(
//                 "Missing file property in response data item:",
//                 item
//               );
//               return null;
//             }
//           })
//           .filter((dataUrl) => dataUrl !== null);
         
        
//         setApiPages((prevApiPages) => [...prevApiPages, ...newApiPages]);
//       } else {
//         console.error(
//           "Insufficient data in response or response is not an array"
//         );
//       }

//       setIsLoading(false);
//     } catch (error) {
//       setError("Error sending PDF: " + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   console.log("apiPAges",apiPages)

//   useEffect(() => {
//     if (apiPages?.length > 0 ) {
//       if (typeof apiPages === "object" && apiPages !== null) {
//         setSplitedChunk(apiPages);
//       } else {
//         console.error("Invalid JSON object:", apiPages);
//       }

//       console.log("setSplitedChunk : ", splitedChunk);
//     }
//   }, [apiPages]);

//   useEffect(() => {
//     if (totalPagesNo !== null) {
//       setPages(Array.from({ length: totalPagesNo }, (_, i) => i + 1));
//       setRanges((prevRanges) =>
//         prevRanges.map((range) =>
//           range.id === 0 ? { ...range, toPage: totalPagesNo } : range
//         )
//       );
//     }
//   }, [totalPagesNo]);

//   const createPdf = async () => {
//     setIsLoading(true);
//     const pdfPayload = new FormData();

//     items.forEach((item) => {
//       if (item.file) {
//         pdfPayload.append("files", item.file);
//       } else {
//         console.error(`Item ${item.fileName} is missing the file property.`);
//       }
//     });

//     const urlToSplit = `${import.meta.env.VITE_BACKEND_URL}organize_pdf/SPLIT`;
//     const urlToExtract = `${
//       import.meta.env.VITE_BACKEND_URL
//     }organize_pdf/EXTRACT_PAGES`;
//     const formData = new FormData();

//     pdfFile.forEach((file) => {
//       formData.append("files", file);
//     });

//     const rangesFormatted = JSON.stringify(rangeArray);
//     const fixedRangeArrayFormate = JSON.stringify(fixedRangeArray);
//     console.log("fixedRangeAeeayFormate", fixedRangeArray);
//     // Log the payload for debugging
//     console.log("FormData:");
//     for (const [key, value] of formData.entries()) {
//       console.log(key, value);
//     }

//     console.log("Params:", {
//       extract_page_num: 1,
//       is_merge_all: isChecked,
//       ranges: selectedRange === "fixed" ? fixedRangeArray : rangesFormatted,
//     });
//     console.log("Formated input is for extract", formatedInputForExtract);
//     const dummyRange = JSON.stringify([[1, 2]]);
//     const pageString = Array.from(
//       { length: pages.length },
//       (_, i) => i + 1
//     ).join(",");

//     await axios
//       .post(extract ? urlToExtract : urlToSplit, formData, {
//         params: {
//           page_num: extract
//             ? formatedInputForExtract ||
//               (modeExtractPages === "extract_all_pages" ? pageString : 1)
//             : 1,

//           is_merge_all:
//             modeExtractPages === "extract_all_pages" ? false : isChecked,
//           ranges: extract
//             ? dummyRange
//             : selectedRange === "fixed"
//             ? fixedRangeArrayFormate
//             : rangesFormatted,
//         },
//         responseType: "blob",
//         // headers: {
//         //   Authorization:
//         //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWZhdWx0dXNlciJ9.7tPuoXa76NJjM0Xmf7m4vR4JrgbIRctSzfn-7ZKXzn4",
//         // },
//       })
//       .then((response) => {
//         console.log("This is my response:--", response.data);
//         const link = document.createElement("a");
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         link.href = url;
//         link.download =
//           (ranges.length <= 1 && !isChecked) || isChecked
//             ? "converted.pdf"
//             : "converted.zip";

//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       })

//       .catch((error) => {
//         console.error("Error Creating PDF:", error);
//       })
//       .finally(() => {
//         setIsLoading(false);
//         setItems([]);
//       });
//   };

//   const calculateRanges = (input) => {
//     const chunkSize = parseInt(input);
//     const newRanges = [];

//     for (let i = 1; i <= pages.length; i += chunkSize) {
//       const fromPage = i;
//       const toPage = Math.min(i + chunkSize - 1, pages.length);
//       newRanges.push({ fromPage, toPage });
//     }
//     setFixedRangeArray(
//       newRanges.map((range) => [range.fromPage, range.toPage])
//     );
  
//     setNewRanges(newRanges);
//   };

//   useEffect(() => {
//     if (fixedRangeInput !== "") {
//       console.log("useEffect")
//       calculateRanges(fixedRangeInput);
//     }
//   }, [fixedRangeInput]);

//   // const handleFixedRangeInput = async () =>{
//   //     if (fixedRangeInput !== "") {
//   //     console.log("useEffect")
//   //     calculateRanges(fixedRangeInput);
//   //   }

//   // }


//   const parseSelectedPages = (input) => {
//     const pages = new Set();
//     input.split(",").forEach((part) => {
//       if (part.includes("-")) {
//         const [start, end] = part.split("-").map(Number);
//         for (let i = start; i <= end; i++) {
//           pages.add(i);
//         }
//       } else {
//         pages.add(Number(part));
//       }
//     });
//     return [...pages];
//   };

//   const formatSelectedPagesForExtract = (input) => {
//     let formattedPages = [];

//     input.split(",").forEach((part) => {
//       if (part.includes("-")) {
//         const [start, end] = part.split("-").map(Number);
//         for (let i = start; i <= end; i++) {
//           formattedPages.push(i);
//         }
//       } else {
//         formattedPages.push(Number(part));
//       }
//     });

//     const formattedString = formattedPages.join(",");

//     setFormatedInputForExtract(formattedString);

//     return formattedString;
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;

//     setselectedRangeForExtract(value);
//     setSelectedPagesForExtract(parseSelectedPages(value));
//     formatSelectedPagesForExtract(value);
//   };


//   console.log("selectedRange",selectedRange)

//   return (
//     <>
//       <div className="flex items-center justify-center min-h-screen relative">
//         {isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-75">
//             <div className="loader"></div>
//           </div>
//         )}
//         <div className="flex items-center justify-center rounded-lg w-screen p-0 min-h-screen">
//           {apiPages.length === 0 ? (
//             <div className="mb-4">
//               <div className="flex flex-col min-h-screen">
//                 <div className="flex flex-col items-center justify-center mt-8 px-4 sm:px-8 md:px-16 lg:px-24">
//                   <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800 mt-28">
//                     Split PDF file{" "}
//                   </h1>
//                   <h2 className="text-lg sm:text-xl md:text-3xl text-gray-700 text-center mt-4">
//                     Separate one page or a whole set for easy conversion into
//                     independent PDF files.{" "}
//                   </h2>
//                   <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
//                     <input
//                       type="file"
//                       // multiple
//                       accept=".pdf"
//                       onChange={handleFileChange}
//                       className="hidden"
//                       id="fileInput"
//                     />
//                     <label
//                       htmlFor="fileInput"
//                       className="p-8 sm:p-6 md:p-8 text-center bg-purple-600 sm:w-[400px] max-w-xs hover:bg-purple-700 
//                       rounded-xl text-white font-bold text-lg sm:text-xl md:text-2xl cursor-pointer"
//                     >
//                       Select Pdf Files
//                     </label>
//                     {/* <div className="flex flex-row gap-10 sm:flex-col mt-4 sm:mt-0 sm:gap-1">
//                       <button className="rounded-full p-4 bg-purple-600 text-white">
//                         <img src={img1} alt="" className="w-4 h-4" />
//                       </button>
//                       <button className="rounded-full p-4 bg-purple-600 text-white">
//                         <img src={img2} alt="" className="w-4 h-4" />
//                       </button>
//                     </div> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="relative bg-[#f2f2f2] pt-0 w-[100%] min-h-screen">
//               {isLoading && (
//                 <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-200 bg-opacity-75">
//                   <div className="loader"></div>
//                 </div>
//               )}
//               <div className="flex  flex-col lg:flex-row justify-between gap-10 lg:gap-40 mt-[2rem] relative">
//                 <div
//                   className="flex  flex-wrap justify-center max-sm:justify-start items-start h-[750px] ml-auto mr-auto mt-[4rem] 
//                   rounded gap-4 w-full lg:w-[80%] px-[4rem] max-md:py-[4rem] py-[6rem] overflow-y-auto"
//                 >
//                   <div className="flex  items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1 relative cursor-move overflow-y-auto">
//                     {ranges.length > 0 &&
//                       selectedRange === "custom" &&
//                       ranges.map((chunkedPages, index) => {
//                         console.log("chunkedNewPAges",chunkedPages,splitedChunk)
//                         return splitedChunk.length > 0 ? (
//                           <>
//                             {/* First page image */}
//                             <div className="flex m-3 border-[#b9b9b9] border-[1px] p-4 shadow-lg items-center justify-center rounded-sm">
//                               {/* <div className="relative flex flex-col items-center justify-center h-auto w-36 p-1 bg-gray-200 border-[#f2f2f2] border-2 shadow-sm"> */}
//                               <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
//                                 <img
//                                   src={
//                                     // ranges[index].fromPage != "0"
//                                     //   ? splitedChunk[index]?.[
//                                     //       String(
//                                     //         parseInt(ranges[index].fromPage) - 1
//                                     //       )
//                                     //     ]
//                                     //   : splitedChunk[index]?.[
//                                     //       ranges[index].fromPage
//                                     //     ]
//                                     ranges[index].fromPage  === 0 ?    splitedChunk[chunkedPages.fromPage] :    splitedChunk[chunkedPages.fromPage-1]
                                 
//                                   }
//                                   alt="First Page"
//                                   className="w-36 h-40 object-contain"
//                                 />
//                                 <span className="mt-2 text-sm font-semibold">
//                                   Page:
//                                   {ranges[index].fromPage  === 0 ? ranges[index].fromPage+1 : ranges[index].fromPage}
//                                 </span>
//                               </div>
//                               {/* </div> */}

//                               <div className="text-[2rem] items-center justify-center">
//                                 ...
//                               </div>

//                               {/* Last page image */}
//                               {/* <div className="relative flex flex-col items-center justify-center h-auto w-36 p-1 border-[#f2f2f2] bg-gray-200 border-2 shadow-sm"> */}
//                               <div className="text-center rounded-lg bg-gray-100 shadow-md relative p-1.5">
//                                 <img
//                                   src={
//                                     // splitedChunk[index]?.[
//                                     //   parseInt(chunkedPages.toPage) - 1
//                                     // ]
//                                     splitedChunk[chunkedPages.toPage-1]
//                                   }
//                                   alt="Last Page"
//                                   className="w-36 h-40 items-center object-contain"
//                                 />
//                                 <span className="mt-2 text-sm font-semibold">
//                                   Page: {ranges[index].toPage}
//                                 </span>
//                               </div>
//                             </div>
//                             {/* </div>  */}
//                           </>
//                         ) : null;
//                       })}
//                   </div>
// {/* fixed range */}
//                   {selectedRange === "fixed" && (
//                     <>
//                       <div className="flex items-center  flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1  cursor-move overflow-y-auto">
//                         {apiPages.length > 0 &&
//                           !fixedRangeInput &&
//                           apiPages.map((item, index) => (
//                             <div
//                               key={index}
//                               className="flex m-3 border-[#b9b9b9] border-[1px] p-4 shadow-lg  items-center justify-center rounded-sm"
//                             >
//                               <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
//                                 <img
//                                   src={item}
//                                   alt={`Card ${index + 1}`}
//                                   className="w-36 h-40 object-contain"
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     </>
//                   )}

              
//                     <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1  cursor-move overflow-y-auto">
//                       {fixedRangeInput !== "" && newRanges.length > 0 &&
//                         selectedRange === "fixed" &&
//                         newRanges.map((chunkedPages, index) => {
//                           console.log("chunkedPages",chunkedPages,splitedChunk[chunkedPages.fromPage-1])
//                           return (
//                             <div
//                               key={index}
//                               className="flex m-3 border-[#b9b9b9] border-[1px] p-4 shadow-lg items-center justify-center rounded-sm"
//                             >
//                               <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
//                                 <img
//                                   src={
//                                     splitedChunk[
//                                       chunkedPages.fromPage - 1
//                                     ]
//                                   }
//                                   alt={`Page ${chunkedPages.fromPage}`}
//                                   className="w-36 h-40 object-contain"
//                                 />
//                                 <span className="mt-2 text-sm font-semibold">
//                                   Page: {chunkedPages.fromPage}
//                                 </span>
//                               </div>
//                               <div className="text-[2rem] items-center justify-center">
//                                 ...
//                               </div>
//                               <div className="text-center rounded-lg bg-gray-100 shadow-md rounded-sm relative p-1.5">
//                                 <img
//                                   src={
//                                     splitedChunk[chunkedPages.toPage - 1]
//                                   }
//                                   alt={`Page ${chunkedPages.toPage}`}
//                                   className="w-36 h-40 items-center object-contain"
//                                 />
//                                 <span className="mt-2 text-sm font-semibold">
//                                   Page: {chunkedPages.toPage}
//                                 </span>
//                               </div>
//                             </div>
//                           )
//                         }
                     
//                         )}
//                     </div>

                
// {/* last */}
//                   {modeExtractPages === "extract_all_pages" && extract && (
//                     <>
//                       <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1  cursor-move overflow-y-auto">
//                         {apiPages.length > 0 &&
//                           // !fixedRangeInput &&

//                           apiPages.map((item, index) => (
//                             <div
//                               key={index}
//                               className="flex m-3 relative border-[#b9b9b9] border-[1px] p-4 shadow-lg  items-center justify-center rounded-sm"
//                             >
//                               <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
//                                 <img
//                                   src={item}
//                                   alt={`Card ${index + 1}`}
//                                   className="w-36 h-40 object-contain"
//                                 />
//                               </div>
//                               <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
//                                 <img
//                                   src={currect}
//                                   alt="Check Icon"
//                                   className="w-4 h-4"
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     </>
//                   )}

//                   {modeExtractPages === "select_pages" &&
//                     selectedRangeForExtract === "" && (
//                       <>
//                         <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1  cursor-move overflow-y-auto">
//                           {apiPages.length > 0 &&
//                             // !fixedRangeInput &&

//                             apiPages.map((item, index) => (
//                               <div
//                                 key={index}
//                                 className="flex m-3 relative border-[#b9b9b9] border-[1px] p-4 shadow-lg  items-center justify-center rounded-sm"
//                               >
//                                 <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
//                                   <img
//                                     src={item}
//                                     alt={`Card ${index + 1}`}
//                                     className="w-36 h-40 object-contain"
//                                   />
//                                 </div>
//                                 {/* <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
//                             <img
//                               src={currect}
//                               alt="Check Icon"
//                               className="w-4 h-4"
//                             />
//                           </div> */}
//                               </div>
//                             ))}
//                         </div>
//                       </>
//                     )}

//                   <>
//                     <div className="flex items-center flex-wrap max-md:flex-col justify-center h-auto w-auto rounded-md p-1 cursor-move overflow-y-auto">
//                       {apiPages.length > 0 &&
//                         modeExtractPages === "select_pages" &&
//                         extract &&
//                         selectedRangeForExtract &&
//                         apiPages.map((item, index) => {
//                           const pageIndex = index + 1; // Pages are 1-based index
//                           const isSelected =
//                             selectedPagesForExtract.includes(pageIndex); // Check if this page is selected

//                           return (
//                             <div
//                               key={index}
//                               className={`flex m-3 relative border-[1px] p-4 shadow-lg items-center justify-center rounded-sm ${
//                                 isSelected
//                                   ? "border-green-500"
//                                   : "border-[#b9b9b9]"
//                               }`}
//                             >
//                               <div className="text-center items-center bg-gray-100 shadow-md p-1.5 rounded-sm relative">
//                                 <img
//                                   src={item}
//                                   alt={`Card ${pageIndex}`}
//                                   className="w-36 h-40 object-contain"
//                                 />
//                               </div>
//                               {isSelected && (
//                                 <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
//                                   <img
//                                     src={currect}
//                                     alt="Check Icon"
//                                     className="w-4 h-4"
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </>
//                 </div>

//                 <div
//                   className="flex flex-col justify-between  flex-wrap items-center w-full lg:w-[560px] 
//                   border border-[#a6a6a6] bg-white gap-4 min-h-[96vh] 
//                   relative overflow-y-auto bottom-0"
//                 >
//                   <div className="px-[2rem] py-[3rem] flex flex-col gap-[1rem] w-[100%]  justify-center">
//                     <p className="text-[1.6rem] text-center font-medium">
//                       Split PDF
//                     </p>
//                     <div className="w-[100%] h-[1px] bg-[#a6a6a6]"></div>
//                     <div className="flex justify-between gap-4 w-full">
//                       <div
//                         className={`relative ${
//                           split ? "bg-gray-200" : "bg-gray-50"
//                         } flex flex-col items-center py-[0.5rem] px-[2rem] justify-center rounded-lg hover:cursor-pointer`}
//                         onClick={() => {
//                           setSplit(true);
//                           setExtract(false);
//                           setSelectedRange('custom')
//                         }}
//                       >
//                         {split && (
//                           <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
//                             <img
//                               src={currect}
//                               alt="Check Icon"
//                               className="w-4 h-4"
//                             />

//                           </div>
//                         )}
//                         <img
//                           src="split.png"
//                           alt="Split PDF Icon"
//                           className="mb-2 rounded-xl w-[20%]"
//                         />
//                         <p className="font-bold text-lg">Split PDF</p>
//                       </div>
//                       <div
//                         className={`relative ${
//                           extract ? "bg-gray-200" : "bg-gray-50"
//                         } flex flex-col items-center py-[0.5rem] px-[2rem] justify-center rounded-lg hover:cursor-pointer`}
//                         onClick={() => {
//                           setExtract(true);
//                           setSplit(false);
//                           setModeExtractPages("extract_all_pages")
//                           setSelectedRange("")
//                         }}
//                       >
//                         {extract && (
//                           <div className="absolute top-2 left-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
//                             <img
//                               src={currect}
//                               alt="Check Icon"
//                               className="w-4 h-4"
//                             />
//                           </div>
//                         )}
//                         <img
//                           src="extract.png"
//                           alt="Extract PDF Icon"
//                           className="mb-2 rounded-xl w-[20%]"
//                         />
//                         <p className="font-bold text-lg"
                        
//                         >Extract PDF</p>
//                       </div>
//                     </div>


//                     {split && (
//                       <>
//                         <div className="w-full">
//                           <h1 className="font-bold text-lg mb-4">Range Mode</h1>
//                           <div className="flex justify-between gap-4 mb-6">
//                             <button
//                               className={`px-4 py-2 border rounded-lg border-purple-500 transition-colors ${
//                                 selectedRange === "custom"
//                                   ? "bg-purple-500 text-white"
//                                   : "hover:bg-purple-500 hover:text-white"
//                               }`}
//                               onClick={() => {
//                                 setSelectedRange("custom")
                              
//                               }}
//                             >
//                               Custom Ranges
//                             </button>
//                             <button
//                               className={`px-4 py-2 border rounded-lg border-purple-500 transition-colors ${
//                                 selectedRange === "fixed"
//                                   ? "bg-purple-500 text-white"
//                                   : "hover:bg-purple-500 hover:text-white"
//                               }`}
//                               onClick={() => setSelectedRange("fixed")}
//                             >
//                               Fixed Ranges
//                             </button>
//                           </div>
//                         </div>
//                         {selectedRange === "custom" && (
//                           <>
//                             <div
//                               className="flex items-center justify-center flex-wrap overflow-y-auto h-[240px]"
//                               ref={rangeRef}
//                             >
//                               {ranges.map((range, index) => (
//                                 <div key={range.id} className="w-full mb-6">
//                                   <h1 className="text-lg font-bold mb-2">
//                                     Range {index + 1}
//                                   </h1>
//                                   <div className="flex items-center justify-start gap-[1rem] w-[auto]">
//                                     <div className="flex w-[40%] h-[100%] border-[1px] border-[#212121] rounded-md">
//                                       <div className="flex items-center justify-center text-center px-[0.5rem] py-[0rem] border-r-[1px] border-[#212121]">
//                                         <p className="text-[0.8rem] font-semibold">
//                                           from range
//                                         </p>
//                                       </div>
//                                       <div className="flex w-[40%] items-center justify-end text-center px-[0rem] py-[1rem]">
//                                         <input
//                                           type="number"
//                                           name={`fromPage-${range.id}`}
//                                           id={`fromPage-${range.id}`}
//                                           // value={selectedPages[range.id]?.from}
//                                           value={
//                                             ranges[index].fromPage != "0"
//                                               ? ranges[index].fromPage
//                                               : "1"
//                                           }
//                                           onChange={(e) => {
//                                             handleChange(
//                                               range.id,
//                                               "from",
//                                               e.target.value
//                                             );
//                                             console.log(
//                                               "index : ",
//                                               index,
//                                               range.id,
//                                               range?.fromPage,
//                                               range?.toPage
//                                             );
//                                           }}
//                                           className="text-[1rem] font-normal w-[80%] border-none outline-none"
//                                           // placeholder={
//                                           //   selectedPages[range.id]?.from
//                                           // }
//                                         />
//                                       </div>
//                                     </div>
//                                     <div className="flex w-[40%] h-[100%] border-[1px] border-[#212121] rounded-md">
//                                       <div className="flex items-center justify-center text-center px-[0.5rem] py-[0rem] border-r-[1px] border-[#212121]">
//                                         <p className="text-[0.8rem] font-semibold">
//                                           to range
//                                         </p>
//                                       </div>
//                                       <div className="flex w-[40%] items-center justify-end text-center px-[0rem] py-[1rem]">
//                                         <input
//                                           type="number"
//                                           name={`toPage-${range.id}`}
//                                           id={`toPage-${range.id}`}
//                                           // value={selectedPages[range.id]?.to}
//                                           value={ranges[index].toPage}
//                                           onChange={(e) => {
//                                             handleChange(
//                                               range.id,
//                                               "to",
//                                               e.target.value
//                                             );
//                                           }}
//                                           className="text-[1rem] font-normal w-[80%] border-none outline-none"
//                                           // placeholder={totalPagesNo}
//                                         />
//                                       </div>
//                                     </div>
//                                     <MdDelete
//                                       onClick={() => deleteRange(range.id)}
//                                       className="text-red-500 text-3xl"
//                                     />
//                                   </div>
//                                 </div>
//                               ))}

//                               <div className="mb-6">
//                                 <button
//                                   className="px-4 py-2 border border-purple-500 rounded-lg text-lg font-bold hover:bg-purple-500 
//                         hover:text-white flex gap-2 items-center justify-center"
//                                   onClick={addRange}
//                                 >
//                                   <span className="text-2xl">+</span> Add Range
//                                 </button>
//                               </div>
//                             </div>

//                             <div className="flex items-start mb-4 w-full">
//                               <input
//                                 type="checkbox"
//                                 id="toggleCheckbox"
//                                 checked={isChecked}
//                                 onChange={handleCheckboxChange}
//                                 className={`form-checkbox h-6 w-6 rounded transition-colors duration-300 ${
//                                   isChecked
//                                     ? "bg-blue-500 border-blue-500 rounded-full"
//                                     : "bg-white border-gray-300 rounded-full"
//                                 }`}
//                               />
//                               <label
//                                 htmlFor="toggleCheckbox"
//                                 className="ml-2  text-gray-700 font-semibold"
//                               >
//                                 Merge all ranges in one PDF file.
//                               </label>
//                             </div>
//                           </>
//                         )}

//                         {selectedRange === "fixed" && (
//                           <>
//                             <div className="flex  gap-16 w-full">
//                               <div className="  items-center">
//                                 <h1 className="font-semibold">
//                                   Split into page ranges of:
//                                 </h1>
//                               </div>
//                               <div>
//                                 <input
//                                   type="number"
//                                   className="border rounded-sm p-1 border-black w-20"
//                                   value={fixedRangeInput}
//                                   onChange={(e) => {
//                                     // alert(e.target.value);
//                                     setFixedRangeInput(e.target.value);
//                                     // handleFixedRangeInput()
//                                   }}
//                                 />
//                               </div>
//                             </div>

//                             <div className="bg-blue-100 p-6 mt-5 rounded-sm">
//                               <p className="font-semibold ">
//                                 This PDF will be split into files of 1 pages.{" "}
//                                 {pages.length}
//                                 PDFs will be created.
//                               </p>
//                             </div>
//                           </>
//                         )}
//                       </>
//                     )}


//                     {extract && (
//                       <>
//                         <div className="w-full">
//                           <>
//                             <h1 className="font-bold text-lg mb-4">
//                               Extract Mode:
//                             </h1>
//                             <div className="flex justify-between gap-4 mb-6">
//                               <button
//                                 className={`px-4 py-2 border rounded-lg border-purple-500 transition-colors ${
//                                   modeExtractPages === "extract_all_pages"
//                                     ? "bg-purple-500 text-white"
//                                     : "hover:bg-purple-500 hover:text-white"
//                                 }`}
//                                 onClick={() => {
//                                   setModeExtractPages("extract_all_pages");
//                                   // setIsChecked(true);
//                                 }}
//                               >
//                                 Extract all pages
//                               </button>
//                               <button
//                                 className={`px-4 py-2 border rounded-lg border-purple-500 transition-colors ${
//                                   modeExtractPages === "select_pages"
//                                     ? "bg-purple-500 text-white"
//                                     : "hover:bg-purple-500 hover:text-white"
//                                 }`}
//                                 onClick={() =>
//                                   setModeExtractPages("select_pages")
//                                 }
//                               >
//                                 Select pages
//                               </button>
//                             </div>
//                           </>

//                           {modeExtractPages === "select_pages" && (
//                             <>
//                               <div className=" flex flex-col mb-4">
//                                 <h1 className="font-bold text-lg mb-4">
//                                   Pages to extract:
//                                 </h1>
//                                 <input
//                                   type="text"
//                                   value={selectedRangeForExtract}
//                                   onChange={handleInputChange}
//                                   placeholder="e.g., 1,3-5,7"
//                                   className="w-full p-2 border border-black rounded-sm"
//                                 />
//                               </div>

//                               <div className="flex items-start mb-4 w-full ">
//                                 <input
//                                   type="checkbox"
//                                   id="toggleCheckbox"
//                                   checked={isChecked}
//                                   onChange={handleCheckboxChange}
//                                   className={`form-checkbox h-6 w-6 rounded transition-colors duration-300 ${
//                                     isChecked
//                                       ? "bg-blue-500 border-blue-500 rounded-full"
//                                       : "bg-white border-gray-300 rounded-full"
//                                   }`}
//                                 />
//                                 <label
//                                   htmlFor="toggleCheckbox"
//                                   className="ml-2  text-gray-700 font-semibold"
//                                 >
//                                   Merge all ranges in one PDF file.
//                                 </label>
//                               </div>
//                             </>
//                           )}

//                           {modeExtractPages === "extract_all_pages" && (
//                             <>
//                               <div className="bg-blue-100 p-6 mt-5 rounded-sm">
//                                 <p className="font-semibold ">
//                                   Selected pages will be converted into separate
//                                   PDF files. {pages.length} PDF will be created.
//                                 </p>
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       </>
//                     )}

//                   </div>
//                   <div className="bg-white relative border rounded-lg shadow-md w-full flex justify-center bottom-[1rem]">
//                   <button
//                       className={`bg-purple-600 text-white px-[2rem] py-[1.2rem] w-[90%] text-[1.4rem] rounded-lg ${
//                         !isRangeValid && "opacity-50 cursor-not-allowed"
//                       }`}
//                       onClick={createPdf}
//                       disabled={!isRangeValid}
//                     >
//                       Split PDF
//                     </button>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SplitPdf;
