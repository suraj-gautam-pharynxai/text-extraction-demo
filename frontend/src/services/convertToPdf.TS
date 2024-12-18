import { apiReq } from "./Api";

const ConvertToPdfService = async (conversionType, file) => {
  if (!file) {
    throw new Error("No file provided for conversion.");
  }

  const formData = new FormData();
  formData.append('file', file);

  const endpoint = `/pdf/convert_to_pdf/${conversionType}`;

  try {
    const response = await apiReq('post', endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; 
  } catch (error) {
    throw new Error('Error during the conversion process.');
  }
};

export default ConvertToPdfService;
