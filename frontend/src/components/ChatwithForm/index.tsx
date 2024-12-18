import { useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import DragDrop from "../Dragdrop.tsx";
import EditableForm from "./EditableForm.tsx";

const FromToEXcel = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState([]);
    const [pdfUrl, setPdfUrl] = useState();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setItems(file);

        if (file) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post(
                    "https://buddy.pharynxai.in/pharynxocrbackend/chat_img/extract-form-data",                    
                    // "https://severely-feasible-swan.ngrok-free.app/chat_img/extract-form-data",
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                console.log('File uploaded successfully:', response.data.extracted_data);
                // setPdfUrl(response.data.pdf_url);
                // console.log("pdfUrl:", response.data.pdf_url);

                setInitialData(response.data.extracted_data);

                setIsLoading(false);
            } catch (error) {
                console.error('File upload failed:', error);
            }
        } else {
            console.log('No file selected');
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">

                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-gray-200 bg-opacity-75">
                        <div className="loader"></div>
                        <p className="text-gray-800 text-xl font-medium mt-4">We are processing your details...</p>
                    </div>
                )}

                <div className="flex items-center justify-center rounded-lg w-screen p-0">
                    {items.length === 0 ? (
                        <DragDrop items={items} setItems={setItems}>
                            <div className="mb-4 ">
                                <div className="flex flex-col min-h-screen">
                                <div className="flex flex-col items-center justify-center mt-8 px-4 sm:px-8 md:px-16 lg:px-24">
                                    <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800 mt-28">
                                        Seamless Form Data Extraction to Excel
                                    </h1>
                                    <h2 className="text-lg sm:text-xl md:text-2xl text-gray-700 md:items-center md:text-center md:justify-center text-center items-center justify-center mt-4">
                                        Extracting manually entered form data to Excel with ease
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
                                            Select PDF Files
                                        </label>
                                    </div>

                                </div>
                                </div>
                            </div>
                        </DragDrop>
                    ) : (
                        <div className="bg-[#f2f2f2] pt-0 w-screen">
                            <div className="flex flex-col lg:flex-row justify-between mt-[2rem] gap-2">

                                {/* Second div (form data display) */}
                                <div className="flex flex-col items-center w-full  border border-[#a6a6a6] bg-white gap-2 min-h-[95vh] relative">
                                    <div className="px-[0rem] pt-8 flex flex-col w-[100%]">
                                        <p className="text-[1.6rem] text-center font-medium p-2">
                                            Form Details
                                        </p>
                                        <div className="w-full h-[1px] bg-[#a6a6a6]"></div>
                                    </div>

                                    {initialData?.length > 0 && <EditableForm initialData={initialData} />}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FromToEXcel;



{/* First div (image container) */ }
{/* <div className="w-full overflow-x-auto">
                                    {initialData?.length > 0 && (
                                        <div className="flex gap-4 overflow-x-auto">
                                            {initialData.map((pageData, index) => (
                                                <div key={index} className="flex-none w-[300px] h-[300px]">
                                                    <img
                                                        src={pageData.url}
                                                        alt={`Page ${pageData.page}`}
                                                        className="object-contain w-full h-full rounded-lg shadow-lg"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div> */}

