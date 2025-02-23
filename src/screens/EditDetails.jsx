// src/pages/EditDetails.js

import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Face from "../assets/face.png";
import Logout from "../assets/svgs/logout.svg";
import authContext from '../context/authContext';

const EditDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const assetId = queryParams.get("assetId");

  const { editAssetData, updateAsset } = useContext(authContext);

  const assetData = editAssetData.find(asset => asset._id === assetId);

  if (!assetData) {
    return <div className="text-white text-center text-2xl mt-10">No asset data found</div>;
  }

  // Store local copy of the asset in state
  const [asset, setAsset] = useState(assetData);
  // If your asset from the DB has an `image` field, use it; otherwise, fallback to empty string
  const [imagePreview, setImagePreview] = useState(assetData.image || "");

  // Generic handler for text inputs (title, description, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset(prev => ({ ...prev, [name]: value }));
  };

  // Separate handler for technical details
  const handleTechnicalChange = (e) => {
    const { name, value } = e.target;
    setAsset(prev => ({
      ...prev,
      technical: {
        ...prev.technical,
        [name]: value
      }
    }));
  };

  // Optional: if you want to handle an image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      // If you're not actually uploading the file to the server, this might just be for local preview
      setAsset(prev => ({ ...prev, image: file }));
    }
  };

  const handleSave = async () => {
    // 1) Make a PUT request via context to update the asset on the server
    await updateAsset(assetId, {
      title: asset.title,
      description: asset.description,
      technical: asset.technical,
      extendedDescription:asset.extendedDescription,
      poly:asset.poly
    });

    alert("Asset details updated successfully!");

    navigate('/editassets');
  };

  const handleReset = () => {
    setAsset(assetData);
    setImagePreview(assetData.image || "");
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div className="text-white">
          <h1 className="text-3xl font-bold">Edit Assets</h1>
          <p className="text-sm mt-1 text-[#5B5A99]">
            Manage and edit your assets effortlessly
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center px-4 gap-2 py-2 bg-gradient-to-r from-pink-500 to-purple-600 
            rounded-full shadow-xl cursor-pointer hover:scale-105 transition-transform">
            <FaBell className="text-white text-sm" />
            <h1 className="text-white text-sm mb-0.5">15</h1>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src={Face} alt="profile" className="w-8 h-8 object-cover rounded-full" />
            <span className="text-sm font-medium text-[#5B5A99]">Admin</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src={Logout} alt="logout" />
            <span className="text-sm font-medium text-[#5B5A99]">Logout</span>
          </div>
        </div>
      </header>

      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 inline-block text-transparent bg-clip-text">
        Edit Asset
      </h1>

      {/* IMAGE PREVIEW AND UPLOAD */}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
        <div className="relative">
          {/* Image preview (existing or newly selected) */}
          <img
            src={imagePreview}
            alt="Asset Preview"
            className="w-48 h-48 object-cover rounded-lg shadow-xl border-2 border-purple-500"
          />
        </div>
        <div className="w-full">
          <label className="text-gray-300 text-sm">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-[#1b1e33] text-white px-4 py-2 rounded-md border border-gray-500 outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* TITLE */}
      <div className="mt-6">
        <label className="text-gray-300 text-sm">Asset Title</label>
        <input
          type="text"
          name="title"
          value={asset.title}
          onChange={handleChange}
          className="w-full bg-[#1b1e33] text-white px-4 py-2 rounded-md border border-gray-500 outline-none"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mt-4">
        <label className="text-gray-300 text-sm">Description</label>
        <textarea
          name="description"
          value={asset.description}
          onChange={handleChange}
          rows="3"
          className="w-full bg-[#1b1e33] text-white px-4 py-2 rounded-md border border-gray-500 outline-none"
        />
      </div>
      <div className="mt-4">
        <label className="text-gray-300 text-sm">extended Description</label>
        <textarea
          name="extendedDescription"
          value={asset.extendedDescription}
          onChange={handleChange}
          rows="3"
          className="w-full bg-[#1b1e33] text-white px-4 py-2 rounded-md border border-gray-500 outline-none"
        />
      </div>
      <div className="mt-6">
        <label className="text-gray-300 text-sm">Poly</label>
        <input
          type="text"
          name="poly"
          value={asset.poly}
          onChange={handleChange}
          className="w-full bg-[#1b1e33] text-white px-4 py-2 rounded-md border border-gray-500 outline-none"
        />
      </div>

      {/* TECHNICAL DETAILS */}
      <div className="mt-6 p-4 bg-[#2b2e4a] rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3">Technical Details</h2>
        <div className="grid grid-cols-3 gap-4">
          {["objects", "vertices", "edges", "format", "faces", "triangles"].map((field) => (
            <div key={field}>
              <label className="text-gray-300 text-sm capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={asset.technical?.[field] || ""}
                onChange={handleTechnicalChange}
                className="w-full bg-[#1b1e33] text-white px-4 py-2 rounded-md border border-gray-500 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:scale-105 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditDetails;
