// src/AppRoutes.jsx
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import JpgToPdf from "@/components/JPG-to-PDF";
import WordToPdf from "@/components/Word-to-pdf";
import PowerPointToPdf from "@/components/PowerPointToPdf";
import XlsToPdf from "@/components/Xls-to-PDF";
import HtmlToPdf from "@/components/Html-to-Pdf";
import PdfToJpg from "@/components/Pdf-to-jpg";
import PdfToWord from "@/components/pdf-to-word";
import PdfToPowerPoint from "@/components/Pdf-to-powerpoint";
import PdfToExcel from "@/components/Pdf-to-excel";
import PdfToPdfa from "@/components/PdfToPdfa";
import CogVLMChat from "@/components/cogVLM-chat";
import LoginPage from "@/components/Login";
import SignupPage from "@/components/Signup";
import ForgotPassword from "@/components/ForgatePassword";
import ResetPassword from "@/components/ResetPassword";
import MergePdf from "@/components/Merge-pdf";
import SplitPdf from "@/components/Splite";
import CompressPdf from "@/components/CompressPdf";
import ExtractPDF from "@/components/Extract-PDF";
import RemovePages from "@/components/RemovePages";
import OrganizePdf from "@/components/Organize-pdf";
import ScanToPDF from "@/components/ScantoPdf";
import Chatwithdoc from "@/components/Chatwithdoc";
import ChatwithInvoice from "@/components/Chatwithinvoice";
import FromToEXcel from "@/components/ChatwithForm";
import MergePDF from "@/pages/mergepdf";
import PDFUpload from "@/components/FileUploder";
import { Home } from "@/components/home";
import Page from "@/features/MergePdf";
import Merge from "@/pages/mergepdf";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
      <Route path="/word-to-pdf" element={<WordToPdf />} />
      <Route path="/powerpoint-to-pdf" element={<PowerPointToPdf />} />
      <Route path="/xls-to-pdf" element={<XlsToPdf />} />
      <Route path="/html-to-pdf" element={<HtmlToPdf />} />
      <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
      <Route path="/pdf-to-word" element={<PdfToWord />} />
      <Route path="/pdf-to-powerpoint" element={<PdfToPowerPoint />} />
      <Route path="/pdf-to-excel" element={<PdfToExcel />} />
      <Route path="/cogVLM-chat" element={<CogVLMChat />} />
      <Route path="/merge-pdf" element={<MergePdf />} />
      <Route path="/split-pdf" element={<SplitPdf />} />
      <Route path="/compress-pdf" element={<CompressPdf />} />
      <Route path="/extract-pdf" element={<ExtractPDF />} />
      <Route path="/remove-pages" element={<RemovePages />} />
      <Route path="/chat-with-doc" element={<Chatwithdoc />} />
      <Route path="/chat-with-invoice" element={<ChatwithInvoice />} />
      <Route path="/pdf-to-form" element={<FromToEXcel />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signUp" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* test new figma */}
      <Route path="/test-merge-pdf" element={<Merge />} />
      {/* <Route path="/test-merge-pdf" element={<Page/>} /> */}

      <Route
        path="/test-split-pdf"
        element={<PDFUpload heading={"Split PDF"} subheading={"split pdf"} />}
      />
      <Route
        path="*"
        element={
          <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-6">
                Upcoming...
              </h1>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-colors duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
