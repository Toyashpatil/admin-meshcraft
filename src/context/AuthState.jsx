import React, { useState, useEffect } from 'react';
import authContext from './authContext';

const AuthState = (props) => {
  // Sidebar & modal states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [open, setOpen] = useState(false);

  // Form data for creating/updating an asset
  // Updated walkModelUrl to walkModelUrls (array)
  const [assetData, setAssetData] = useState({
    title: "",
    description: "",
    poly: "",
    price: "",
    modelUrl: "",
    walkModelUrls: [], // <-- use an array
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

  // Store all assets in state
  const [editAssetData, setEditAssetData] = useState([]);

  // Base URL for the API
  // NOTE: If your server routes are defined as /assets, you might use "http://localhost:5000" as your BASE_URL
  // and then add "/assets" on each request. Adjust if needed.
  const BASE_URL = "http://localhost:5000/assets";

  // ───────────────────────────────────────────────────────────
  //  1) CREATE an asset
  // ───────────────────────────────────────────────────────────
  const createAsset = async (newAsset) => {
    try {
      const response = await fetch(`${BASE_URL}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAsset),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Create asset error:", errorData.message);
        return;
      }

      const data = await response.json();
      console.log("Asset created successfully:", data);

      // Update local state
      setEditAssetData((prevAssets) => [...prevAssets, data.asset]);
    } catch (error) {
      console.error("Server error while creating asset:", error);
    }
  };

  // ───────────────────────────────────────────────────────────
  //  2) READ (GET) all assets
  // ───────────────────────────────────────────────────────────
  const getAssets = async () => {
    try {
      const response = await fetch(`${BASE_URL}/assets`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Fetch assets error:", errorData.message);
        return;
      }

      const data = await response.json();
      console.log("Fetched assets:", data.assets);
      setEditAssetData(data.assets);
    } catch (error) {
      console.error("Server error while fetching assets:", error);
    }
  };

  // ───────────────────────────────────────────────────────────
  //  3) UPDATE an asset
  // ───────────────────────────────────────────────────────────
  const updateAsset = async (id, updatedAsset) => {
    try {
      const response = await fetch(`${BASE_URL}/assets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAsset),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update asset error:", errorData.message);
        return;
      }

      const data = await response.json();
      console.log("Asset updated successfully:", data.asset);

      // Update local state
      setEditAssetData((prevAssets) =>
        prevAssets.map((asset) =>
          asset._id === id ? data.asset : asset
        )
      );
    } catch (error) {
      console.error("Server error while updating asset:", error);
    }
  };

  // ───────────────────────────────────────────────────────────
  //  4) DELETE an asset
  // ───────────────────────────────────────────────────────────
  const deleteAsset = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/assets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Delete asset error:", errorData.message);
        return;
      }

      const data = await response.json();
      console.log(data.message); // "3D asset deleted successfully"

      // Remove the asset from local state
      setEditAssetData((prevAssets) =>
        prevAssets.filter((asset) => asset._id !== id)
      );
    } catch (error) {
      console.error("Server error while deleting asset:", error);
    }
  };

  // ───────────────────────────────────────────────────────────
  //  5) (Optional) Health check
  // ───────────────────────────────────────────────────────────
  const getHealth = async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (!response.ok) {
        console.error("Health check failed.");
        return;
      }

      const text = await response.text();
      console.log("Health check:", text); // Should log "Hello"
    } catch (error) {
      console.error("Server error on health check:", error);
    }
  };

  // Fetch assets on initial mount
  useEffect(() => {
    getAssets();
  }, []);

  return (
    <authContext.Provider
      value={{
        // States
        isSidebarOpen,
        setIsSidebarOpen,
        open,
        setOpen,
        assetData,
        setAssetData,
        previewSrc,
        setPreviewSrc,
        editAssetData,
        setEditAssetData,

        // CRUD Functions
        createAsset,
        getAssets,
        updateAsset,
        deleteAsset,

        // Optional
        getHealth,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};

export default AuthState;
