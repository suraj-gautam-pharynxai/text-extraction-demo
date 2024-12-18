import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { useState } from "react"
import ChatBot from "./ImageChat"
import axios from "axios"
import { useRef } from "react"
export default function ChatwithInvoice() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null); // Reference to the file input

  console.log("file", file)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log("fileData",e.target.files[0])
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPrompt("");
    setIsProcessing(false);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProcessInvoice = async () => {
    if (!file || !prompt) {
      alert("Please select a file and enter a prompt.");
      return;
    }
  
    setIsProcessing(true);
    setMessage("Processing invoice...");
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", prompt);
  
      // Check if "excel" exists in the prompt
      const isExcel = prompt.toLowerCase().includes("excel");
      const responseType = "blob"; // Always handle as a blob
  
      const response = await axios.post(
        "https://buddy.pharynxai.in/pharynxocrbackend/chat_img/extract-handwritten-text",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: responseType,
          maxBodyLength: Infinity,
        }
      );
  
      setMessage("Downloading starts...");
  
      if (isExcel) {
        // Download as Excel
        downloadExcelFile(response.data);
      } else {
        // Download as PDF
        downloadPdfFile(response.data);
      }
  
      resetForm();
    } catch (error) {
      console.error("Error processing invoice:", error);
      alert("The file could not be processed. Please try again.");
      setIsProcessing(false);
      setMessage("");
    }
  };
  
  const downloadExcelFile = (data) => {
    const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const downloadPdfFile = (data) => {
    const blob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-screen bg-purple-50 p-4 flex items-center justify-center">
         <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-800">Invoice Processing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            file ? "border-purple-500 bg-purple-50" : "border-purple-200"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="h-12 w-12 text-purple-500" />
            <div className="text-center">
              <p className="text-purple-800 font-medium">
                {file ? `Selected: ${file.name}` : "Select your invoice image"}
              </p>
              <p className="text-sm text-purple-600 mt-1">Supports: JPEG, JPG (max. 10MB)</p>
            </div>
            <input
              type="file"
              ref={fileInputRef} // Attach reference to the file input
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <Button
              variant="outline"
              className="mt-2 border-purple-200 hover:bg-purple-100"
              onClick={() => fileInputRef.current?.click()} // Use reference to trigger input
            >
              Select File
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium text-purple-800">
            Processing Instructions
          </label>
          <Textarea
            id="prompt"
            placeholder="Enter your processing instructions (e.g., 'Please convert this invoice to Excel')"
            className="min-h-[100px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        {message && <p className="text-center text-purple-700 font-medium mt-4">{message}</p>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleProcessInvoice}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Process Invoice"}
        </Button>
      </CardFooter>
    </Card>
<ChatBot/>
    </div>
  )
}

