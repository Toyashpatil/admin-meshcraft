import React, { useState, useEffect, useContext } from 'react';
import { FaBell } from 'react-icons/fa';
import Face from "../assets/face.png";
import assetsData from "../../src/data/assetData.json"; // Import JSON file
import { useNavigate } from 'react-router-dom';
import Logout from "../assets/svgs/logout.svg";
import authContext from '../context/authContext';

const EditAsset = () => {
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();
  const {editAssetData,setEditAssetData}=useContext(authContext)

  useEffect(() => {
    setAssets(editAssetData); // Load assets from JSON
  }, [editAssetData]);

  const handleEdit = (asset) => {
    console.log(asset)
    navigate(`/editassets/editdetails?assetId=${asset._id}`, { state: asset }); // ✅ Pass asset ID as a query parameter
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <header className="flex items-center justify-between">
        <div className="text-white">
          <h1 className="text-3xl font-bold">Edit Assets</h1>
          <p className="text-sm mt-1 text-[#5B5A99]">
            Manage and edit your assets effortlessly
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="flex items-center px-4 gap-2 py-2 bg-gradient-to-r from-pink-500 to-purple-600 
              rounded-full shadow-xl cursor-pointer hover:scale-105 transition-transform">
            <FaBell className="text-white text-sm" />
            <h1 className="text-white text-sm mb-0.5">15</h1>
          </div>
          {/* Profile */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src={Face} alt="profile" className="w-8 h-8 object-cover shadow-2xl drop-shadow-lg rounded-full" />
            <span className="text-sm font-medium text-[#5B5A99]">John Doe</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src={Logout} alt="profile" />
            <span className="text-sm font-medium text-[#5B5A99]">Logout</span>
          </div>
        </div>
      </header>

      {/* Asset Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map(asset => (
          <div key={asset.id} className="bg-[#2b2e4a] p-4 rounded-lg shadow-lg text-white">
            <img src={asset.image} alt={asset.title} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-lg font-bold mt-3">{asset.title}</h2>
            <p className="text-sm text-gray-300 mt-1">{asset.description}</p>
            <p className="text-sm text-gray-300 mt-1">{asset.extendedDescription}</p>



            {/* Technical Details */}
            <div className="mt-4 text-sm grid grid-cols-2 gap-2">
              <p><span className="font-bold text-gray-400">Objects:</span> {asset.technical.objects}</p>
              <p><span className="font-bold text-gray-400">Vertices:</span> {asset.technical.vertices.toLocaleString()}</p>
              <p><span className="font-bold text-gray-400">Edges:</span> {asset.technical.edges.toLocaleString()}</p>
              <p><span className="font-bold text-gray-400">Format:</span> {asset.technical.format}</p>
              <p><span className="font-bold text-gray-400">Faces:</span> {asset.technical.faces}</p>
              <p><span className="font-bold text-gray-400">Triangles:</span> {asset.technical.triangles}</p>
            </div>

            <button
              onClick={() => handleEdit(asset)}
              className="mt-4 w-full cursor-pointer py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-sm font-semibold hover:scale-105 transition-all">
              Edit Asset
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditAsset;
