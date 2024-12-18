// import { apiReq } from "./Api";

// const OrganizePdfService = async (pageNum, isMergeAll, ranges) => {
//   if (!pageNum || !ranges) {
//     throw new Error("Page number and ranges are required.");
//   }

//   const queryParams = new URLSearchParams({
//     page_num: pageNum,
//     is_merge_all: isMergeAll ? 1 : 0, 
//     ranges: JSON.stringify(ranges), 
//   }).toString();

//   const endpoint = `organize_pdf/MERGE?${queryParams}`;

//   try {
//     const response = await apiReq('post', endpoint);

//     return response;
//   } catch (error) {
//     throw new Error('Error organizing the PDF.');
//   }
// };

// export default OrganizePdfService;


import { apiReq } from "./Api";

const OrganizePdfService = async (pdfPayload) => {
  const endpointurl = `organize_pdf/MERGE?page_num=2,1&is_merge_all=0&ranges=[[1,2], [1,6]]`;
  console.log("endpoint:", endpointurl);

  try {
    const response = await apiReq('post', endpointurl, pdfPayload, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure this is set correctly
      },
      responseType: "blob", // Expect a blob response (PDF file)
    });

    // Check if the response is a valid blob
    if (response.data instanceof Blob) {
      console.log("PDF Blob received:", response.data);
      return response; // Returning the response with the Blob data
    } else {
      throw new Error("The response is not a valid PDF Blob.");
    }
  } catch (error) {
    console.error("Error in OrganizePdfService:", error);
    throw new Error("Error organizing the PDF.");
  }
};

export default OrganizePdfService;
