import React, { useState, useEffect, useContext } from 'react';
import { FaBell,FaBars, FaTimes } from 'react-icons/fa';
import Face from "../assets/face.png";
import assetsData from "../../src/data/assetData.json"; // Import JSON file
import { useNavigate } from 'react-router-dom';
import Logout from "../assets/svgs/logout.svg";
import authContext from '../context/authContext';
import Dialog from '../components/Dialog';
const EditAsset = () => {
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();
  const {editAssetData,setEditAssetData}=useContext(authContext)
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
  const { 
    assetData, 
    setAssetData, 
    previewSrc, 
    setPreviewSrc, 
    setOpen,
    createAsset 
  } = useContext(authContext);
  useEffect(() => {
    setAssets(editAssetData); // Load assets from JSON
  }, [editAssetData]);

  const handleEdit = (asset) => {
    console.log(asset)
    navigate(`/editassets/editdetails?assetId=${asset._id}`, { state: asset }); 
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
    // Toggle sidebar dropdown
    const toggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };

  return (
    <div className="p-6 min-h-screen bg-[#1d1e28]  text-white relative">
      {/* Header Section */}
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
            <h1 className="text-3xl font-bold">Edit Assets</h1>
            <p className="text-sm mt-1 text-[#5B5A99]">
            Manage and edit your assets effortlessly
            </p>
          </div>
          <div className="flex items-center gap-4 justify-center">
            {/* <div className="hidden sm:flex items-center px-4 gap-2 py-2 bg-gradient-to-r from-pink-500 to-purple-600 
              rounded-full shadow-xl cursor-pointer hover:scale-105 transition-transform">
              <FaBell className="text-white text-sm" />
              <h1 className="text-white text-sm mb-0.5">15</h1>
            </div> */}
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
