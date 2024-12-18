import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import chatlogo from "@/assets/bot.png";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useParams } from "react-router-dom";
import { IoMdAttach } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 
type Message = {
  text: string;
  type: "user" | "bot";
};
 
type ChatBotProps = {
  documentName: string | null;
  onClose: () => void;
};
 
let BASE_URL = `${import.meta.env.VITE_DOC_ANALYSER_URL}`;
 
export default function ChatBot({ documentName, onClose }: ChatBotProps) {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [imgloading, SetImageLoading] = useState<boolean>(false);
  let { slug } = useParams();
 
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chats/image-chat`);
      setImages(response.data.data.workspaceFiles);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Failed to fetch images.");
    }
  };
 
  const formattedImageName = selectedImage
    ? `${selectedImage.slice(0, 1).toUpperCase()}${selectedImage
        .slice(1, 20)
        .toLowerCase()}...`
    : "No Image Selected";
 
  useEffect(() => {
    fetchImages();
  }, []);
 
  const toggleChat = () => {
    setShowChat((prev) => !prev);
    onClose();
  };
 
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
 
  const uploadImage = async () => {
    if (!file) {
      return;
    }
 
    const formData = new FormData();
    formData.append("file", file);
 
    try {
      SetImageLoading(true);
      const response = await axios.post(`${BASE_URL}/chats/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
 
      console.log("Image uploaded successfully:", response.data);
      //   alert("Image uploaded successfully!");
      setFile(null);
      fetchImages()
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      SetImageLoading(false);
    }

  };
 
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
 
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedImage || !query.trim()) {
      alert("Please select an image and enter a query.");
      return;
    }
 
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: query, type: "user" },
    ]);
    setQuery("");
 
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/chats/image-chat`, {
        image: selectedImage,
        query: query,
      });
 
      const botMessage =
        response.data.data.data.choices[0].message.content ||
        "Sorry, no reply available.";
 
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botMessage, type: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
      // alert("image uploaded successfully")
    }
  };
 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const truncateFileName = (name) => {     if (name.length > 10) {       return `${name.slice(0, 10)}...`;     }     return name; };
 
  return (
    <div className="fixed bottom-8 right-4">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: showChat ? 0.9 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {!showChat && (
          <img
            className="h-14 cursor-pointer"
            onClick={toggleChat}
            src={chatlogo}
            alt="Chat Icon"
          />
        )}
      </motion.div>
 
      {showChat && (
        <motion.div
          className="w-[70vh] shadow-md rounded-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full mx-auto">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between space-x-4 w-full">
                <div className="">
                  <p className="text-sm font-medium">{formattedImageName}</p>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
                <button className="p-1 " onClick={toggleChat}>
                  <IoIosCloseCircleOutline className="" />
                </button>
              </div>
            </CardHeader>
            <hr />
 
            <CardContent className="h-[500px] overflow-y-auto hide-scrollbar px-4 py-4">
              <div className="mb-2">
                <Select onValueChange={(value) => setSelectedImage(value)}>
                  <SelectTrigger className="w-[180px] ">
                    <SelectValue placeholder="Select an Image" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-black h-40 overflow-y-auto">
                      <SelectLabel>Images</SelectLabel>
                      {images.map((img, index) => (
                        <SelectItem key={index} value={img}>
                          {truncateFileName(img)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                      message.type === "bot"
                        ? "bg-purple-400 text-white mr-auto"
                        : "bg-muted ml-auto"
                    }`}
                  >
                    <p className="">{message.text}</p>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 mr-auto"
                  >
                    <div className="flex justify-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse bg-purple-500"></div>
                      <div className="w-2 h-2 rounded-full animate-pulse bg-purple-500"></div>
                      <div className="w-2 h-2 rounded-full animate-pulse bg-purple-500"></div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter>
              <form
                className="flex items-center w-full space-x-2"
                onSubmit={handleSendMessage}
              >
                <input
                  type="file"
                  id="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <IoMdAttach
                  className="cursor-pointer text-xl"
                  onClick={openFileDialog}
                />
                {/* Display the selected file name */}
                {file && <span>{file.name}</span>}
                {imgloading ? (
                  <div>
                    <div className="animate-spin rounded-full border-4 border-purple-500 border-t-transparent h-6 w-6 " />
                  </div>
                ) : (
                  <Button onClick={uploadImage} type="button" disabled={!file}>
                    Upload
                  </Button>
                )}
                <Input
                  id="message"
                  placeholder="Type your message..."
                  className="flex-1 text-md"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
                <Button type="submit">
                  <SendIcon className="w-4 h-4" />
                  <span className="sr-only"></span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
 
function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
 
// import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import chatlogo from "@/assets/Images/image.png";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import { useParams } from "react-router-dom";
// import { IoMdAttach } from "react-icons/io";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
 
// type Message = {
//   text: string;
//   type: "user" | "bot";
// };
 
// type ChatBotProps = {
//   documentName: string | null;
//   onClose: () => void;
// };
 
// let BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;
 
// export default function ChatBot({ documentName, onClose }: ChatBotProps) {
//   const [showChat, setShowChat] = useState<boolean>(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [images, setImages] = useState<string[]>([]); // State for images
// //   const [input, setInput] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const [file, setFile] = useState<File | null>(null); // Type state as File or null
//   const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [query, setQuery] = useState<string>("");
 
//   let { slug } = useParams();
 
//   const fetchImages = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/chats/image-chat`);
//       setImages(response.data.data.workspaceFiles); // Update the images state with the fetched data
//     } catch (error) {
//       console.error("Error fetching images:", error);
//       alert("Failed to fetch images.");
//     }
//   };
 
//   const formattedImageName = selectedImage
//   ? `${selectedImage.slice(0, 1).toUpperCase()}${selectedImage.slice(1, 20).toLowerCase()}...`
//   : "No Image Selected";
 
//   useEffect(() => {
//     fetchImages();
//   }, []);
 
//   const toggleChat = () => {
//     setShowChat((prev) => !prev);
//     onClose();
//   };
 
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };
 
//   const uploadImage = async () => {
//     if (!file) {
//       return;
//     }
 
//     const formData = new FormData();
//     formData.append("file", file);
 
//     try {
//       const response = await axios.post(`${BASE_URL}/chats/images`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
 
//       console.log("Image uploaded successfully:", response.data);
//       alert("Image uploaded successfully!");
//       setFile(null);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Failed to upload image.");
//     }
//   };
 
//   const openFileDialog = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };
 
//   const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedImage || !query.trim()) {
//       alert("Please select an image and enter a query.");
//       return;
//     }
 
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { text: query, type: "user" },
//     ]);
//     setQuery("");
 
//     try {
//       setLoading(true);
//       const response = await axios.post(`${BASE_URL}/chats/image-chat`, {
//         image: selectedImage,
//         query: query,
//       });
 
//       const botMessage = response.data.data.data.choices[0].message.content || "Sorry, no reply available.";
 
//     //   setSelectedImage(null);
 
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: botMessage, type: "bot" },
//       ]);
 
//     } catch (error) {
//       console.error("Error sending message:", error);
//       alert("Failed to send message.");
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);
 
//   return (
//     <div className="fixed top-4 right-64">
//       <motion.div
//         initial={{ scale: 1 }}
//         animate={{ scale: showChat ? 0.9 : 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         {!showChat && (
 
//           <img
//             className="h-8 cursor-pointer"
//             onClick={toggleChat}
//             src={chatlogo}
//             alt="Chat Icon"
//           />
//         )}
//       </motion.div>
 
//       {showChat && (
//         <motion.div
//           className="w-[70vh] shadow-md rounded-md"
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Card className="w-full mx-auto">
//             <CardHeader className="p-3">
//               <div className="flex items-center justify-between space-x-4 w-full">
//                 <div className="">
//                   <p className="text-sm font-medium">
//                   {/* {selectedImage ? `${selectedImage.slice(0, 20).toUpperCase()}...` : "NO IMAGE SELECTED"} */}
//                   {formattedImageName}
//                   </p>
//                   <p className="text-sm text-muted-foreground">Online</p>
//                 </div>
//                 <button className="p-1 " onClick={toggleChat}>
//                   <IoIosCloseCircleOutline className="" />
//                 </button>
//               </div>
//             </CardHeader>
//             <hr />
 
//             <CardContent className="h-[500px] overflow-y-auto hide-scrollbar px-4 py-4">
//            <div className="mb-2">
//               <Select  onValueChange={(value) => setSelectedImage(value)}>
//                 <SelectTrigger className="w-[180px] ">
//                   <SelectValue placeholder="Select an Image" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup className="text-black h-40 overflow-y-auto">
//                     <SelectLabel>Images</SelectLabel>
//                     {images.map((img, index) => (
//                       <SelectItem key={index} value={img}>
//                         {img}
//                       </SelectItem>
//                     ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//               </div>
//               <div className="space-y-4">
//                 {messages.map((message, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: 0.1 }}
//                     className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
//                       message.type === "bot"
//                         ? "bg-[#2977be] text-white ml-auto"
//                         : "bg-muted"
//                     }`}
//                   >
//                     <p>{message.text}</p>
//                   </motion.div>
//                 ))}
//                 {loading && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: 0.5 }}
//                     className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 ml-auto"
//                   >
//                     <div className="flex justify-center gap-2">
//                       <div className="w-2 h-2 rounded-full animate-pulse bg-[#2977be]"></div>
//                       <div className="w-2 h-2 rounded-full animate-pulse bg-[#2977be]"></div>
//                       <div className="w-2 h-2 rounded-full animate-pulse bg-[#2977be]"></div>
//                     </div>
//                   </motion.div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>
//             </CardContent>
//             <CardFooter>
//               <form
//                 className="flex items-center w-full space-x-2"
//                 onSubmit={handleSendMessage}
//               >
//                 <input
//                   type="file"
//                   id="file"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   style={{ display: "none" }}
//                 />
//                 <IoMdAttach
//                   className="cursor-pointer"
//                   onClick={openFileDialog}
//                 />
//                 <Button onClick={uploadImage} type="button">
//                   Upload
//                 </Button>
//                 <Input
//                   id="message"
//                   placeholder="Type your message..."
//                   className="flex-1 text-md"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   autoComplete="off"
//                 />
//                 <Button type="submit">
//                   <SendIcon className="w-4 h-4" />
//                   <span className="sr-only">Send</span>
//                 </Button>
//               </form>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       )}
//     </div>
//   );
// }
 
// function SendIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m22 2-7 20-4-9-9-4Z" />
//       <path d="M22 2 11 13" />
//     </svg>
//   );
// }
 
 