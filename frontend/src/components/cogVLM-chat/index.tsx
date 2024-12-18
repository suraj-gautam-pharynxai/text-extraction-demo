import { useState } from 'react';
import arrowIcon from "../../../public/icons8-arrow-50 (2).png"
import menuIcon from "../../../public/icons8-menu-80.png"
import humanIcon from "../../../public/human.webp"
import robotIcon from "../../../public/chatbot_10321395.png"
const CogVLMChat = () => {
  const [topP, setTopP] = useState(0.29);
  const [temperature, setTemperature] = useState(0.80);
  const [topK, setTopK] = useState(1);
  const [outputLength, setOutputLength] = useState(1279);
  const [selectedModel, setSelectedModel] = useState('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [imageSrc, setImageSrc] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-900 text-white ">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-full md:w-1/4 bg-gray-800 p-6 space-y-6 fixed md:relative inset-0 z-20 md:z-auto ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Settings !</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white text-xl"
          >
            &times;
          </button>
        </div>
      
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">top_p</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full mt-1"
            />
            <span className=" text-gary-300 font-bold">{topP.toFixed(2)}</span>
          </div>
      
          <div>
            <label className="block text-sm font-medium text-gray-300">temperature</label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full mt-1"
            />
            <span className="text-gray-300 font-bold">{temperature.toFixed(2)}</span>
          </div>
      
          <div>
            <label className="block text-sm font-medium text-gray-300">top_k</label>
            <input
              type="range"
              min="1"
              max="20"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full mt-1"
            />
            <span className="text-gray-300 font-bold">{topK}</span>
          </div>
      
          <div>
            <label className="block text-sm font-medium text-gray-300">Output length</label>
            <input
              type="range"
              min="1"
              max="2048"
              value={outputLength}
              onChange={(e) => setOutputLength(parseInt(e.target.value))}
              className="w-full mt-1"
            />
            <span className="text-gary-300 font-bold">{outputLength}</span>
          </div>
        </div>

        <label className="block text-2xl font-medium  text-gray-300">Choose an image...</label>
        <div className="mt-auto bg-gray-900 rounded p-5">
        {imageSrc ? (
          <img src={imageSrc} alt="Uploaded" className="w-full h-36 rounded" />
        ) : (
          <div className="text-gray-400 text-center">No image selected</div>
        )}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept=".jpg,.png,.jpeg"
          onChange={handleImageUpload}
          className="mt-4 w-full text-gray-400 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
        />
      </div>
      
        <div className="mt-4 flex justify-between space-x-4">
          <button className="w-full text-purple-600 hover:text-purple-700 p-2 rounded font-bold bg-gray-900">Retry</button>
          <button className="w-full text-purple-600 hover:text-purple-700  p-2 rounded font-bold bg-gray-900">Clear History</button>
        </div>
      </div>
      
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col justify-between bg-gray-900 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-0' : 'ml-0'}`}>
       <div className='overFlow-y-auto'>
       <div className="flex justify-center  space-x-4 mb-8 mt-20 md:mt-0">
          <button
            onClick={() => setSelectedModel('en')}
            className={`px-4 py-2 rounded ${selectedModel === 'en' ? 'bg-purple-600' : 'bg-gray-900 border border-purple-600'}`}
          >
            CogVLM2-Chat-En
          </button>
          <button
            onClick={() => setSelectedModel('zh')}
            className={`px-4 py-2 rounded ${selectedModel === 'zh' ? 'bg-purple-600' : 'bg-gray-900 border border-purple-600'}`}
          >
            CogVLM2-Chat-Zh
          </button>
        </div>


        <div className="bg-gray-900 w-full max-w-3xl p-4 mt-4 rounded text-center border border-purple-600 mx-auto">
         <span className='text-purple-600 font-bold text-lg'> Please upload an image to start</span>
        </div>


        <div className="bg-gray-7 00 w-full flex max-w-3xl p-4 rounded text-center gap-5 items-center mx-auto">
          <img src={humanIcon} className='w-10 h-10 rounded-full' alt="" />
          <span className='text-lg font-semibold '>This option uses cogvlm2-chat-en model.</span>
        </div>

       
        <div className="bg-gray-7 00 w-full flex max-w-3xl p-4 rounded text-center gap-5 items-center mx-auto">
          <img src={robotIcon} className='w-10 h-10 rounded-full' alt="" />
          <span className='text-lg font-semibold '>This option uses cogvlm2-chat-en model.</span>
        </div>
        
          {/* {imageSrc ? (
            <div className="bg-purple-700 w-full   mb-2 max-w-3xl p-2 mt-4  rounded text-center mx-auto">
            <img src={imageSrc} alt="Uploaded" className="w-full h-auto rounded" />
          </div>

          ) : (
            ""
          )} */}
       </div>

        {/* Chat Input at Bottom */}
        <div className="w-full max-w-3xl mx-auto flex mt-4 md:mt-auto ">
          <input
            type="text"
            placeholder="Chat with CogVLM2"
            className="w-full border border-gray-600 border-r-0 p-5 text-lg rounded-l-lg bg-gray-700 text-white focus:outline-none"
            
          />
          <button className="bg-gray-700 border border-l-0 border-gray-600 p-4 rounded-r">
         <img src={arrowIcon} className='w-10' alt="" />
        </button>
        </div>
        
      </div>

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 md:left-6  text-white  rounded"
        >
        <img src={menuIcon} className='w-10 h-10' alt="" />
        </button>
      )}
    </div>
  );
};

export default CogVLMChat;
