import { useState } from 'react';

const Sidebar = () => {
  const [topP, setTopP] = useState(0.29);
  const [temperature, setTemperature] = useState(0.80);
  const [topK, setTopK] = useState(1);
  const [outputLength, setOutputLength] = useState(1279);

  return (
    <div className="w-64 bg-gray-800 p-6 text-white space-y-6 h-screen">
      <div>
        <label className="block text-sm font-medium">top_p</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={topP}
          onChange={(e) => setTopP(parseFloat(e.target.value))}
          className="w-full mt-1"
        />
        <span className="text-sm">{topP.toFixed(2)}</span>
      </div>

      <div>
        <label className="block text-sm font-medium">temperature</label>
        <input
          type="range"
          min="0.01"
          max="1"
          step="0.01"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full mt-1"
        />
        <span className="text-sm">{temperature.toFixed(2)}</span>
      </div>

      <div>
        <label className="block text-sm font-medium">top_k</label>
        <input
          type="range"
          min="1"
          max="20"
          value={topK}
          onChange={(e) => setTopK(parseInt(e.target.value))}
          className="w-full mt-1"
        />
        <span className="text-sm">{topK}</span>
      </div>

      <div>
        <label className="block text-sm font-medium">Output length</label>
        <input
          type="range"
          min="1"
          max="2048"
          value={outputLength}
          onChange={(e) => setOutputLength(parseInt(e.target.value))}
          className="w-full mt-1"
        />
        <span className="text-sm">{outputLength}</span>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">Choose an image...</label>
        <input
          type="file"
          accept=".jpg,.png,.jpeg"
          className="mt-1 w-full text-gray-500 cursor-pointer"
        />
      </div>

      <div className="mt-4">
        <button className="w-full text-purple-600 hover:text-purple-700 mb-2">Retry</button>
        <button className="w-full text-purple-600 hover:text-purple-700">Clear History</button>
      </div>
    </div>
  );
};

export default Sidebar;
