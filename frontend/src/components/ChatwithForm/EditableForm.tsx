import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { MdFileDownloadDone } from "react-icons/md";

const flattenObject = (obj, prefix = '') => {
  let result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
};

const EditableForm = ({ initialData }) => {
  console.log("Initial Data:", initialData);
  
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [isConvertDisabled, setIsConvertDisabled] = useState(true);
  const [formData, setFormData] = useState(initialData?.map((page) => ({
    ...page,
    flattenedData: flattenObject(page.data),
  })));

  const handleChange = (pageIndex, field, value) => {
    const updatedData = [...formData];
    updatedData[pageIndex].flattenedData[field] = value;
    setFormData(updatedData);
    console.log("Updated Data:", updatedData);
  };

  const handleSave = () => {
    setIsConvertDisabled(false);
    setIsSaveClicked(true);
    console.log("Data saved:", formData);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    formData.forEach((pageData, index) => {
      const sheetData = Object.entries(pageData.flattenedData).map(([key, value]) => ({
        Field: key,
        Value: value,
      }));

      const ws = XLSX.utils.json_to_sheet(sheetData);
      const sheetName = `Page ${pageData.page}`;
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, 'data.xlsx');
  };

  const handleEdit = () => {
    setIsSaveClicked(false); 
    setIsConvertDisabled(true); 
  };

  const isFieldEmpty = (value) => {
    return value === "" || value === undefined || value === null;
  };

  return (
    <div className="w-full ">
      <div className="m text-center flex justify-end gap-1 items-center p-2">
        {!isSaveClicked ? (
          <Button
            onClick={handleSave}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Save Data
          </Button>
        ) : (
          <MdFileDownloadDone className="text-3xl" />
        )}

        {/* Convert to Excel button */}
        <Button
          onClick={exportToExcel}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg ml-2"
          disabled={isConvertDisabled}
        >
          Convert To Excel
        </Button>

        {/* Edit Button */}
        {isSaveClicked && (
          <Button
            onClick={handleEdit}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg ml-2"
          >
            Edit Data
          </Button>
        )}
      </div>

      <div className="w-full px-6 py-2 h-[730px] overflow-y-auto rounded-md shadow-md ">
        {formData.map((page, pageIndex) => (
          <div key={pageIndex} className="flex mb-6 ">
            {/* Image Display */}
            <div className="w-2/3  h-screen pl-4">
              {/* <h2 className="text-xl font-semibold mb-4">Page {page.page}</h2> */}
              <img
                src={page.url}
                alt={`Page ${page.page}`}
                className="w-[90%] h-screen "
              />
            </div>

            <div className="w-1/2 pr-4 h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Page {page.page}</h2>
              {Object.keys(page.flattenedData).map((field, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-[#e0e0e0]"
                >
                  <span className="text-lg font-medium text-[#333333]">{field}:</span>

                  <input
                    type="text"
                    value={page.flattenedData[field]}
                    onChange={(e) => handleChange(pageIndex, field, e.target.value)}
                    className={`text-[#555555] border border-gray-300 rounded px-2 py-1 ${isFieldEmpty(page.flattenedData[field]) ? 'bg-gray-300' : ''}`}
                    disabled={isSaveClicked}
                  />
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default EditableForm;


// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import React, { useState } from "react";
// import { Button } from '@/components/ui/button';
// import { MdFileDownloadDone } from "react-icons/md";

// const flattenObject = (obj, prefix = '') => {
//   let result = {};

//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = prefix ? `${prefix}.${key}` : key;

//     if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//       Object.assign(result, flattenObject(value, newKey));
//     } else {
//       result[newKey] = value;
//     }
//   }

//   return result;
// };

// const EditableForm = ({ initialData }) => {
//   console.log("Initial Data:", initialData);
  
//   const [isSaveClicked, setIsSaveClicked] = useState(false);
//   const [isConvertDisabled, setIsConvertDisabled] = useState(true);
//   const [formData, setFormData] = useState(initialData?.map((page) => ({
//     ...page,
//     flattenedData: flattenObject(page.data),
//   })));

//   const handleChange = (pageIndex, field, value) => {
//     const updatedData = [...formData];
//     updatedData[pageIndex].flattenedData[field] = value;
//     setFormData(updatedData);
//     console.log("Updated Data:", updatedData);
//   };

//   const handleSave = () => {
//     setIsConvertDisabled(false);
//     setIsSaveClicked(true);
//     console.log("Data saved:", formData);
//   };

//   const exportToExcel = () => {
//     const wb = XLSX.utils.book_new();

//     formData.forEach((pageData, index) => {
//       const sheetData = Object.entries(pageData.flattenedData).map(([key, value]) => ({
//         Field: key,
//         Value: value,
//       }));

//       const ws = XLSX.utils.json_to_sheet(sheetData);
//       const sheetName = `Page ${pageData.page}`;
//       XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     });

//     XLSX.writeFile(wb, 'data.xlsx');
//   };

//   const handleEdit = () => {
//     setIsSaveClicked(false); 
//     setIsConvertDisabled(true); 
//   };

//   return (
//     <div className="w-full">
//       <div className="m text-center flex justify-end gap-1 items-center p-2">
//         {!isSaveClicked ? (
//           <Button
//             onClick={handleSave}
//             className="bg-purple-600 text-white px-6 py-2 rounded-lg"
//           >
//             Save Data
//           </Button>
//         ) : (
//           <MdFileDownloadDone className="text-3xl" />
//         )}

//         {/* Convert to Excel button */}
//         <Button
//           onClick={exportToExcel}
//           className="bg-purple-600 text-white px-6 py-2 rounded-lg ml-2"
//           disabled={isConvertDisabled}
//         >
//           Convert To Excel
//         </Button>

//         {/* Edit Button */}
//         {isSaveClicked && (
//           <Button
//             onClick={handleEdit}
//             className="bg-gray-600 text-white px-6 py-2 rounded-lg ml-2"
//           >
//             Edit Data
//           </Button>
//         )}
//       </div>

//       <div className="w-full  px-6 py-2 h-[730px] overflow-y-auto rounded-md shadow-md">
//         {formData.map((page, pageIndex) => (
          
//           <div key={pageIndex} className="flex mb-6">
//                         {/* Image Display */}
//                      <div className="w-2/3 pl-4">
//               <h2 className="text-xl font-semibold mb-4">Page {page.page}</h2>
//               <img
//                 src={page.url}
//                 alt={`Page ${page.page}`}
//                 className="w-[90%] h-screen objec "
//               />
//             </div>

//             <div className="w-1/2 pr-4 h-screen overflow-y-auto">
//               <h2 className="text-xl font-semibold mb-4">Page {page.page}</h2>
//               {Object.keys(page.flattenedData).map((field, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between py-2 border-b border-[#e0e0e0] "
//                 >
//                   <span className="text-lg font-medium text-[#333333]">{field}:</span>

//                   <input
//                     type="text"
//                     value={page.flattenedData[field]}
//                     onChange={(e) => handleChange(pageIndex, field, e.target.value)}
//                     className="text-[#555555] border border-gray-300 rounded px-2 py-1"
//                     disabled={isSaveClicked} 
//                   />
//                 </div>
//               ))}
//             </div>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EditableForm;



// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import React, { useState } from "react";
// import { Button } from '@/components/ui/button';
// import { MdFileDownloadDone } from "react-icons/md";

// const flattenObject = (obj, prefix = '') => {
//   let result = {};

//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = prefix ? `${prefix}.${key}` : key;

//     if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//       Object.assign(result, flattenObject(value, newKey));
//     } else {
//       result[newKey] = value;
//     }
//   }

//   return result;
// };

// const EditableForm = ({ initialData }) => {
//   console.log("Initial Data:", initialData);
  
//   const [isSaveClicked, setIsSaveClicked] = useState(false);
//   const [isConvertDisabled, setIsConvertDisabled] = useState(true);
//   const [formData, setFormData] = useState(initialData?.map((page) => ({
//     ...page,
//     flattenedData: flattenObject(page.data),
//   })));

//   const handleChange = (pageIndex, field, value) => {
//     const updatedData = [...formData];
//     updatedData[pageIndex].flattenedData[field] = value;
//     setFormData(updatedData);
//     console.log("Updated Data:", updatedData);
//   };

//   const handleSave = () => {
//     setIsConvertDisabled(false);
//     setIsSaveClicked(true);
//     console.log("Data saved:", formData);
//   };

//   const exportToExcel = () => {
//     const wb = XLSX.utils.book_new();

//     formData.forEach((pageData, index) => {
//       const sheetData = Object.entries(pageData.flattenedData).map(([key, value]) => ({
//         Field: key,
//         Value: value,
//       }));

//       const ws = XLSX.utils.json_to_sheet(sheetData);
//       const sheetName = `Page ${pageData.page}`;
//       XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     });

//     XLSX.writeFile(wb, 'data.xlsx');
//   };

//   const handleEdit = () => {
//     setIsSaveClicked(false); 
//     setIsConvertDisabled(true); 
//   };

//   return (
//     <div className="w-full ">
//       <div className="m text-center flex justify-end gap-1 items-center p-2">
//         {!isSaveClicked ? (
//           <Button
//             onClick={handleSave}
//             className="bg-purple-600 text-white px-6 py-2 rounded-lg"
//           >
//             Save Data
//           </Button>
//         ) : (
//           <MdFileDownloadDone className="text-3xl" />
//         )}

//         {/* Convert to Excel button */}
//         <Button
//           onClick={exportToExcel}
//           className="bg-purple-600 text-white px-6 py-2 rounded-lg ml-2"
//           disabled={isConvertDisabled}
//         >
//           Convert To Excel
//         </Button>

//         {/* Edit Button */}
//         {isSaveClicked && (
//           <Button
//             onClick={handleEdit}
//             className="bg-gray-600 text-white px-6 py-2 rounded-lg ml-2"
//           >
//             Edit Data
//           </Button>
//         )}
//       </div>

//       <div className="w-full border px-6 py-4 h-[730px] overflow-y-auto rounded-md shadow-md">
//         {formData.map((page, pageIndex) => (
//           <div key={pageIndex}>
//             <h2 className="text-xl font-semibold mb-4">Page {page.page}</h2>
//             {Object.keys(page.flattenedData).map((field, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between py-2 border-b border-[#e0e0e0]"
//               >
//                 <span className="text-lg font-medium text-[#333333]">{field}:</span>

//                 <input
//                   type="text"
//                   value={page.flattenedData[field]}
//                   onChange={(e) => handleChange(pageIndex, field, e.target.value)}
//                   className="text-[#555555] border border-gray-300 rounded px-2 py-1"
//                   disabled={isSaveClicked} 
//                 />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EditableForm;
