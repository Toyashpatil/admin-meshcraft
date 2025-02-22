// src/pages/DeleteAsset.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';

const DeleteAsset = () => {
  // Destructure what you need from context
  const { editAssetData, deleteAsset } = useContext(authContext);
  const navigate = useNavigate();

  // Handler that calls the context's delete function
  const handleDelete = async (assetId) => {
    // Call your deleteAsset function in AuthState, which will:
    //  1) Send a DELETE request to the server
    //  2) Remove the asset from local state
    await deleteAsset(assetId);

    // Optionally navigate somewhere after deletion
    localStorage.setItem("activeBtn","editassets")
    navigate('/editassets');
  };

  // If your database uses `_id`, update references from asset.id => asset._id
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white">Delete Asset</h1>
      <p className="text-sm mt-1 text-[#5B5A99]">
        Remove assets from your collection.
      </p>

      {/* Asset List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editAssetData.map((asset) => (
          <div
            key={asset._id} // or asset.id if your data truly uses 'id'
            className="bg-[#2b2e4a] p-4 rounded-lg shadow-lg text-white"
          >
            {/* If you store an image URL in asset.image */}
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
              onClick={() => handleDelete(asset._id)} // or asset.id
              className="mt-4 w-full py-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg text-sm font-semibold hover:scale-105 transition-all"
            >
              Delete Asset
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeleteAsset;
