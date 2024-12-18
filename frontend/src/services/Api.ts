import axios, { AxiosRequestConfig } from 'axios';
let BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;
// let BASE_URL = "http://localhost:7000/pharynxocr"
let DOC_ANALYSER_BASE_URL = `${import.meta.env.VITE_DOC_ANALYSER_URL}`;
export const apiRequest = async (
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  options?: AxiosRequestConfig
) => {
  const response = await axios({
    method,
    url: `${DOC_ANALYSER_BASE_URL}${url}`, // prepend the base URL to the route
    data,
    ...options,
  });
  return response.data;
};


export const apiReq = async (
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  options?: AxiosRequestConfig
) => {
  const response = await axios({
    method,
    url: `${BASE_URL}${url}`, // prepend the base URL to the route
    data,
    ...options,
  });
  return response.data;
};










// // Example of how `apiRequest` could be structured
// export const apiRequest = async (method: string, url: string, data: any = {}, config: any = {}) => {
//   try {
//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         ...config.headers,
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Optional: add token if needed
//       },
//       body: method === 'POST' || method === 'PUT' ? data : undefined,
//     });

//     // Parsing the JSON response
//     const result = await response.json();
//     if (!response.ok) {
//       throw new Error(result.message || "Something went wrong");
//     }
//     return result;
//   } catch (error) {
//     console.error("API Request failed:", error);
//     throw error;
//   }
// };
