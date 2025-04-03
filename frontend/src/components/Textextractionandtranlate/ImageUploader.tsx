import React, { useEffect, useState } from "react";
import englishData from "../../service/en.json";
import hindiData from "../../service/hi.json";
const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<string | null>(
    localStorage.getItem("uploadedImage") || null
  );
  const [isExpandedHi, setIsExpandedHi] = useState(false);
  const [isExpandedEn, setIsExpandedEn] = useState(false);

  const wordLimit = 700;
  const words1 = englishData.body.split(" ");
  const word2 = hindiData.body.split(" ");
  useEffect(() => {
    // Retrieve the image from localStorage when the component mounts
    const storedImage = localStorage.getItem("uploadedImage");
    if (storedImage) {
      setImage(storedImage);
    }
  }, []);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setImage(imageData);
        localStorage.setItem("uploadedImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    localStorage.removeItem("uploadedImage");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-400">
      {/* Upload Box */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-[63%] flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Upload Image
        </h2>

        {image && (
          <div className="mb-4 overflow-auto rounded-lg w-full">
            <img
              src={image}
              alt="Uploaded Preview"
              className="w-full object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex flex-row">
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex justify-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            Select Image
          </label>
          <button
            onClick={handleRemoveImage}
            className="mx-5 bg-red-400 w-22 h-12 rounded-xl px-3 text-white"
          >
            Remove Image
          </button>
        </div>
      </div>
      {/* Second div positioned just below the upload box */}
      <div className="flex flex-row gap-6 mt-6">
        {/* Left div */}
        <div className="text-start bg-white mx-3 px-3 py-4 rounded-xl w-1/2">
          <h1 className="text-xl mb-4">{englishData.headline}</h1>
          <p>
            {isExpandedEn
              ? englishData.body
              : words1.slice(0, wordLimit).join(" ")}{" "}
            {words1.length > wordLimit && (
              <button
                onClick={() => setIsExpandedEn(!isExpandedEn)}
                className="text-blue-500 underline ml-2"
              >
                {/* {isExpandedEn ? "Show Less" : "... More"} */}
              </button>
            )}
          </p>
          <hr />
          <br />
          <p>{englishData.captions}</p>
        </div>
        {/* Right div */}
        <div className="text-start bg-white mx-3 px-3 py-4 rounded-xl w-1/2">
          <h1 className="text-xl mb-4">{hindiData.headline}</h1>
          <p>
            {isExpandedHi
              ? hindiData.body
              : word2.slice(0, wordLimit).join(" ")}{" "}
            {word2.length > wordLimit && (
              <button
                onClick={() => setIsExpandedHi(!isExpandedHi)}
                className="text-blue-500 underline ml-2 cursor-pointer"
              >
                {/* {isExpandedHi ? "कम दिखाएँ" : "... अधिक पढ़ें"} */}
              </button>
            )}
          </p>
          <hr />
          <br />
          <p>{hindiData.captions}</p>
        </div>{" "}
      </div>
    </div>
  );
};

export default ImageUploader;
