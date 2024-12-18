import { apiReq } from "./Api";

const ConvertToPdfService = async (conversionType, file) => {
  if (!file) {
    throw new Error("No file provided for conversion.");
  }

  const formData = new FormData();
  formData.append('file', file);

  const endpoint = `/pdf/from_pdf/${conversionType}`;

  try {
    const response = await apiReq('post', endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; // Assuming the API returns the converted file URL or result
  } catch (error) {
    throw new Error('Error during the conversion process.');
  }
};

export default ConvertToPdfService;
