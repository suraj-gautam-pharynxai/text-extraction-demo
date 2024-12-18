import React from "react";
import { BrowserRouter } from "react-router-dom";
import FromToEXcel from "./components/ChatwithForm";

const App = () => {
  return (
    <BrowserRouter basename="/pharynxvision">
      <FromToEXcel/>
    </BrowserRouter>

  );
};

export default App;






// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import Header from "./components/header";
// import AppRoutes from "./routes/AppRoutes";

// const App = () => {
//   return (
//     <BrowserRouter basename="/pharynxvision">
//       <div className="flex flex-col space-y-8  h-screen ">
//         <Header />
//         <div className="flex-grow border-2 ">
//           <AppRoutes />        
//         </div>
//       </div>
//     </BrowserRouter>

//   );
// };

// export default App;



