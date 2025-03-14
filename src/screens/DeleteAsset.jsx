import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import authContext from '../context/authContext';

const DeleteAsset = () => {
  const { editAssetData, deleteAsset } = useContext(authContext);
  const navigate = useNavigate();

  // Mobile Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Dummy logout handler (update this with your actual logout logic)

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
       
        navigate("/");
      } catch (error) {
        console.error("Error during logout", error);
      }
    };
  // Delete asset handler
  const handleDelete = async (assetId) => {
    await deleteAsset(assetId);
    localStorage.setItem("activeBtn", "editassets");
    navigate('/editassets');
  };

  return (
    <div className="relative">
      {/* Mobile Sidebar Toggle Button */}
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
              <button onClick={handleLogout} className="block text-gray-200 hover:text-white">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-3xl text-center md:text-left font-bold text-white">Delete Asset</h1>
        <p className="text-sm mt-1  text-center md:text-left text-[#5B5A99]">
          Remove assets from your collection.
        </p>

        {/* Asset Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editAssetData.map((asset) => (
            <div
              key={asset._id}
              className="bg-[#2b2e4a] p-4 rounded-lg shadow-lg text-white"
            >
              {asset.image && (
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <h2 className="text-lg font-bold mt-3">{asset.title}</h2>
              <p className="text-sm text-gray-300 mt-1">{asset.description}</p>
              <button
                onClick={() => handleDelete(asset._id)}
                className="mt-4 w-full py-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg text-sm font-semibold hover:scale-105 transition-all"
              >
                Delete Asset
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeleteAsset;
