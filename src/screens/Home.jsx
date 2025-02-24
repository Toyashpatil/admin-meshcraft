import React, { useContext, useState } from 'react';
import { FaBell, FaWallet, FaBars, FaTimes } from 'react-icons/fa';
import { IoNewspaper } from 'react-icons/io5';
import { SiVirustotal } from 'react-icons/si';
import Dialog from '../components/Dialog';
import authContext from '../context/authContext';
import Face from "../assets/face.png";
import Logout from "../assets/svgs/logout.svg";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { 
    assetData, 
    setAssetData, 
    previewSrc, 
    setPreviewSrc, 
    setOpen,
    createAsset 
  } = useContext(authContext);

  // Sidebar toggle state for small screens
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar dropdown
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Handle file selection (optional image/file preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewSrc(objectUrl);
    }
  };

  // Generic change handler for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Final form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const scaleArray = [
      parseFloat(assetData.scaleX) || 1,
      parseFloat(assetData.scaleY) || 1,
      parseFloat(assetData.scaleZ) || 1
    ];
    const rotationArray = [
      parseFloat(assetData.rotationX) || 0,
      parseFloat(assetData.rotationY) || 0,
      parseFloat(assetData.rotationZ) || 0
    ];

    const newAsset = {
      title: assetData.title,
      description: assetData.description,
      extendedDescription: assetData.extendedDescription,
      poly: assetData.poly,
      price: assetData.price,
      modelUrl: assetData.modelUrl,
      walkModelUrl: assetData.walkModelUrl,
      software: assetData.software,
      softwareLogo: assetData.softwareLogo,
      scale: scaleArray,
      rotation: rotationArray,
      technical: {
        objects: parseInt(assetData.objects) || 0,
        vertices: parseInt(assetData.vertices) || 0,
        edges: parseInt(assetData.edges) || 0,
        faces: parseInt(assetData.faces) || 0,
        triangles: parseInt(assetData.triangles) || 0
      }
    };

    createAsset(newAsset);
    setOpen(true);

    setAssetData({
      title: "",
      description: "",
      extendedDescription: "",
      poly: "",
      price: "",
      modelUrl: "",
      walkModelUrl: "",
      software: "",
      softwareLogo: "",
      scaleX: "",
      scaleY: "",
      scaleZ: "",
      rotationX: "",
      rotationY: "",
      rotationZ: "",
      objects: "",
      vertices: "",
      edges: "",
      faces: "",
      triangles: ""
    });
    setPreviewSrc("");
  };
  const navigate = useNavigate();
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
  return (
    <div className="min-h-screen bg-[#1d1e28] p-2 text-white relative">
      <div className="container  px-2 py-5">
        {/* Floating Sidebar Button for Mobile */}
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
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </div>
              )}

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Dialog title={assetData.title} description={assetData.description} />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-sm mt-1 text-[#5B5A99]">
              Add any type of asset in just a click
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

        {/* CARDS SECTION */}
        {/* <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="cursor-pointer hover:bg-gradient-to-r from-[#0B98C5] via-[#11AADF] to-[#14BAE3]
            border border-[#312F62] p-4 rounded-xl shadow-lg flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-200">New Assets Added</h2>
              <IoNewspaper className="text-yellow-400 text-2xl" />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">+2.5%</p>
              <p className="text-xs text-gray-400">3</p>
            </div>
          </div>
          <div className="cursor-pointer hover:bg-gradient-to-r from-[#0B98C5] via-[#11AADF] to-[#14BAE3]
            border border-[#312F62] p-4 rounded-xl shadow-lg flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-200">Total Assets Added</h2>
              <SiVirustotal className="text-blue-400 text-2xl" />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-red-400">+5%</p>
              <p className="text-xs text-gray-400">25</p>
            </div>
          </div>
          <div className="cursor-pointer hover:bg-gradient-to-r from-[#0B98C5] via-[#11AADF] to-[#14BAE3]
            border border-[#312F62] p-4 rounded-xl shadow-lg flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-200">Total Earning</h2>
              <FaWallet className="text-green-400 text-2xl" />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-green-400">+39.69%</p>
              <p className="text-xs text-gray-400">$95,000</p>
            </div>
          </div>
          <div className="cursor-pointer hover:bg-gradient-to-r from-[#0B98C5] via-[#11AADF] to-[#14BAE3]
            border border-[#312F62] p-4 rounded-xl shadow-lg flex flex-col justify-center">
            <h2 className="text-sm text-gray-200">Additional</h2>
            <p className="text-xs text-gray-400">Expand your portfolio</p>
          </div>
        </section> */}

        {/* 2-COLUMN LAYOUT FOR FORM & PREVIEW */}
        <section className="mt-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2b2e4a] p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Add Assets (Part 1)</h2>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2" htmlFor="assetName">
                  Asset Name
                </label>
                <input
                  className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                  type="text"
                  id="assetName"
                  name="title"
                  placeholder="Enter asset name"
                  value={assetData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2" htmlFor="assetDescription">
                  Asset Description
                </label>
                <textarea
                  className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                  id="assetDescription"
                  name="description"
                  placeholder="Enter asset description"
                  value={assetData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2" htmlFor="extendedDescription">
                  Extended Description
                </label>
                <textarea
                  className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                  id="extendedDescription"
                  name="extendedDescription"
                  placeholder="Enter extended description"
                  value={assetData.extendedDescription || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2" htmlFor="poly">
                  Poly Type (e.g. "Low Poly")
                </label>
                <input
                  className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                  type="text"
                  id="poly"
                  name="poly"
                  placeholder="Low Poly"
                  value={assetData.poly}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2" htmlFor="price">
                  Price
                </label>
                <input
                  className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                  type="text"
                  id="price"
                  name="price"
                  placeholder='e.g. "$75.00"'
                  value={assetData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="shadow-2xl drop-shadow-2xl border-2 border-dashed border-gray-500 rounded-xl h-64 w-full flex items-center justify-center">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="Asset Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <p className="text-gray-400">Image Preview</p>
                )}
              </div>
              <div className="bg-[#2b2e4a] p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Add Assets (Part 2)</h2>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2" htmlFor="modelUrl">
                    Model URL
                  </label>
                  <input
                    className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                    type="text"
                    id="modelUrl"
                    name="modelUrl"
                    placeholder="/3dfiles/campfire.glb"
                    value={assetData.modelUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2" htmlFor="walkModelUrl">
                    Walk Model URL
                  </label>
                  <input
                    className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                    type="text"
                    id="walkModelUrl"
                    name="walkModelUrl"
                    placeholder="/3dfiles/malezombiewalk.glb"
                    value={assetData.walkModelUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2" htmlFor="software">
                    Software
                  </label>
                  <input
                    className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                    type="text"
                    id="software"
                    name="software"
                    placeholder='e.g. "3ds Max"'
                    value={assetData.software}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2" htmlFor="softwareLogo">
                    Software Logo URL
                  </label>
                  <input
                    className="w-full p-2 rounded bg-[#1b1e33] text-white focus:outline-none"
                    type="text"
                    id="softwareLogo"
                    name="softwareLogo"
                    placeholder="/SoftwareLogo/new5.png"
                    value={assetData.softwareLogo}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1" htmlFor="scaleX">Scale X</label>
                    <input
                      type="number"
                      step="0.01"
                      id="scaleX"
                      name="scaleX"
                      placeholder="1"
                      value={assetData.scaleX || ""}
                      onChange={handleChange}
                      className="w-full p-1 rounded bg-[#1b1e33] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1" htmlFor="scaleY">Scale Y</label>
                    <input
                      type="number"
                      step="0.01"
                      id="scaleY"
                      name="scaleY"
                      placeholder="1"
                      value={assetData.scaleY || ""}
                      onChange={handleChange}
                      className="w-full p-1 rounded bg-[#1b1e33] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1" htmlFor="scaleZ">Scale Z</label>
                    <input
                      type="number"
                      step="0.01"
                      id="scaleZ"
                      name="scaleZ"
                      placeholder="1"
                      value={assetData.scaleZ || ""}
                      onChange={handleChange}
                      className="w-full p-1 rounded bg-[#1b1e33] text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1" htmlFor="rotationX">Rot X</label>
                    <input
                      type="number"
                      step="0.01"
                      id="rotationX"
                      name="rotationX"
                      placeholder="0"
                      value={assetData.rotationX || ""}
                      onChange={handleChange}
                      className="w-full p-1 rounded bg-[#1b1e33] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1" htmlFor="rotationY">Rot Y</label>
                    <input
                      type="number"
                      step="0.01"
                      id="rotationY"
                      name="rotationY"
                      placeholder="0"
                      value={assetData.rotationY || ""}
                      onChange={handleChange}
                      className="w-full p-1 rounded bg-[#1b1e33] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1" htmlFor="rotationZ">Rot Z</label>
                    <input
                      type="number"
                      step="0.01"
                      id="rotationZ"
                      name="rotationZ"
                      placeholder="0"
                      value={assetData.rotationZ || ""}
                      onChange={handleChange}
                      className="w-full p-1 rounded bg-[#1b1e33] text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2" htmlFor="assetFile">
                    Upload Asset File (Optional)
                  </label>
                  <input
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none bg-[#1b1e33] p-2 rounded"
                    type="file"
                    id="assetFile"
                    name="assetFile"
                    onChange={handleFileChange}
                  />
                </div>
                <h3 className="text-md font-bold text-white mb-2 mt-6">Technical (Required)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {["objects", "vertices", "edges", "faces", "triangles"].map(field => (
                    <div key={field}>
                      <label className="block text-gray-400 capitalize">{field}</label>
                      <input
                        type="text"
                        name={field}
                        placeholder="0"
                        value={assetData.technical?.[field] || ""}
                        onChange={handleChange}
                        className="w-full bg-[#1b1e33] text-white px-4 py-2 rounded-md border border-gray-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full px-6 py-2 text-white font-semibold rounded-full bg-gray-900 border-2 border-green-400 shadow-[0_0_10px_rgba(0,255,127,0.8)] hover:shadow-[0_0_20px_rgba(0,255,127,1)] transition-all duration-300 ease-in-out"
                >
                  Add Asset
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Home;
