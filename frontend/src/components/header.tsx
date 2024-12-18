import { AlignJustify, ChevronDown, Ghost } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "/Vision.png";
import navData from "./nav-json.json";
import jpg from "/jpg.png";
import doc from "/doc.png";
import html from "/html-5.png";
import xls from "/xls.png";
import ppt from "/pptx-file.png";
import pdf from "/pdf.png";
import mergePdf from "../../public/Icons/Frame 1.png";
import splitPdf from "../../public/Icons/Frame 2.png";
import compressPdf from "../../public/Icons/Frame 3.png";
import pdfToWord from "../../public/Icons/Frame 11.png";
import pdfToPowerpoint from "../../public/Icons/Frame 12.png";
import pdfToExcel from "../../public/Icons/Frame 13.png";
import wordToPdf from "../../public/Icons/Frame 7.png";
import powerPointToPdf from "../../public/Icons/Frame 8.png";
import ExcelToPdf from "../../public/Icons/Frame 9.png";
import pdfToJpg from "../../public/Icons/Frame 10.png";
import rotatePdf from "../../public/Icons/Frame 14.png";
import pageNumber from "../../public/Icons/Frame 15.png";
import waterMark from "../../public/Icons/Frame 16.png";
import unlockPdf from "../../public/Icons/Frame 17.png";
import protactPdf from "../../public/Icons/Frame 18.png";
import pdfToPdfA from "../../public/Icons/Frame 19.png";
import signPdf from "../../public/Icons/Frame 21.png";
import scanPdf from "../../public/Icons/Frame 26.png";
import jpgToPdf from "../../public/Icons/Frame 6.png";
import repairPdf from "../../public/Icons/Group.png";
import ocrPdf from "../../public/Icons/Frame 27.png";
import comparePdf from "../../public/Icons/Frame 28.png";
import redactPdf from "../../public/Icons/Frame 29.png";
import htmlToPdf from "../../public/Icons/comman.png";
import removePages from "../../public/Icons/comman.png";
import organizePdf from "../../public/Icons/comman.png";
import editPdf from "../../public/Icons/Frame 24.png";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "./redux/userSlice"; // Import your logout action
import { logoutService } from "./services/Logout.service.ts"; // Import the logout service
import { Button } from "./ui/button.tsx";

const iconMap = {
  jpg,
  doc,
  ppt,
  html,
  xls,
  pdf,
  mergePdf,
  splitPdf,
  compressPdf,
  pdfToWord,
  pdfToPowerpoint,
  removePages,
  pdfToExcel,
  wordToPdf,
  powerPointToPdf,
  ExcelToPdf,
  pdfToJpg,
  rotatePdf,
  pageNumber,
  waterMark,
  unlockPdf,
  protactPdf,
  pdfToPdfA,
  signPdf,
  scanPdf,
  jpgToPdf,
  repairPdf,
  ocrPdf,
  comparePdf,
  redactPdf,
  htmlToPdf,
  organizePdf,
  editPdf,
};

const Header = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAll, setIsOpenAll] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = () => {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!email && !!token);
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setMessage("User is not logged in");
      return;
    }

    const { success } = await logoutService(email, token);

    if (success) {
      setMessage("Logged out successfully");

      dispatch(logout());

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      setMessage(message);
    }
  };

  // ------------------------------------------------

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConvertDropdownOpen, setIsConvertDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  // ---------------------------------------------------------------------

  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleMouseEnter = (link: SetStateAction<string | null>) => {
    setIsHovered(link);
  };
  const handleItemClick = () => {
    setIsOpen(false);
  };
  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  // ---------------------------------------------------------------------

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const toggleConvertDropdown = () => {
    setIsConvertDropdownOpen(!isConvertDropdownOpen);
    setIsToolsDropdownOpen(false);
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
    setIsConvertDropdownOpen(false);
  };

  // const renderDropdownItems = (items) =>
  //   items.map((item, index) => (
  //     <div key={index} className="flex items-center mt-5">
  //       <img src={iconMap[item.icon]} alt="" className="w-5 h-5" />
  //       <Link
  //         to={item.link}
  //         className="px-4 py-2 text-[1rem] gap-5 flex text-gray-700 hover:bg-purple-100"
  //       >
  //         {item.text}
  //       </Link>
  //     </div>
  //   ));
  const renderDropdownItems = (items) =>
    items.map((item, index) => (
      <div key={index} className="flex items-center mt-5">
        <img src={iconMap[item.icon]} alt="" className="w-5 h-5" />
        <Link
          to={item.link}
          className="px-4 py-2 text-[1rem] gap-5 flex text-gray-700 hover:bg-purple-100"
          onClick={() => 
          {
            setIsOpen(false)
            setIsOpenAll(false)


          }

          } 

        >
          {item.text}
        </Link>
      </div>
    ));

  return (
    <header className="bg-white shadow-xl  fixed w-full  py-3 items-center z-50  flex justify-between gap-4  px-6">
      <div className="flex items-center relative ">
        <nav className="hidden md:flex md:items-center gap-8  ">
          <Link to="/">
            <img alt="" src={logo} className="h-10 mt-0 mr-[2rem]" />
          </Link>
          {navData.desktopNav.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="text-gray-700 hover:text-purple-500 font-bold text-center"
            >
              {item.text}
            </Link>
          ))}
    <HoverCard open={isOpen} openDelay={0} closeDelay={200} onOpenChange={(open) => setIsOpen(open)}>
      <HoverCardTrigger asChild>
        <button
          className="text-gray-700 hover:text-purple-500 font-bold flex items-center justify-center gap-[qrem]"
          onClick={() => setIsOpen(true)} 
        >
          CONVERT PDF
          <ChevronDown />
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        className="mt-6 bg-white shadow-lg rounded-md flex w-[560px] space-x-4 p-4"
      >
        {navData.convertDropdown.map((section, index) => (
          <div key={index} className="p-5 justify-center font-semibold">
            <h1 className="font-bold text-[1rem]">{section.title}</h1>
            {renderDropdownItems(section.items)}
          </div>
        ))}
      </HoverCardContent>
    </HoverCard>
          <HoverCard open={isOpenAll} openDelay={0} closeDelay={200} onOpenChange={(open) => setIsOpenAll(open)}>
            <HoverCardTrigger asChild>
              <button
                className="text-gray-700 hover:text-purple-500 font-bold flex items-center justify-center gap-[qrem]"
          onClick={() => setIsOpenAll(true)} 
              >
                ALL PDF TOOLS
                <ChevronDown />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className=" mt-6 mr-4 bg-white shadow-lg rounded-md flex  justify-between  lg:w-[850px] lg:gap-2 lg:flex-wrap md:w-[700px] md:gap-2 md:flex-wrap xl:w-[1400px]  p-4">
              {navData.toolsDropdown.map((section, index) => (
                <div key={index} className="p-2 justify-center font-semibold">
                  <h1 className="font-bold text-[1rem]">{section.title}</h1>
                  {renderDropdownItems(section.items)}
                </div>
              ))}
            </HoverCardContent>
          </HoverCard>
        </nav>
      </div>

      <div className="flex items-center gap-6  ">
        <div>
          {isLoggedIn ? (
            <div>
              <button
                onClick={handleLogout}
                className="p-2 justify-center items-center text-sm text-white bg-purple-500 rounded hover:bg-purple-600"
              >
                Logout
              </button>
              <p>{message}</p>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-700 hover:text-purple-500 font-bold"
              >
                Login
              </a>
              <Button variant={"purple"}>Sign Up</Button>
            </div>
          )}
        </div>
        <button
          className="sm:hidden flex items-center ml-auto"
          onClick={toggleMobileMenu}
        >
          <AlignJustify />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white shadow-md transition-transform     transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-100`}
      >
        <div className="p-4">
          <button className="flex items-center mb-4" onClick={closeMobileMenu}>
            <AlignJustify />
          </button>
          <nav className="flex flex-col space-y-4">
            {navData.desktopNav.map((item, index) => (
              <Link
                onClick={closeMobileMenu}
                key={index}
                to={item.link}
                className="text-gray-900 hover:text-purple-500 font-bold "
              >
                {item.text}
              </Link>
            ))}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-purple-500 font-bold flex items-center gap-2 text-lg"
                onClick={toggleConvertDropdown}
              >
                <div>CONVERT PDF</div>
                <ChevronDown />
              </button>
              {isConvertDropdownOpen && (
                <div className="absolute mt-10 w-48  bg-white shadow-lg rounded-md overflow-y-auto h-80">
                  {navData.convertDropdown.map((section, index) => (
                    <div
                      key={index}
                      className="p-5 justify-center font-semibold"
                      onClick={toggleMobileMenu}
                    >
                      <h1 className="font-bold text-[1rem]">{section.title}</h1>
                      {renderDropdownItems(section.items)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="text-gray-700 hover:text-purple-500  font-bold flex items-center gap-2 text-lg"
                onClick={toggleToolsDropdown}
              >
                <div>ALL PDF TOOLS</div>
                <ChevronDown />
              </button>
              {isToolsDropdownOpen && (
                <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md overflow-y-auto h-80">
                  {navData.toolsDropdown.map((section, index) => (
                    <div
                      key={index}
                      className="p-2 font-semibold text-left"
                      onClick={toggleMobileMenu}
                    >
                      <h1 className="font-bold mb-4 text-[1rem]">
                        {section.title}
                      </h1>
                      {renderDropdownItems(section.items)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { AlignJustify, ChevronDown } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { logout } from "../redux/userSlice";
// import { logoutService } from "../services/Logout.service";
// import logo from "/Vision.png";
// import navData from "./nav-json.json";
// import * as icons from 'lucide-react';

// const IconComponent = ({ name, ...props }) => {
//   const LucideIcon = icons[name];
//   return LucideIcon ? <LucideIcon {...props} /> : null;
// };

// const Header = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkLoginStatus = () => {
//       const email = localStorage.getItem("email");
//       const token = localStorage.getItem("token");
//       setIsLoggedIn(!!email && !!token);
//     };

//     checkLoginStatus();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logoutService();
//       dispatch(logout());
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const renderDropdownContent = (items) => (
//     <div className="grid grid-cols-2 gap-4">
//       {items.map((item, index) => (
//         <Link
//           key={index}
//           to={item.link}
//           className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
//         >
//           <IconComponent name={item.icon} className="w-5 h-5 text-gray-600" />
//           <span className="text-sm font-medium">{item.text}</span>
//         </Link>
//       ))}
//     </div>
//   );

//   return (
//     <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex-shrink-0">
//               <img src={logo} alt="Logo" className="h-8 w-auto" />
//             </Link>
//             <nav className="hidden md:ml-6 md:flex md:space-x-8">
//               {navData.desktopNav.map((item, index) => (
//                 <Link
//                   key={index}
//                   to={item.link}
//                   className="text-gray-700 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   {item.text}
//                 </Link>
//               ))}
//               <HoverCard openDelay={0} closeDelay={200}>
//                 <HoverCardTrigger asChild>
//                   <Button variant="ghost" className="font-medium">
//                     CONVERT PDF <ChevronDown className="ml-1 h-4 w-4" />
//                   </Button>
//                 </HoverCardTrigger>
//                 <HoverCardContent className="w-96 p-4">
//                   <h3 className="font-bold mb-2">Convert PDF</h3>
//                   {renderDropdownContent(navData.convertDropdown[0].items)}
//                 </HoverCardContent>
//               </HoverCard>
//               <HoverCard openDelay={0} closeDelay={200}>
//                 <HoverCardTrigger asChild>
//                   <Button variant="ghost" className="font-medium">
//                     ALL PDF TOOLS <ChevronDown className="ml-1 h-4 w-4" />
//                   </Button>
//                 </HoverCardTrigger>
//                 <HoverCardContent className="w-[600px] p-4">
//                   <h3 className="font-bold mb-2">All PDF Tools</h3>
//                   {renderDropdownContent(navData.toolsDropdown.flatMap(section => section.items))}
//                 </HoverCardContent>
//               </HoverCard>
//             </nav>
//           </div>
//           <div className="flex items-center">
//             {isLoggedIn ? (
//               <Button
//               // onClick={handleLogout}
//                variant="destructive" size="sm">
//                 Logout
//               </Button>
//             ) : (
//               <div className="hidden md:flex items-center space-x-4">
//                 <Button variant="ghost" asChild size="sm">
//                   <Link to="/login">Login</Link>
//                 </Button>
//                 <Button variant="default" asChild size="sm">
//                   <Link to="/signup">Sign Up</Link>
//                 </Button>
//               </div>
//             )}
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon" className="md:hidden ml-4">
//                   <AlignJustify className="h-5 w-5" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent>
//                 <SheetHeader>
//                   <SheetTitle>Menu</SheetTitle>
//                 </SheetHeader>
//                 <nav className="flex flex-col space-y-4 mt-4">
//                   {navData.desktopNav.map((item, index) => (
//                     <Link
//                       key={index}
//                       to={item.link}
//                       className="text-gray-900 hover:text-purple-500 font-medium"
//                     >
//                       {item.text}
//                     </Link>
//                   ))}
//                   <div className="space-y-2">
//                     <h3 className="font-bold">Convert PDF</h3>
//                     {renderDropdownContent(navData.convertDropdown[0].items)}
//                   </div>
//                   <div className="space-y-2">
//                     <h3 className="font-bold">All PDF Tools</h3>
//                     {renderDropdownContent(navData.toolsDropdown.flatMap(section => section.items))}
//                   </div>
//                   {!isLoggedIn && (
//                     <>
//                       <Button variant="ghost" asChild className="justify-start">
//                         <Link to="/login">Login</Link>
//                       </Button>
//                       <Button variant="default" asChild className="justify-start">
//                         <Link to="/signup">Sign Up</Link>
//                       </Button>
//                     </>
//                   )}
//                 </nav>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// import { AlignJustify, ChevronDown, Ghost } from "lucide-react";
// import { Link } from "react-router-dom";
// import logo from "/Vision.png";
// import navData from "./nav-json.json";
// import jpg from "/jpg.png";
// import doc from "/doc.png";
// import html from "/html-5.png";
// import xls from "/xls.png";
// import ppt from "/pptx-file.png";
// import pdf from "/pdf.png";
// import mergePdf from "../../public/Icons/Frame 1.png";
// import splitPdf from "../../public/Icons/Frame 2.png";
// import compressPdf from "../../public/Icons/Frame 3.png";
// import pdfToWord from "../../public/Icons/Frame 11.png";
// import pdfToPowerpoint from "../../public/Icons/Frame 12.png";
// import pdfToExcel from "../../public/Icons/Frame 13.png";
// import wordToPdf from "../../public/Icons/Frame 7.png";
// import powerPointToPdf from "../../public/Icons/Frame 8.png";
// import ExcelToPdf from "../../public/Icons/Frame 9.png";
// import pdfToJpg from "../../public/Icons/Frame 10.png";
// import rotatePdf from "../../public/Icons/Frame 14.png";
// import pageNumber from "../../public/Icons/Frame 15.png";
// import waterMark from "../../public/Icons/Frame 16.png";
// import unlockPdf from "../../public/Icons/Frame 17.png";
// import protactPdf from "../../public/Icons/Frame 18.png";
// import pdfToPdfA from "../../public/Icons/Frame 19.png";
// import signPdf from "../../public/Icons/Frame 21.png";
// import scanPdf from "../../public/Icons/Frame 26.png";
// import jpgToPdf from "../../public/Icons/Frame 6.png";
// import repairPdf from "../../public/Icons/Group.png";
// import ocrPdf from "../../public/Icons/Frame 27.png";
// import comparePdf from "../../public/Icons/Frame 28.png";
// import redactPdf from "../../public/Icons/Frame 29.png";
// import htmlToPdf from "../../public/Icons/comman.png";
// import removePages from "../../public/Icons/comman.png";
// import organizePdf from "../../public/Icons/comman.png";
// import editPdf from "../../public/Icons/Frame 24.png";

// import { SetStateAction, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../redux/userSlice"; // Import your logout action
// import { logoutService } from "../services/Logout.service.ts"; // Import the logout service
// import { Button } from "../ui/button.tsx";

// const iconMap = {
//   jpg,
//   doc,
//   ppt,
//   html,
//   xls,
//   pdf,
//   mergePdf,
//   splitPdf,
//   compressPdf,
//   pdfToWord,
//   pdfToPowerpoint,
//   removePages,
//   pdfToExcel,
//   wordToPdf,
//   powerPointToPdf,
//   ExcelToPdf,
//   pdfToJpg,
//   rotatePdf,
//   pageNumber,
//   waterMark,
//   unlockPdf,
//   protactPdf,
//   pdfToPdfA,
//   signPdf,
//   scanPdf,
//   jpgToPdf,
//   repairPdf,
//   ocrPdf,
//   comparePdf,
//   redactPdf,
//   htmlToPdf,
//   organizePdf,
//   editPdf,
// };

// const Header = () => {
//   const [message, setMessage] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkLoginStatus = () => {
//       const email = localStorage.getItem("email");
//       const token = localStorage.getItem("token");
//       setIsLoggedIn(!!email && !!token);
//     };

//     checkLoginStatus();
//   }, []);

//   const handleLogout = async () => {
//     const email = localStorage.getItem("email");
//     const token = localStorage.getItem("token");

//     if (!email || !token) {
//       setMessage("User is not logged in");
//       return;
//     }

//     const { success } = await logoutService(email, token);

//     if (success) {
//       setMessage("Logged out successfully");

//       // Update the Redux state to reflect the user is logged out
//       dispatch(logout());

//       // Redirect to login page after showing the message for 2 seconds
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//     } else {
//       setMessage(message);
//     }
//   };

//   // ------------------------------------------------

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isConvertDropdownOpen, setIsConvertDropdownOpen] = useState(false);
//   const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

//   // ---------------------------------------------------------------------

//   const [isHovered, setIsHovered] = useState<string | null>(null);

//   const handleMouseEnter = (link: SetStateAction<string | null>) => {
//     setIsHovered(link);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(null);
//   };

//   // ---------------------------------------------------------------------

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//   const closeMobileMenu = () => setIsMobileMenuOpen(false);

//   const toggleConvertDropdown = () => {
//     setIsConvertDropdownOpen(!isConvertDropdownOpen);
//     setIsToolsDropdownOpen(false);
//   };

//   const toggleToolsDropdown = () => {
//     setIsToolsDropdownOpen(!isToolsDropdownOpen);
//     setIsConvertDropdownOpen(false);
//   };

//   const renderDropdownItems = (items) =>
//     items.map((item, index) => (
//       <div key={index} className="flex items-center mt-5">
//         <img src={iconMap[item.icon]} alt="" className="w-5 h-5" />
//         <Link
//           to={item.link}
//           className="px-4 py-2 text-[1rem] gap-5 flex text-gray-700 hover:bg-purple-100"
//         >
//           {item.text}
//         </Link>
//       </div>
//     ));

//   return (
// <div
//       className="bg-transparent  h-[100px]  sm fixed w-full top-0 left-0   z-50   "
//       onMouseLeave={() => {
//         setIsHovered(null)
//         setIsToolsDropdownOpen(false);
//         setIsToolsDropdownOpen(false);
//       }}

// >
// <header
//       className="bg-white shadow-xl  fixed w-full top-0 left-0 py-3 items-center z-50  flex  justify-between px-6"
//       // onMouseLeave={() => {
//       //   setIsHovered(null)
//       //   setIsToolsDropdownOpen(false);
//       //   setIsToolsDropdownOpen(false);
//       // }}
//     >
//       {/* <div className="w-full max-w-screen-xl bg-blue-900 py-3 flex  justify-between mx-10"> */}
//       {/* Left Section: Logo and Navigation Links */}

//       <div className="flex items-center">
//         {" "}
//         {/* Adjusted space between items */}
//         <nav className="hidden md:flex md:items-center gap-8 ">
//           {" "}
//           {/* Adjusted spacing */}
//           <Link to="/">
//             <img alt="" src={logo} className="h-10 mt-0 mr-[2rem]" />
//           </Link>
//           {navData.desktopNav.map((item, index) => (
//             <Link
//               key={index}
//               to={item.link}
//               className="text-gray-700 hover:text-purple-500 font-bold text-center"
//             >
//               {item.text}
//             </Link>
//           ))}
//           <div className="relative">
//             <button
//               className="text-gray-700  hover:text-purple-500 font-bold flex items-center justify-center gap-[qrem] "
//               onMouseEnter={() => handleMouseEnter("convertPdf")}

//             >
//               CONVERT PDF
//               <ChevronDown />
//             </button>
//             {isHovered === "convertPdf" && (
//               <div
//                 id="converPdfDropDown"
//                 className="absolute mt- bg-white shadow-lg rounded-md flex w-[560px]  top-20 space-x-4 p-4"
//                 onMouseLeave={() => handleMouseLeave()}
//                 onClick={() => handleMouseLeave()}
//               >
//                 {" "}
//                 {/* Added equal space between sections */}
//                 {navData.convertDropdown.map((section, index) => (
//                   <div key={index} className="p-5 justify-center font-semibold">
//                     <h1 className="font-bold text-[1rem]">{section.title}</h1>
//                     {renderDropdownItems(section.items)}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div className="relative">
//             <button
//               className="text-gray-700 w-40 hover:text-purple-500 font-bold flex items-center justify-center gap-2 relative"
//               onMouseEnter={() => handleMouseEnter("AllPdfTools")}
//               onMouseLeave={toggleToolsDropdown} // Optional, for closing when mouse leaves
//             >
//               ALL PDF TOOLS
//               <ChevronDown />
//             </button>

//             {isHovered === "AllPdfTools" && (
//               <div
//       // className="absolute left-1/2 xl:left-0 top-[3.2rem] transform -translate-x-1/2 mt-2 z-20 bg-white shadow-lg rounded-md  md:w-[300px] lg:w-[500px] xl:w-[1000px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 py-4 px-2 gap-2 xl:gap-4 my-[1rem]"
//       className="absolute left-1/2  top-20 transform -translate-x-1/2  z-20 bg-white shadow-lg rounded-md
//         md:w-[500px]   lg:p-2 lg:w-[1000px] xl:w-[1400px]
//         flex flex-wrap gap-6 xl:gap-4  px-2 mx-2  max-h-[780px]  overflow-y-auto"

//       onMouseLeave={() => handleMouseLeave()}
//                 onClick={() => handleMouseLeave()}
//               >
//                 {navData.toolsDropdown.map((section, index) => (
//                   <div key={index} className=" font-semibold text-left">
//                     <h1 className="font-bold mb-4 text-sm">
//                       {section.title}
//                     </h1>
//                     {renderDropdownItems(section.items)}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </nav>
//       </div>

//       {/* Right Section: Login and Sign Up */}
//       <div className="flex items-center gap-6">
//         {" "}
//         {/* Adjusted gap between login and sign up */}
//         <div>
//           {isLoggedIn ? (
//             <div>
//               <button
//                 onClick={handleLogout}
//                 className="p-2 justify-center items-center text-sm text-white bg-purple-500 rounded hover:bg-purple-600"
//               >
//                 Logout
//               </button>
//               <p>{message}</p>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-4">
//               {" "}
//               {/* Adjusted space between login and sign up */}
//               <a
//                 href="#"
//                 className="text-gray-700 hover:text-purple-500 font-bold"
//               >
//                 Login
//               </a>
//               <Button      variant ={"purple"}
// //  className="p-2 justify-center items-center text-sm text-white bg-red-500 rounded hover:bg-red-600"
//  >
//                 Sign Up
//               </Button>
//             </div>
//           )}
//         </div>
//         <button
//           className="sm:hidden flex items-center ml-auto"
//           onClick={toggleMobileMenu}
//         >
//           <AlignJustify />
//         </button>
//       </div>
//       {/* </div> */}

//       {/* Mobile Menu */}
//       <div
//         className={`fixed inset-0 bg-white shadow-md transition-transform     transform ${
//           isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
//         } md:hidden z-100`}
//       >
//         <div className="p-4">
//           <button className="flex items-center mb-4" onClick={closeMobileMenu}>
//             <AlignJustify />
//           </button>
//           <nav className="flex flex-col space-y-4">
//             {navData.desktopNav.map((item, index) => (
//               <Link
//                 onClick={closeMobileMenu}
//                 key={index}
//                 to={item.link}
//                 className="text-gray-900 hover:text-purple-500 font-bold "
//               >
//                 {item.text}
//               </Link>
//             ))}
//             <div className="relative">
//               <button
//                 className="text-gray-700 hover:text-purple-500 font-bold flex items-center gap-2 text-lg"
//                 onClick={toggleConvertDropdown}
//               >
//                 <div>CONVERT PDF</div>
//                 <ChevronDown />
//               </button>
//               {isConvertDropdownOpen && (
//                 <div className="absolute mt-10 w-48  bg-white shadow-lg rounded-md overflow-y-auto h-80">
//                   {navData.convertDropdown.map((section, index) => (
//                     <div
//                       key={index}
//                       className="p-5 justify-center font-semibold"
//                       onClick={toggleMobileMenu}
//                     >
//                       <h1 className="font-bold text-[1rem]">{section.title}</h1>
//                       {renderDropdownItems(section.items)}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="relative">
//               <button
//                 className="text-gray-700 hover:text-purple-500 font-bold flex items-center gap-2 text-lg"
//                 onClick={toggleToolsDropdown}
//               >
//                 <div>ALL PDF TOOLS</div>
//                 <ChevronDown />
//               </button>
//               {isToolsDropdownOpen && (
//                 <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md overflow-y-auto h-80">
//                   {navData.toolsDropdown.map((section, index) => (
//                     <div
//                       key={index}
//                       className="p-2 font-semibold text-left"
//                       onClick={toggleMobileMenu}
//                     >
//                       <h1 className="font-bold mb-4 text-[1rem]">
//                         {section.title}
//                       </h1>
//                       {renderDropdownItems(section.items)}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//           </nav>
//         </div>
//       </div>
//     </header>
// </div>

//   );
// };

// export default Header;
