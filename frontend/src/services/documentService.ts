import { apiRequest } from "./Api"; // Adjust the path as needed

// Fixed workspace ID
const workspaceId = 'i-love-pdf-69606269';

// Base URL configuration
export const API_ROUTES = {
  WORKSPACE: {
    UPLOAD_PDF: `/workspace/${workspaceId}/upload`,
    FILES: `/workspace/${workspaceId}/files`,
    EMBED: `/workspace/${workspaceId}/update-embeddings`,
    CHAT: `/chats/documents?workspace=${workspaceId}`,
    DELETE_FILE: `/workspace/${workspaceId}/file`,  // New delete route
  },
};

// WorkspaceService
export const WorkspaceService = {
  /**
   * Upload a PDF file to the workspace
   */
  uploadPdf: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiRequest('post', API_ROUTES.WORKSPACE.UPLOAD_PDF, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      throw error; // Optionally handle gracefully
    }
  },

  /**
   * Get system files (PDFs) for the workspace
   */
  getSystemFiles: async () => {
    try {
      const response = await apiRequest('get', API_ROUTES.WORKSPACE.FILES);
      return response;
    } catch (error) {
      console.error("Error fetching system files:", error);
      throw error;
    }
  },

  /**
   * Update embeddings for the workspace
   */
  updateEmbeddings: async (data: Record<string, unknown>) => {
    try {
      const response = await apiRequest('post', API_ROUTES.WORKSPACE.EMBED, data, {
        headers: { "Content-Type": "application/json" },
      });

      return response;
    } catch (error) {
      console.error("Error updating embeddings:", error);
      throw error;
    }
  },

  /**
   * Chat with documents in the workspace
   */
  chatWithDocuments: async (
    document: string,
    message: string,
    // workspace: string = workspaceId // Default to the fixed workspace ID
  ) => {
    try {
      const response = await apiRequest('post', `${API_ROUTES.WORKSPACE.CHAT}`, {
        documents: [document],
        message: message,
        mode: "chat",
      });
      console.log(":::::::;;",response)
      return response; // Return the API response's data portion
    } catch (error) {
      console.error("Error in chatWithDocuments service:", error);

      throw new Error(
        error.response?.data?.message || "Failed to communicate with the chat documents API."
      );
    }
  },

  // Delete a file from the workspace
  deleteFile: async (filename: string) => {
    try {
      // Making the API request to delete the file
      const response = await apiRequest('delete', `${API_ROUTES.WORKSPACE.DELETE_FILE}/?fileName=${filename}`);
      
      return response;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },
};

