import { Link } from "react-router-dom";
import mergePdf  from "../../public/Icons/Frame 1.png"
import splitPdf  from "../../public/Icons/Frame 2.png"
import compressPdf  from "../../public/Icons/Frame 3.png"
import pdfToWord  from "../../public/Icons/Frame 11.png"
import pdfToPowerpoint  from "../../public/Icons/Frame 12.png"
import pdfToExcel  from "../../public/Icons/Frame 13.png"
import wordToPdf  from "../../public/Icons/Frame 7.png"
import powerPointToPdf  from "../../public/Icons/Frame 8.png"
import ExcelToPdf  from "../../public/Icons/Frame 9.png"
import pdfToJpg  from "../../public/Icons/Frame 10.png"
import rotatePdf  from "../../public/Icons/Frame 14.png"
import pageNumber  from "../../public/Icons/Frame 15.png"
import waterMark  from "../../public/Icons/Frame 16.png"
import unlockPdf  from "../../public/Icons/Frame 17.png"
import protactPdf  from "../../public/Icons/Frame 18.png"
import pdfToPdfA  from "../../public/Icons/Frame 19.png"
import signPdf  from "../../public/Icons/Frame 21.png"
import scanPdf  from "../../public/Icons/Frame 26.png"
import jpgToPdf  from "../../public/Icons/Frame 6.png"
import repairPdf  from "../../public/Icons/Group.png"
import ocrPdf  from "../../public/Icons/Frame 27.png"
import comparePdf  from "../../public/Icons/Frame 28.png"
import redactPdf  from "../../public/Icons/Frame 29.png"
import htmlToPdf  from "../../public/Icons/comman.png"
import organizePdf  from "../../public/Icons/comman.png"
import editPdf  from "../../public/Icons/Frame 24.png"



const Main = () => {
  const documentType = [
    {
      title: "Merge PDF",
      description:
        "Combine PDFs in the order you want with the easiest PDF merger available.",
      icon: mergePdf,
      link: "/merge-pdf",
    },
    {
      title: "Split PDF",
      description:
        "Separate one page or a whole set for easy conversion into independent PDF files.",
      icon: splitPdf,
      link: "/split-pdf",
    },
    {
      title: "Compress PDF",
      description: "Reduce file size while optimizing for maximal PDF quality.",
      icon: compressPdf,
      link: "/compress-pdf",
    },
    {
      title: "PDF to Word",
      description:
        "Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.",
      icon: pdfToWord,
      link: "/pdf-to-word",
    },
    {
      title: "PDF to PowerPoint",
      description:
        "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
      icon: pdfToPowerpoint,
      link: "/pdf-to-powerpoint",
    },
    {
      title: "PDF to Excel",
      description:
        "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
      icon: pdfToExcel,
      link: "/pdf-to-excel",
    },
    {
      title: "Word to PDF",
      description:
        "Make DOC and DOCX files easy to read by converting them to PDF.",
      icon: wordToPdf,
      link: "/word-to-pdf",
    },
    {
      title: "PowerPoint to PDF",
      description:
        "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
      icon: powerPointToPdf,
      link: "/powerpoint-to-pdf",
    },
    {
      title: "Excel to PDF",
      description:
        "Make EXCEL spreadsheets easy to read by converting them to PDF.",
      icon: ExcelToPdf,
      link: "/xls-to-pdf",
    },
    {
      title: "Edit PDF",
      description:
        "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.",
      icon: editPdf,
      link: "/edit-pdf",
    },
    {
      title: "PDF to JPG",
      description:
        "Convert each PDF page into a JPG or extract all images contained in a PDF.",
      icon: pdfToJpg,
      link: "/pdf-to-jpg",
    },
    {
      title: "JPG to PDF",
      description:
        "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
      icon: jpgToPdf,
      link: "/jpg-to-pdf",
    },
    {
      title: "Sign PDF",
      description:
        "Sign yourself or request electronic signatures from others.",
      icon: signPdf,
      link: "/sign-pdf",
    },
    {
      title: "Watermark",
      description:
        "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.",
      icon: waterMark,
      link: "/watermark-pdf",
    },
    {
      title: "Rotate PDF",
      description:
        "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
      icon: rotatePdf,
      link: "/rotate-pdf",
    },
    {
      title: "HTML to PDF",
      description:
        "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.",
      icon: htmlToPdf,
      link: "/html-to-pdf",
    },
    {
      title: "Unlock PDF",
      description:
        "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
      icon: unlockPdf,
      link: "/unlock-pdf",
    },
    {
      title: "Protect PDF",
      description: "Encrypt PDF documents to prevent unauthorized access.",
      icon: protactPdf,
      link: "/protect-pdf",
    },
    {
      title: "Organize PDF",
      description:
        "Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.",
      icon: organizePdf,
      link: "/organize-pdf",
    },
    {
      title: "PDF to PDF/A",
      description:
        "Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving. Your PDF will preserve formatting when accessed in the future.",
      icon: pdfToPdfA,
      link: "/pdf-to-pdfa",
    },
    {
      title: "Repair PDF",
      description:
        "Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.",
      icon: repairPdf,
      link: "/repair-pdf",
    },
    {
      title: "Page numbers",
      description:
        "Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.",
      icon: pageNumber,
      link: "/page-numbers",
    },

    {
      title: "Scan to PDF",
      description:
        "Capture document scans from your mobile device and send them instantly to your browser.",
      icon: scanPdf,
      link: "/scantopdf",
    },
    {
      title: "OCR PDF",
      description:
        "Easily convert scanned PDF into searchable and selectable documents.",
      icon: ocrPdf,
      link: "/ocr-pdf",
    },
    {
      title: "Compare PDF",
      description:
        "Show a side-by-side document comparison and easily spot changes between different file versions.",
      icon: comparePdf,
      link: "/compare-pdf",
    },
    {
      title: "Redact PDF",
      description:
        "Redact text and graphics to permanently remove sensitive information from a PDF.",
      icon: redactPdf,
      link: "/redact-pdf",
    },
  ];

  return (
    <main className="w-full bg-gray-50 pt-5 ">
      <div className="container px-4 mx-auto text-center md:px-6">
        <h1 className="text-3xl font-bold md:text-4xl mt-14">
            Every tool you need to work with <span className="text-purple-500">PDFs</span> in one place
        </h1>
        <p className="mt-4 text-lg text-gray-600 ">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE
          and easy to use! Merge, split, compress, convert, rotate, unlock and
          watermark PDFs with just a few clicks.
        </p>
      </div>
      <div className="grid gap-[0.2rem] px-4 py-5 mx-auto md:px-6 md:grid-cols-3 lg:grid-cols-6">
        {documentType.map((tool, index) => (
          <Link to={tool.link} key={index}>
            <div className="px-[2rem] py-[2rem] bg-white border rounded-lg shadow-lg hover:cursor-pointer hover:bg-blue-50 w-[100%] h-[100%]">
              <div className="flex flex-col justify-center gap-[1rem]">
                {/* <ComponentIcon className="w-6 h-6 mr-2 text-red-500" /> */}
                <img src={tool.icon}alt="" className="w-10 h-10" />
                <h3 className="text-lg font-semibold">{tool.title}</h3>
              </div>
              <p className="text-gray-600">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>


      <div className="container px-4 py-12 mx-auto text-center md:px-6">
        <h2 className="text-2xl font-bold">Looking for another solution?</h2>
        <div className="grid gap-6 mt-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold"> Desktop</h3>
            <p className="mt-2 text-gray-600">
              Download the{" "}
              <a href="#" className="text-red-500 hover:underline">
                Desktop App
              </a>{" "}
              to work with your favorite PDF tools on your Mac or Windows PC.
              Get a lightweight PDF app that helps you process heavy PDF tasks
              offline in seconds.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold"> Mobile</h3>
            <p className="mt-2 text-gray-600">
              Get the{" "}
              <a href="#" className="text-red-500 hover:underline">
                Mobile App
              </a>{" "}
              to manage documents remotely or on the move. Turn your Android or
              iPhone device into a PDF Editor & Scanner to annotate, sign, and
              share documents with ease.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">pharynxvision</h3>
            <p className="mt-2 text-gray-600">
              <a href="#" className="text-red-500 hover:underline">
                pharynxvision
              </a>{" "}
              is the web app that helps you modify images in bulk for free.
              Crop, resize, compress, convert, and more. All the tools you need
              to enhance your images in just a few clicks.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-100">
        <div className="container px-4 py-12 mx-auto text-center md:px-6">
          <h2 className="text-2xl font-bold">
            The PDF software trusted by millions of users
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Is your number one web app for editing PDF with ease. Enjoy all the
            tools you need to work efficiently with your digital documents while
            keeping your data safe and secure.
          </p>
          {/* <div className="flex justify-center mt-6 space-x-4">
            <img
              src="/placeholder.svg"
              alt="PDF Association"
              className="h-10"
            />
            <img src="/placeholder.svg" alt="ISO 27001" className="h-10" />
            <img src="/placeholder.svg" alt="Secure" className="h-10" />
          </div> */}
        </div>
      </div>

      <div className="w-full bg-gray-800">
        <div className="container mx-auto px-4 py-12 justify-between text-center text-white md:px-6 md:text-left flex flex-col md:flex-row items-center md:items-start md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-bold">Get more with Premium</h3>
            <p className="mt-4 text-lg">
              Complete projects faster with batch file processing, convert
              scanned documents with OCR, and e-sign your business agreements.
            </p>
            <button className="px-4 py-2 mt-6 text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400">
              Get Premium
            </button>
          </div>
          {/* <div className=" w-[500px] y-[500px] p-16">
            <img
              src="/placeholder.svg"
              alt="Premium Features"
              className="mt-8 md:mt-0 md:w-auto rounded-lg   "
            />
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default Main;
