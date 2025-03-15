import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
import Face from "../assets/face.png";
import Logout from "../assets/svgs/logout.svg";
import authContext from '../context/authContext';
import Dialog from '../components/Dialog';

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

  // State for mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Local state for asset and image preview
  const [asset, setAsset] = useState(assetData);
  const [imagePreview, setImagePreview] = useState(assetData.image || "");

  // Handler for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset(prev => ({ ...prev, [name]: value }));
  };

  // Handler for technical details inputs
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

  // Handler for image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setAsset(prev => ({ ...prev, image: file }));
    }
  };

  // Save updated asset details
  const handleSave = async () => {
    await updateAsset(assetId, {
      title: asset.title,
      description: asset.description,
      technical: asset.technical,
      extendedDescription: asset.extendedDescription,
      poly: asset.poly
    });
    alert("Asset details updated successfully!");
    navigate('/editassets');
  };

  // Reset changes to original asset data
  const handleReset = () => {
    setAsset(assetData);
    setImagePreview(assetData.image || "");
  };
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data.message); // "Logout successful"

      // Clear token and update auth state
      localStorage.removeItem("token");
     
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };
  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      {/* Mobile Sidebar Toggle */}
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
      
            {/* Mobile Sidebar Dropdown Menu */}
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
                      <button className='text-gray-200' onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
              </div>
            )}
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Dialog title={assetData.title} description={assetData.description} />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">Edit Details here</h1>
          <p className="text-sm mt-1 text-[#5B5A99]">
            Add any type of asset in just a click
          </p>
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


      {/* IMAGE PREVIEW AND UPLOAD */}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
        <div className="relative">
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
        <label className="text-gray-300 text-sm">Extended Description</label>
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
