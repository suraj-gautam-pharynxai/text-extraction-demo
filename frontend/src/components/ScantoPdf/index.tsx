import Header from "../header";

const ScanToPDF = () => {
  return (
    <>
    
    <div className="min-h-screen flex flex-col mt-8 items-center justify-center bg-gray-100 ">
      <h1 className="text-6xl font-bold mb-8">Scan to PDF</h1>
      <p className="text-2xl mb-6">Scan documents from your smartphone to your browser</p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
        <div className="bg-white shadow-md rounded-lg p-8 text-center w-80">
          <h2 className="text-2xl font-semibold mb-4">Step 1</h2>
          <p className="text-gray-600 mb-4">
            Use your smartphone's camera to scan this QR code
          </p>
          <div className="border border-gray-200 p-8 rounded-lg">
            <img
              src="https://img.freepik.com/free-vector/scan-me-qr-code_78370-2915.jpg?t=st=1727091836~exp=1727095436~hmac=7d82c7aaa6cc8924ae265b6b7f7d8f512bf2da0f17e03db5f8764b7a5d7e838a&w=740"
              alt="QR Code"
              className="w-48 h-48 object-cover"
            />
          </div>
        </div>

        <div className="bg-gray-100 shadow-md rounded-lg p-8 text-center w-80 opacity-50">
          <h2 className="text-2xl font-semibold mb-4">Step 2</h2>
          <p className="text-gray-600 mb-2">
            <span className="text-yellow-600 font-semibold">Disconnected </span>
            📲
          </p>
          <p className="text-gray-500">
            To scan your documents, please follow the instructions on your mobile screen, and tap Save when you're done.
          </p>
          <p className="text-gray-500 mt-4">
            Do not close this tab.
          </p>
          <div className="mt-8">
            <img
              src="https://img.freepik.com/free-vector/human-hand-holding-mobile-phone_74855-6532.jpg?w=740&t=st=1727091774~exp=1727092374~hmac=fe4abba45035db9c604f15a04947e7cfe5b1450cfeea96c2b64c576e6c7660ba"
              alt="Phone Illustration"
              className="w-20 h-20 object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ScanToPDF;
