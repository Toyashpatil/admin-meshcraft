import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Face from "../assets/face.png";
import Logout from "../assets/svgs/logout.svg";
import authContext from '../context/authContext';
import Dialog from '../components/Dialog';

const EditDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Grab ?assetId=... from the query string
  const queryParams = new URLSearchParams(location.search);
  const assetId = queryParams.get('assetId');

  // Pull data/functions from our context
  const {
    editAssetData,      // array of all assets (each has .image, .thumbnailId, etc.)
    updateAsset,
    uploadThumbnail,
    editThumbnail,
  } = useContext(authContext);

  // Find the matching asset
  const assetData = editAssetData.find(a => a._id === assetId);

  // If no match, show an error
  if (!assetData) {
    return <div className="text-white text-center text-2xl mt-10">No asset data found</div>;
  }

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Local state for editing
  const [asset, setAsset] = useState(assetData);

  // Local state for image preview
  // Initially, we show assetData.image if it exists, else ""
  const [imagePreview, setImagePreview] = useState(assetData.image || "");

  // If assetData changes in the future, you might also add a useEffect to sync, but typically once is enough

  // Handle text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset(prev => ({ ...prev, [name]: value }));
  };

  // Handle "technical" fields (nested object)
  const handleTechnicalChange = (e) => {
    const { name, value } = e.target;
    setAsset(prev => ({
      ...prev,
      technical: {
        ...prev.technical,
        [name]: value,
      },
    }));
  };

  // Handle user selecting a new file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      // Store the File object so we know to upload it on Save
      setAsset(prev => ({ ...prev, newImageFile: file }));
    }
  };

  // Save changes
  const handleSave = async () => {
    // 1) Update text fields on the asset
    await updateAsset(assetId, {
      title: asset.title,
      description: asset.description,
      extendedDescription: asset.extendedDescription,
      poly: asset.poly,
      technical: asset.technical
      // plus any other fields you want to update
    });

    // 2) If a new file was selected, either edit or upload
    if (asset.newImageFile) {
      if (assetData.thumbnailId) {
        // If the asset already has a thumbnail doc, replace that doc's file
        await editThumbnail(assetData.thumbnailId, asset.newImageFile);
      } else {
        // If there's no existing doc, create one
        await uploadThumbnail(assetId, asset.newImageFile);
      }
    }

    alert("Asset details updated successfully!");
    navigate('/editassets');
  };

  // Reset changes
  const handleReset = () => {
    setAsset(assetData);
    setImagePreview(assetData.image || "");
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data.message); // "Logout successful"
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      {/* MOBILE SIDEBAR TOGGLE */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          {sidebarOpen ? (
            <FaTimes className="text-white text-xl" />
          ) : (
            <FaBars className="text-white text-xl" />
          )}
        </button>
      </div>

      {/* MOBILE SIDEBAR MENU */}
      {sidebarOpen && (
        <div className="md:hidden fixed top-20 left-4 bg-[#1b1e33] rounded-lg shadow-lg p-4 z-40">
          <ul className="space-y-2">
            <li>
              <a href="/addassets" className="block text-gray-200 hover:text-white">
                Add Assets
              </a>
            </li>
            <li>
              <a href="/editassets" className="block text-gray-200 hover:text-white">
                Edit Assets
              </a>
            </li>
            <li>
              <a href="/deleteassets" className="block text-gray-200 hover:text-white">
                Delete Assets
              </a>
            </li>
            <li>
              <a href="/profile" className="block text-gray-200 hover:text-white">
                Profile
              </a>
            </li>
            <li>
              <button className="text-gray-200" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* If you have a <Dialog> component that shows some popup */}
        <Dialog title={assetData.title} description={assetData.description} />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">Edit Details here</h1>
          <p className="text-sm mt-1 text-[#5B5A99]">Add any type of asset in just a click</p>
        </div>
        <div className="flex items-center gap-4 justify-center">
          <div className="hidden sm:flex items-center space-x-2 cursor-pointer">
            <img
              src={Face}
              alt="profile"
              className="w-8 h-8 object-cover shadow-2xl drop-shadow-lg rounded-full"
            />
            <span className="text-sm font-medium text-[#5B5A99]">Admin</span>
          </div>
          <div onClick={handleLogout} className="hidden sm:flex items-center space-x-2 cursor-pointer">
            <img src={Logout} alt="logout" className="w-6 h-6" />
            <span className="text-sm font-medium text-[#5B5A99]">Logout</span>
          </div>
        </div>
      </header>

      {/* IMAGE PREVIEW & UPLOAD */}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Asset Preview"
              className="w-48 h-48 object-cover rounded-lg shadow-xl border-2 border-purple-500"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center border-2 border-gray-500 rounded-lg">
              <p className="text-gray-400 text-sm">No Thumbnail</p>
            </div>
          )}
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

      {/* EXTENDED DESCRIPTION */}
      <div className="mt-4">
        <label className="text-gray-300 text-sm">Extended Description</label>
        <textarea
          name="extendedDescription"
          value={asset.extendedDescription}
          onChange={handleChange}
          rows="3"
          className="w-full bg-[#1b1e33] text-white px-4 py-2 rounded-md border border-gray-500 outline-none"
        />
      </div>

      {/* POLY */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
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
