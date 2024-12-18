
import { Edit, Wrench, Hash, ScanLine, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


const tools = [
  {
    name: "Edit PDF",
    icon: Edit,
    description:
      "Add text, images, shapes or Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.",
    bgColor: "bg-pink-50",
    hoverBgColor: "bg-pink-100",
    iconColor: "text-pink-500",
    path: "/edit-pdf",
  },
  {
    name: "Edit PDF",
    icon: Edit,
    description:
      "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.",
    bgColor: "bg-pink-50",
    hoverBgColor: "bg-pink-100",
    iconColor: "text-pink-500",
    path: "/edit-pdf",
  },
  {
    name: "Edit PDF",
    icon: Edit,
    description:
      "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.",
    bgColor: "bg-pink-50",
    hoverBgColor: "bg-pink-100",
    iconColor: "text-pink-500",
    path: "/edit-pdf",
  },
  {
    name: "Edit PDF",
    icon: Edit,
    description:
      "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.",
    bgColor: "bg-pink-50",
    hoverBgColor: "bg-pink-100",
    iconColor: "text-pink-500",
    path: "/edit-pdf",
  },
  {
    name: "Edit PDF",
    icon: Edit,
    description:
      "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.",
    bgColor: "bg-pink-50",
    hoverBgColor: "bg-pink-100",
    iconColor: "text-pink-500",
    path: "/edit-pdf",
  },

  {
    name: "Repair PDF",
    icon: Wrench,
    description: "Fix corrupted or damaged PDF files",
    bgColor: "bg-green-50",
    hoverBgColor: "bg-green-100",
    iconColor: "text-green-500",
    path: "/repair-pdf",
  },
  {
    name: "Page numbers",
    icon: Hash,
    description: "Add custom page numbers to your PDF",
    bgColor: "bg-purple-50",
    hoverBgColor: "bg-purple-100",
    iconColor: "text-purple-500",
    path: "/add-page-numbers",
  },
  {
    name: "Scan to PDF",
    icon: ScanLine,
    description: "Convert scanned documents to PDF format",
    bgColor: "bg-orange-50",
    hoverBgColor: "bg-orange-100",
    iconColor: "text-orange-500",
    path: "/scan-to-pdf",
  },
  {
    name: "OCR PDF",
    icon: FileSearch,
    description: "Extract text from images in your PDF",
    bgColor: "bg-green-50",
    hoverBgColor: "bg-green-100",
    iconColor: "text-green-500",
    path: "/ocr-pdf",
  },
  {
    name: "OCR PDF",
    icon: FileSearch,
    description: "Extract text from images in your PDF",
    bgColor: "bg-green-50",
    hoverBgColor: "bg-green-100",
    iconColor: "text-green-500",
    path: "/ocr-pdf",
  },
  {
    name: "OCR PDF",
    icon: FileSearch,
    description: "Extract text from images in your PDF",
    bgColor: "bg-green-50",
    hoverBgColor: "bg-green-100",
    iconColor: "text-green-500",
    path: "/ocr-pdf",
  },
  {
    name: "OCR PDF",
    icon: FileSearch,
    description: "Extract text from images in your PDF",
    bgColor: "bg-green-50",
    hoverBgColor: "bg-green-100",
    iconColor: "text-green-500",
    path: "/ocr-pdf",
  },
  {
    name: "jpg to pdf",
    icon: FileSearch,
    description: "Extract text from images in your PDF",
    bgColor: "bg-green-50",
    hoverBgColor: "bg-green-100",
    iconColor: "text-green-500",
    path: "/jpg-to-pdf",
  },
];

export function FooterCard() {
  
  return (
    <div className="w-full  ">
      <div className="flex flex-col justify-center items-start gap-2  ">
        <div className="text-lg font-medium ">Continue With ...</div>
        <ScrollArea className="w-full whitespace-nowrap rounded-md ">
        <div className="flex gap-6 w-full h-48  ">
          {tools.map((tool) => (
            <div key={tool.name} className="space-y-4">
              <div className="group relative w-full">
              <Link to={tool.path}> 

                <button
                
                  className={`w-64 ${tool.bgColor} group-hover:${tool.hoverBgColor} rounded-lg p-4 flex items-center gap-3 transition-colors duration-200`}
                >
                  <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                  <span className="text-sm font-medium">{tool.name}</span>
                </button>
                </Link>
                <div
                  className={`absolute top-full left-0 w-full ${tool.hoverBgColor} rounded-lg mt-1 overflow-hidden transition-all duration-300 ease-in-out origin-top opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100`}
                >
                  <div className="p-4">
                    <p className="text-sm text-wrap text-gray-600 leading-relaxed h-24">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full overflow--auto border">
          {tools.map((tool) => (
            <div key={tool.name} className="space-y-4">
              <div className="group relative w-full">
              <Link to={tool.path}> 

                <button
                
                  className={`w-full ${tool.bgColor} group-hover:${tool.hoverBgColor} rounded-lg p-4 flex items-center gap-3 transition-colors duration-200`}
                >
                  <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                  <span className="text-sm font-medium">{tool.name}</span>
                </button>
                </Link>
                <div
                  className={`absolute top-full left-0 w-full ${tool.hoverBgColor} rounded-lg mt-1 overflow-hidden transition-all duration-300 ease-in-out origin-top opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100`}
                >
                  <div className="p-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

// import { Edit, Wrench, Hash, ScanLine, FileSearch } from "lucide-react";
// import { Link } from "react-router-dom";

// const tools = [
//   { name: "Edit PDF", icon: Edit, description: "Edit your PDF documents", bgColor: "bg-pink-50", hoverBgColor: "bg-pink-100", iconColor: "text-pink-500", path: "/edit-pdf" },
//   { name: "Repair PDF", icon: Wrench, description: "Repair damaged PDF files", bgColor: "bg-green-50", hoverBgColor: "bg-green-100", iconColor: "text-green-500", path: "/repair-pdf" },
//   { name: "Page numbers", icon: Hash, description: "Add page numbers to your PDF", bgColor: "bg-purple-50", hoverBgColor: "bg-purple-100", iconColor: "text-purple-500", path: "/add-page-numbers" },
//   { name: "Scan to PDF", icon: ScanLine, description: "Convert scanned documents to PDF", bgColor: "bg-orange-50", hoverBgColor: "bg-orange-100", iconColor: "text-orange-500", path: "/scan-to-pdf" },
//   { name: "OCR PDF", icon: FileSearch, description: "Extract text from PDF images", bgColor: "bg-green-50", hoverBgColor: "bg-green-100", iconColor: "text-green-500", path: "/ocr-pdf" },
//   { name: "JPG to PDF", icon: FileSearch, description: "Convert JPG to PDF", bgColor: "bg-blue-50", hoverBgColor: "bg-blue-100", iconColor: "text-blue-500", path: "/jpg-to-pdf" },
//   { name: "OCR PDF", icon: FileSearch, description: "Extract text from PDF images", bgColor: "bg-green-50", hoverBgColor: "bg-green-100", iconColor: "text-green-500", path: "/ocr-pdf" },
//   { name: "OCR PDF", icon: FileSearch, description: "Extract text from PDF images", bgColor: "bg-green-50", hoverBgColor: "bg-green-100", iconColor: "text-green-500", path: "/ocr-pdf" },
// ];

// export function FooterCard() {
//   return (
//     <div className="w-full">
//       <div className="flex flex-col justify-center items-start gap-2">
//         <div className="text-lg font-medium mb-4">Continue With ...</div>

//         {/* Horizontal Scroll Wrapper */}
//         <div className="overflow-x-auto scrollbar-hidden">
//           {/* Grid Layout for Tools */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full min-w-max">
//             {tools.map((tool) => (
//               <div key={tool.name} className="space-y-4">
//                 <div className="group relative w-full">
//                   <Link to={tool.path}>
//                     <button className={`w-full ${tool.bgColor} group-hover:${tool.hoverBgColor} rounded-lg p-4 flex items-center gap-3 transition-colors duration-200`}>
//                       <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
//                       <span className="text-sm font-medium">{tool.name}</span>
//                     </button>
//                   </Link>
//                   <div
//                     className={`absolute top-full left-0 w-full ${tool.hoverBgColor} rounded-lg mt-1 overflow-hidden transition-all duration-300 ease-in-out origin-top opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100`}
//                   >
//                     <div className="p-4">
//                       <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
