import { useEffect, useState , useRef} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, FileText, LucideUpload } from "lucide-react";
import { BsSendFill } from "react-icons/bs";
import { ImEmbed2 } from "react-icons/im";
import { WorkspaceService } from "@/services/documentService";
import { IoChatbox, IoHeartDislikeCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";


import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFFile {
  name: string;
  url: string | File;
}

interface Message {
  text: string;
  sender: "user" | "bot";
  document: string;
}

export default function Chatwithdoc() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([{ name: "", url: "" }]);
  console.log("PdfFiles :::",pdfFiles)
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({}); // Store loading state for each document
  const [isUpoading, setIsUploading] = useState(false); // Store loading state for each document
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isBotResponding, setIsBotResponding] = useState(false);

  
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState<PDFFile>(pdfFiles[0]);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  console.log("messages:", messages);
  const [currentChatDocument, setCurrentChatDocument] = useState<string>(
    pdfFiles[0].name
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  console.log("selectedFile:", selectedFile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chunkSource, setChunkSource] = useState<ChunkSource[]>([]); // Correct type here
  const [embedStatus, setEmbedStatus] = useState({}); // Track embedding status per file
  const [chatFileIs,setChatFileIs] = useState();
  const [pdfUrl,setPdfUrl] = useState()
  const [newMessage, setNewMessage] = useState('');

  console.log("pdfUrl---------------------------------->",pdfUrl)
  console.log("chatFileIs",chatFileIs)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = () => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default form submission or newline
      handleSendMessage(event); // Call your message sending function
    }
  };
  
  const getPdf = async () => {
    setLoading(true);
    try {
      const documentsData = await WorkspaceService.getSystemFiles();
      const files = documentsData?.data?.workspaceFiles || [];
      setPdfList(files);
      console.log("pd:", files);
    } catch (err) {
      setError("Failed to load PDF files.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPdf();
  }, []);

  const handleUploadPdf = async () => {
    if (selectedFile) {
      setIsUploading(true)
      const result = await WorkspaceService.uploadPdf(selectedFile);

    }
    setIsUploading(false)

    setIsDialogOpen(false);
    setSelectedFile(null);
    getPdf()

    const fileUrl = await convertFileToDataURL(selectedFile);

        // Store the file name and its base64 URL
        const newPdfFile = {
          name: selectedFile.name,
          url: fileUrl,  // The base64 URL
        };

        // Update the state to store the file URL and name
        setPdfFiles((prevFiles) => [...prevFiles, newPdfFile]);
  };


  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string); // Resolve with the base64 data URL
        }
      };
      reader.onerror = reject; // Reject on error
      reader.readAsDataURL(file); // Read the file as a Data URL (base64)
    });
  };
  const handleProcess = async (pdfName) => {
    setIsLoading((prevState) => ({ ...prevState, [pdfName]: true }));
    setEmbedStatus((prevStatus) => ({ ...prevStatus, [pdfName]: "loading" })); // Mark the file as "loading"
    
    try {
      const payload = {
        adds: [pdfName],
        deletes: [],
      };

      const workspaceId = "i-love-pdf-69606269";

      const response = await axios.post(
        `${import.meta.env.VITE_DOC_ANALYSER_URL}/workspace/${workspaceId}/update-embeddings`,
        payload
      );
      
      setEmbedStatus((prevStatus) => ({ ...prevStatus, [pdfName]: "done" })); // Set status to "done" once embedding is complete
      console.log("Response:", response.data);
    } catch (error) {
      setEmbedStatus((prevStatus) => ({ ...prevStatus, [pdfName]: "failed" })); // Set to "failed" if there's an error
    } finally {
      setIsLoading((prevState) => ({ ...prevState, [pdfName]: false }));
    }
  };
  const handleDeletepdf = async (fileName) => {
    try {
      const response = await WorkspaceService.deleteFile(fileName);
      console.log("File deleted successfully", response);
      getPdf()
    } catch (error) {
      console.error("Failed to delete file", error);
    }
  };
    

  

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
    
    if (!newMessage.trim()) return; // Prevent empty messages
  
    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage.trim(), sender: "user", document: chatFileIs || "default-document-id" },
    ]);
  
    setNewMessage(''); // Clear the input after sending
    setIsBotResponding(true); // Start showing the bubbles

    try {
      // Call the service to get the bot's response
      const response = await WorkspaceService.chatWithDocuments(
        chatFileIs || "default-document-id",
        newMessage.trim(),
        "i-love-pdf-69606269"
      );
  
      const botMessage = response.textResponse?.trim() || "Sorry, no reply available.";
      
      // Add the bot's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botMessage, sender: "bot", document: selectedFile || "default-document-id" },
      ]);
  
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "An error occurred. Please try again.", sender: "bot", document: selectedFile || "default-document-id" },
      ]);
    }
    finally {
      setIsBotResponding(false); // Stop showing the bubbles after response
    }
  };
  
  
  

  const getUrlByName = (name: string): string | undefined => {
    const file = pdfFiles.find((pdf) => pdf.name === name);
    setPdfUrl(file?.url)
    setMessages([])
    // setChatFileIs("")
    return file?.url;
  };

  // Example usage
  const handleFindUrl = (selectedFile) => {
    setChatFileIs(selectedFile);
    // const fileName = "File1"; // Example input
    const fileUrl = getUrlByName(selectedFile);
    if (fileUrl) {
      console.log(`URL for ${selectedFile}: ${fileUrl}`);
    } else {
      console.log(`File with name "${selectedFile}" not found.`);
    }
  };

  useEffect(() => {
    handleFindUrl();
  }, [selectedFile]);

  return (
    <div>

  <div className=" mx-auto p-4 space-y-6">
  <h1 className="text-3xl font-bold text-gray-700 mb-6">Chat With Document</h1>
  <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 px-6">
    <Card className=" border-2 border-purple-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl text-gray-600 font-bold">Documents</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button  size="sm">
              <FaPlus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-400 transition-colors">
                {selectedFile ? (
                  <div className="text-center">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <Label htmlFor="pdfUpload" className="cursor-pointer">
                      <LucideUpload className="h-10 w-10 text-gray-400" />
                    </Label>
                    <Input
                      id="pdfUpload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  </>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => handleUploadPdf(selectedFile)}>
              {isUpoading ? (
                      <div className="animate-spin rounded-full border-2 border-purple-100 border-t-transparent h-4 w-4 mr-2" />
                    ) : (    
                "Upload")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-250px)] w-full ">
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full border-4 border-purple-600 border-t-transparent h-8 w-8" />
            </div>
          )}
          {error && <p className="text-center text-red-600 py-4">{error}</p>}
          {pdfList.length > 0 ? (
            <ul className="space-y-3 pt-2">
            {pdfList.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3  bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800 truncate flex-grow">{file}</p>
                <div className="flex items-center space-x-2">
                  {/* Embedding Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleProcess(file)}
                    disabled={isLoading[file] || embedStatus[file] === "done"} // Disable if embedding is done
                  >
                    {isLoading[file] ? (
                      <div className="animate-spin rounded-full border-2 border-purple-600 border-t-transparent h-4 w-4 mr-2" />
                    ) : (
                      embedStatus[file] === "done" ? (
                        <h2 className={`text-green-600`}>Embedded</h2> // Text when embedded
                      ) : (
                        <ImEmbed2 className="h-4 w-4 mr-2" /> // Embed icon
                      )
                    )}
                    {isLoading[file] && "Embedding..."}
                  </Button>
      
                  {/* New Button for Embedded Files */}
                  {embedStatus[file] === "done" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={()=>{
                        handleFindUrl(file)
                      }}
                      // onClick={() => alert(`Viewing ${file}`)} // Replace this with actual logic for the new action
                    >
                      Chat
                    </Button>
                  )}
      
                  {/* Delete Button */}
                  <Button size="sm" variant="outline" onClick={() => handleDeletepdf(file)}>
                    <MdDelete className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          ) : (
            !loading && (
              <p className="text-center text-gray-500 py-4">No documents available.</p>
            )
          )}
        </ScrollArea>
      </CardContent>
    </Card>

        <Card className=" border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-600 font-bold">
              {
                chatFileIs ? (
                  chatFileIs
                ):(
                  currentChatDocument
                    ? currentChatDocument.length > 20
                      ? `${currentChatDocument.slice(0, 20)}...`
                      : currentChatDocument
                    : "Select a document to chat"
                )
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-350px)] w-full px-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
                      {isBotResponding && (
        <div className="flex justify-start gap-2 ml-4">
          <div className="w-2 h-2 rounded-full animate-pulse bg-purple-400"></div>
          <div className="w-2 h-2 rounded-full animate-pulse bg-purple-400"></div>
          <div className="w-2 h-2 rounded-full animate-pulse bg-purple-400"></div>
        </div>
      )}
              
                <div ref={messagesEndRef} />

            </ScrollArea>
            <form
  onSubmit={(e) => {
    // e.preventDefault(); // Prevents the default form submission
    handleSendMessage(e) // Calls your message sending logic
  }}
  className="p-4 border-t"
>
  <div className="flex items-center space-x-2">
    <Textarea
      name="message"
      placeholder="Type your message..."
      className="flex-grow"
      value={newMessage} // Bind the newMessage state
      onChange={handleChange} // Handle change to update the message text
      onKeyDown={handleKeyDown} // Handle the Enter key to send the message

    />
    <Button type="submit" size="icon" className="shrink-0">
      <BsSendFill className="h-4 w-4" />
      <span className="sr-only">Send message</span>
    </Button>
  </div>
</form>


          </CardContent>
        </Card>


      </div>
    </div>
    </div>

  );
}







// import { useEffect, useState , useRef} from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { MessageCircle, X, FileText, LucideUpload } from "lucide-react";
// import { BsSendFill } from "react-icons/bs";
// import { ImEmbed2 } from "react-icons/im";
// import { WorkspaceService } from "@/services/documentService";
// import { IoChatbox, IoHeartDislikeCircleOutline } from "react-icons/io5";
// import { MdDelete } from "react-icons/md";


// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { FaPlus } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// interface PDFFile {
//   name: string;
//   url: string | File;
// }

// interface Message {
//   text: string;
//   sender: "user" | "bot";
//   document: string;
// }

// export default function Chatwithdoc() {
//   const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([{ name: "", url: "" }]);
//   console.log("PdfFiles :::",pdfFiles)
//   const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({}); // Store loading state for each document
//   const [isUpoading, setIsUploading] = useState(false); // Store loading state for each document
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

  
//   const [pdfList, setPdfList] = useState([]);
//   const [selectedPdf, setSelectedPdf] = useState<PDFFile>(pdfFiles[0]);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   console.log("messages:", messages);
//   const [currentChatDocument, setCurrentChatDocument] = useState<string>(
//     pdfFiles[0].name
//   );
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   console.log("selectedFile:", selectedFile);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [chunkSource, setChunkSource] = useState<ChunkSource[]>([]); // Correct type here
//   const [embedStatus, setEmbedStatus] = useState({}); // Track embedding status per file
//   const [chatFileIs,setChatFileIs] = useState();
//   const [pdfUrl,setPdfUrl] = useState()
//   console.log("pdfUrl---------------------------------->",pdfUrl)
//   console.log("chatFileIs",chatFileIs)

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleFileChange = () => {
//     setSelectedFile(event.target.files?.[0] || null);
//   };


//   const getPdf = async () => {
//     setLoading(true);
//     try {
//       const documentsData = await WorkspaceService.getSystemFiles();
//       const files = documentsData?.data?.workspaceFiles || [];
//       setPdfList(files);
//       console.log("pd:", files);
//     } catch (err) {
//       setError("Failed to load PDF files.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getPdf();
//   }, []);

//   const handleUploadPdf = async () => {
//     if (selectedFile) {
//       setIsUploading(true)
//       const result = await WorkspaceService.uploadPdf(selectedFile);

//     }
//     setIsUploading(false)

//     setIsDialogOpen(false);
//     setSelectedFile(null);
//     getPdf()

//     const fileUrl = await convertFileToDataURL(selectedFile);

//         // Store the file name and its base64 URL
//         const newPdfFile = {
//           name: selectedFile.name,
//           url: fileUrl,  // The base64 URL
//         };

//         // Update the state to store the file URL and name
//         setPdfFiles((prevFiles) => [...prevFiles, newPdfFile]);
//   };


//   const convertFileToDataURL = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (reader.result) {
//           resolve(reader.result as string); // Resolve with the base64 data URL
//         }
//       };
//       reader.onerror = reject; // Reject on error
//       reader.readAsDataURL(file); // Read the file as a Data URL (base64)
//     });
//   };
//   const handleProcess = async (pdfName) => {
//     setIsLoading((prevState) => ({ ...prevState, [pdfName]: true }));
//     setEmbedStatus((prevStatus) => ({ ...prevStatus, [pdfName]: "loading" })); // Mark the file as "loading"
    
//     try {
//       const payload = {
//         adds: [pdfName],
//         deletes: [],
//       };

//       const workspaceId = "i-love-pdf-69606269";

//       const response = await axios.post(
//         `${import.meta.env.VITE_DOC_ANALYSER_URL}/workspace/${workspaceId}/update-embeddings`,
//         payload
//       );
      
//       setEmbedStatus((prevStatus) => ({ ...prevStatus, [pdfName]: "done" })); // Set status to "done" once embedding is complete
//       console.log("Response:", response.data);
//     } catch (error) {
//       setEmbedStatus((prevStatus) => ({ ...prevStatus, [pdfName]: "failed" })); // Set to "failed" if there's an error
//     } finally {
//       setIsLoading((prevState) => ({ ...prevState, [pdfName]: false }));
//     }
//   };
//   const handleDeletepdf = async (fileName) => {
//     try {
//       const response = await WorkspaceService.deleteFile(fileName);
//       console.log("File deleted successfully", response);
//       getPdf()
//     } catch (error) {
//       console.error("Failed to delete file", error);
//     }
//   };
    

  

//     const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
//     console.log("Current messages:", messages);
//     event.preventDefault();
  
//     const formData = new FormData(event.currentTarget);
//     const message = formData.get("message") as string;
    
//     if (!message.trim()) return;
  
//     // Add the user's message to the chat
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { text: message.trim(), sender: "user", document: chatFileIs || "default-document-id" },
//     ]);
  
//     // Clear the input field
//     event.currentTarget.reset();
  
//     // Set loading state
//     // setLoading(true);
  
//     try {
//       // Call the service
//       const response = await WorkspaceService.chatWithDocuments(
//         chatFileIs || "default-document-id",
//         message.trim(),
//         "i-love-pdf-69606269"
//       );
  
//       console.log("API Response:", response);
  
//       const botMessage = response.textResponse?.trim() || "Sorry, no reply available.";
//       console.log("Bot Message:", botMessage);
  
//       // Add the bot's response to the chat
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           text: botMessage,
//           sender: "bot",
//           document: selectedFile || "default-document-id",
//         },
//       ]);
  
//       // Update chunk sources state if sources are present
//       if (response.sources) {
//         setChunkSource(response.sources);
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
  
//       // Handle errors gracefully and add an error message to the chat
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           text: "An error occurred. Please try again.",
//           sender: "bot",
//           document: selectedFile || "default-document-id",
//         },
//       ]);
//     } finally {
//       // Reset loading state
//       setLoading(false);
//     }
//   };
//   const handleKeyDown = (event: React.KeyboardEvent) => {
//     if (event.key === 'Enter' && !event.shiftKey) {
//       event.preventDefault(); // Prevent default form submission or newline
//       handleSendMessage(event); // Call your message sending function
//     }
//   };
             
  
  

//   const getUrlByName = (name: string): string | undefined => {
//     const file = pdfFiles.find((pdf) => pdf.name === name);
//     setPdfUrl(file?.url)
//     setMessages([])
//     // setChatFileIs("")
//     return file?.url;
//   };

//   // Example usage
//   const handleFindUrl = (selectedFile) => {
//     setChatFileIs(selectedFile);
//     // const fileName = "File1"; // Example input
//     const fileUrl = getUrlByName(selectedFile);
//     if (fileUrl) {
//       console.log(`URL for ${selectedFile}: ${fileUrl}`);
//     } else {
//       console.log(`File with name "${selectedFile}" not found.`);
//     }
//   };

//   useEffect(() => {
//     handleFindUrl();
//   }, [selectedFile]);

//   return (
//     <div>

//   <div className=" mx-auto p-4 space-y-6">
//   <h1 className="text-3xl font-bold text-gray-700 mb-6">Chat With Document</h1>
//   <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr]  gap-6">
//     <Card className=" border-2 border-purple-200">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-xl text-gray-600 font-bold">Documents</CardTitle>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button  size="sm">
//               <FaPlus className="mr-2 h-4 w-4" />
//               Add Document
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Upload File</DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-400 transition-colors">
//                 {selectedFile ? (
//                   <div className="text-center">
//                     <p className="font-medium">{selectedFile.name}</p>
//                     <p className="text-sm text-gray-500">
//                       {(selectedFile.size / 1024).toFixed(2)} KB
//                     </p>
//                   </div>
//                 ) : (
//                   <>
//                     <Label htmlFor="pdfUpload" className="cursor-pointer">
//                       <LucideUpload className="h-10 w-10 text-gray-400" />
//                     </Label>
//                     <Input
//                       id="pdfUpload"
//                       type="file"
//                       className="hidden"
//                       onChange={handleFileChange}
//                     />
//                     <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
//                   </>
//                 )}
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit" onClick={() => handleUploadPdf(selectedFile)}>
//               {isUpoading ? (
//                       <div className="animate-spin rounded-full border-2 border-purple-100 border-t-transparent h-4 w-4 mr-2" />
//                     ) : (    
//                 "Upload")}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-[calc(100vh-250px)] w-full ">
//           {loading && (
//             <div className="flex justify-center items-center py-4">
//               <div className="animate-spin rounded-full border-4 border-purple-600 border-t-transparent h-8 w-8" />
//             </div>
//           )}
//           {error && <p className="text-center text-red-600 py-4">{error}</p>}
//           {pdfList.length > 0 ? (
//             <ul className="space-y-3 pt-2">
//             {pdfList.map((file, index) => (
//               <li
//                 key={index}
//                 className="flex items-center justify-between p-3  bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
//               >
//                 <p className="text-sm font-medium text-gray-800 truncate flex-grow">{file}</p>
//                 <div className="flex items-center space-x-2">
//                   {/* Embedding Button */}
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleProcess(file)}
//                     disabled={isLoading[file] || embedStatus[file] === "done"} // Disable if embedding is done
//                   >
//                     {isLoading[file] ? (
//                       <div className="animate-spin rounded-full border-2 border-purple-600 border-t-transparent h-4 w-4 mr-2" />
//                     ) : (
//                       embedStatus[file] === "done" ? (
//                         <h2 className={`text-green-600`}>Embedded</h2> // Text when embedded
//                       ) : (
//                         <ImEmbed2 className="h-4 w-4 mr-2" /> // Embed icon
//                       )
//                     )}
//                     {isLoading[file] && "Embedding..."}
//                   </Button>
      
//                   {/* New Button for Embedded Files */}
//                   {embedStatus[file] === "done" && (
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={()=>{
//                         handleFindUrl(file)
//                       }}
//                       // onClick={() => alert(`Viewing ${file}`)} // Replace this with actual logic for the new action
//                     >
//                       Chat
//                     </Button>
//                   )}
      
//                   {/* Delete Button */}
//                   <Button size="sm" variant="outline" onClick={() => handleDeletepdf(file)}>
//                     <MdDelete className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           ) : (
//             !loading && (
//               <p className="text-center text-gray-500 py-4">No documents available.</p>
//             )
//           )}
//         </ScrollArea>
//       </CardContent>
//     </Card>

//         <Card className=" border-2 border-purple-200">
//           <CardHeader>
//             <CardTitle className="text-xl text-gray-600 font-bold">
//               {
//                 chatFileIs ? (
//                   chatFileIs
//                 ):(
//                   currentChatDocument
//                     ? currentChatDocument.length > 20
//                       ? `${currentChatDocument.slice(0, 20)}...`
//                       : currentChatDocument
//                     : "Select a document to chat"
//                 )
//               }
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <ScrollArea className="h-[calc(100vh-350px)] w-full px-4">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`mb-4 ${
//                     message.sender === "user" ? "text-right" : "text-left"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block p-3 rounded-lg ${
//                       message.sender === "user"
//                         ? "bg-purple-100 text-purple-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {message.text}
//                   </span>
//                 </div>
//               ))}
                              
//                 <div ref={messagesEndRef} />

//             </ScrollArea>
//             <form
//   onSubmit={(e) => {
//     // e.preventDefault(); // Prevents the default form submission
//     handleSendMessage(e) // Calls your message sending logic
//   }}
//   className="p-4 border-t"
// >
//   <div className="flex items-center space-x-2">
//     <Textarea
//       name="message"
//       placeholder="Type your message..."
//       className="flex-grow"
//       onChange={(e) => setMessage(e.target.value)}
//       // onKeyDown={(e) => {
//       //   if (e.key === "Enter" && !e.shiftKey) {
//       //     // e.preventDefault(); // Prevents new line creation
//       //     handleSendMessage(e); // Calls your message sending logic
//       //   }
//       // }}
//       onKeyDown={handleKeyDown} 
//     />
//     <Button type="submit" size="icon" className="shrink-0">
//       <BsSendFill className="h-4 w-4" />
//       <span className="sr-only">Send message</span>
//     </Button>
//   </div>
// </form>


//           </CardContent>
//         </Card>

//         <Card className=" border-2 border-purple-200">
//           <CardHeader>
//             <CardTitle className="text-xl text-gray-600 font-bold">
//             {
//                 chatFileIs ? (
//                   chatFileIs
//                 ):(
//                   currentChatDocument
//                     ? currentChatDocument.length > 20
//                       ? `${currentChatDocument.slice(0, 20)}...`
//                       : currentChatDocument
//                     : "Select a document to chat"
//                 )
//               }
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <ScrollArea className="h-[calc(100vh-250px)] w-full">
//             {pdfFiles.length > 1 ? (
//   <iframe
//     // src="https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf"
//     src={pdfUrl}
//     title="Embedded PDF"
//     width="100%"
//     height="650"
//     className="w-full  border-0"
//   />
// ) : (
//   <div className="flex items-center justify-center h-full">
//     <p className="text-gray-500">Select a document to view</p>
//   </div>
// )}

//             </ScrollArea>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//     </div>

//   );
// }
