// context/AuthState.jsx
import React, { useState, useEffect } from 'react';
import authContext from './authContext';

// This AuthState manages both an array of assets (editAssetData)
// and a single "current" asset (assetData) for editing, including the thumbnail.

const AuthState = (props) => {
  // Basic UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [open, setOpen] = useState(false);

  // The array of all assets
  // After fetching, each asset in this array will have .image and .thumbnailId if a thumbnail doc is found
  const [editAssetData, setEditAssetData] = useState([]);

  // The array of all thumbnail docs
  const [thumbnails, setThumbnails] = useState([]);

  // A SINGLE asset for the "current" editing session
  // If you only want to edit one asset at a time, you can store it here,
  // including .thumbnailId and .thumbnailPreview
  const [assetData, setAssetData] = useState({
    _id: '',
    title: '',
    description: '',
    extendedDescription: '',
    poly: '',
    price: '',
    modelUrl: '',
    walkModelUrls: [],
    software: '',
    softwareLogo: '',
    scaleX: '',
    scaleY: '',
    scaleZ: '',
    rotationX: '',
    rotationY: '',
    rotationZ: '',
    objects: '',
    vertices: '',
    edges: '',
    faces: '',
    triangles: '',
    // For thumbnail
    thumbnailId: null,
    thumbnailPreview: '', // /thumbnail/view/<docId>
  });

  // ------------------------------------------------
  // Base URLs
  // ------------------------------------------------
  const BASE_ASSETS_URL = 'http://localhost:5000/assets'; // For assets
  const THUMB_URL       = 'http://localhost:5000/thumbnail'; // For thumbnail ops

  // ─────────────────────────────────────────────────────────
  // FETCH All Assets (array)
  // ─────────────────────────────────────────────────────────
  const getAssets = async () => {
    try {
      const res = await fetch(`${BASE_ASSETS_URL}/assets`);
      if (!res.ok) {
        const errData = await res.json();
        console.error('Error fetching assets:', errData.message);
        return [];
      }
      const data = await res.json();
      return data.assets || [];
    } catch (error) {
      console.error('Error fetching assets:', error);
      return [];
    }
  };

  // ─────────────────────────────────────────────────────────
  // FETCH All Thumbnails (array)
  // ─────────────────────────────────────────────────────────
  const getThumbnails = async () => {
    try {
      const res = await fetch(THUMB_URL);
      if (!res.ok) {
        console.error('Error fetching thumbnails');
        return [];
      }
      const data = await res.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching thumbnails:', error);
      return [];
    }
  };

  // ─────────────────────────────────────────────────────────
  // MERGE fetched assets + thumbs => set editAssetData
  // ─────────────────────────────────────────────────────────
  const loadAllData = async () => {
    const assetsArray = await getAssets();
    const thumbsArray = await getThumbnails();

    // For each asset, see if there's a matching thumbnail doc
    const merged = assetsArray.map((asset) => {
      const thumbDoc = thumbsArray.find((t) => t.assetId === asset._id);
      if (thumbDoc) {
        return {
          ...asset,
          image: `${THUMB_URL}/view/${thumbDoc._id}`, // preview URL
          thumbnailId: thumbDoc._id,
        };
      }
      return {
        ...asset,
        image: null,
        thumbnailId: null,
      };
    });

    setEditAssetData(merged);
    setThumbnails(thumbsArray);
  };

  // ─────────────────────────────────────────────────────────
  // CREATE an asset
  // ─────────────────────────────────────────────────────────
  const createAsset = async (newAsset) => {
    try {
      const res = await fetch(`${BASE_ASSETS_URL}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset),
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Create asset error:', errData.message);
        return null;
      }
      const data = await res.json();
      console.log('Asset created:', data.asset);

      // Add to our array, no thumbnail yet
      setEditAssetData((prev) => [
        ...prev,
        { ...data.asset, image: null, thumbnailId: null },
      ]);
      return data.asset;
    } catch (err) {
      console.error('Error creating asset:', err);
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // READ one asset by ID + find its thumbnail => set assetData
  // ─────────────────────────────────────────────────────────
  const loadAssetById = async (assetId) => {
    try {
      // We might have a single-asset GET route, or just filter from editAssetData
      // For demonstration, let's do it from the array if we already loaded them:
      // If not found, fallback to a direct fetch
      let found = editAssetData.find((a) => a._id === assetId);

      if (!found) {
        // fallback: fetch from the server
        const url = `${BASE_ASSETS_URL}/assets`; // or /assets/:id if you have it
        const all = await getAssets();
        found = all.find((a) => a._id === assetId);
        if (!found) {
          console.error('No asset found in DB with that ID');
          return;
        }
      }

      // If found has .image or .thumbnailId if we already merged it
      // but if not, let's find a thumbnail doc
      let thumbDoc = null;
      if (!found.thumbnailId) {
        // we haven't merged or we never called loadAllData
        const allThumbs = await getThumbnails();
        thumbDoc = allThumbs.find((t) => t.assetId === assetId);
      } else {
        // we have a reference in found already
        thumbDoc = thumbnails.find((t) => t._id === found.thumbnailId);
      }

      let thumbnailId = null;
      let thumbnailPreview = '';
      if (thumbDoc) {
        thumbnailId = thumbDoc._id;
        thumbnailPreview = `${THUMB_URL}/view/${thumbDoc._id}`;
      }

      // Merge into local single-asset state
      setAssetData({
        ...found, // copy over fields
        thumbnailId,
        thumbnailPreview,
      });
    } catch (error) {
      console.error('Error loading single asset:', error);
    }
  };

  // ─────────────────────────────────────────────────────────
  // UPDATE an asset
  // ─────────────────────────────────────────────────────────
  const updateAsset = async (assetId, updatedFields) => {
    try {
      const res = await fetch(`${BASE_ASSETS_URL}/assets/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Update asset error:', errData.message);
        return null;
      }
      const data = await res.json();
      console.log('Asset updated:', data.asset);

      // Update the array
      setEditAssetData((prev) =>
        prev.map((asset) =>
          asset._id === assetId ? { ...asset, ...data.asset } : asset
        )
      );

      // If we are editing that same asset in assetData, update it too
      setAssetData((prev) => {
        if (prev._id === assetId) {
          return { ...prev, ...data.asset };
        }
        return prev;
      });
      return data.asset;
    } catch (error) {
      console.error('Error updating asset:', error);
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // DELETE an asset
  // ─────────────────────────────────────────────────────────
  const deleteAsset = async (assetId) => {
    try {
      const res = await fetch(`${BASE_ASSETS_URL}/assets/${assetId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Delete asset error:', errData.message);
        return;
      }
      const data = await res.json();
      console.log(data.message);

      // Remove from array
      setEditAssetData((prev) => prev.filter((a) => a._id !== assetId));

      // If assetData is that one, clear it
      setAssetData((prev) => {
        if (prev._id === assetId) {
          return {
            title: '',
            description: '',
            poly: '',
            // etc... reset
          };
        }
        return prev;
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  // ─────────────────────────────────────────────────────────
  // UPLOAD a new thumbnail doc (POST)
  // ─────────────────────────────────────────────────────────
  const uploadThumbnail = async (assetId, file) => {
    try {
      const formData = new FormData();
      formData.append('assetId', assetId);
      formData.append('imageFile', file);

      const res = await fetch(THUMB_URL, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Error uploading thumbnail:', errData.error);
        return null;
      }
      const data = await res.json();
      console.log('Thumbnail created:', data.thumbnail);

      // Update local thumbnails
      setThumbnails((prev) => [...prev, data.thumbnail]);

      // Update the array
      setEditAssetData((prev) =>
        prev.map((a) => {
          if (a._id === assetId) {
            return {
              ...a,
              image: `${THUMB_URL}/view/${data.thumbnail._id}`,
              thumbnailId: data.thumbnail._id,
            };
          }
          return a;
        })
      );

      // If our single asset is this one, update assetData
      setAssetData((prev) => {
        if (prev._id === assetId) {
          return {
            ...prev,
            thumbnailId: data.thumbnail._id,
            thumbnailPreview: `${THUMB_URL}/view/${data.thumbnail._id}`,
          };
        }
        return prev;
      });

      return data.thumbnail;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // EDIT (replace) the existing thumbnail doc's file (PUT)
  // ─────────────────────────────────────────────────────────
  const editThumbnail = async (thumbId, file) => {
    try {
      const formData = new FormData();
      formData.append('imageFile', file);

      const res = await fetch(`${THUMB_URL}/${thumbId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Error editing thumbnail:', errData.error);
        return null;
      }
      const data = await res.json();
      console.log('Thumbnail replaced:', data.thumbnail);

      // Update the local thumbnails array
      setThumbnails((prev) =>
        prev.map((t) => (t._id === thumbId ? data.thumbnail : t))
      );

      // Also find the asset referencing data.thumbnail.assetId
      // and update it in editAssetData
      setEditAssetData((prev) => {
        return prev.map((a) => {
          if (a._id === data.thumbnail.assetId) {
            return {
              ...a,
              image: `${THUMB_URL}/view/${data.thumbnail._id}`,
              thumbnailId: data.thumbnail._id,
            };
          }
          return a;
        });
      });

      // If our single asset is the one referencing that thumbnail, update it
      setAssetData((prev) => {
        if (prev._id === data.thumbnail.assetId) {
          return {
            ...prev,
            thumbnailId: data.thumbnail._id,
            thumbnailPreview: `${THUMB_URL}/view/${data.thumbnail._id}`,
          };
        }
        return prev;
      });

      return data.thumbnail;
    } catch (error) {
      console.error('Error editing thumbnail:', error);
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // DELETE thumbnail doc
  // ─────────────────────────────────────────────────────────
  const deleteThumbnail = async (thumbId) => {
    try {
      const res = await fetch(`${THUMB_URL}/${thumbId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        console.error('Error deleting thumbnail');
        return;
      }
      // Remove from local state
      setThumbnails((prev) => prev.filter((t) => t._id !== thumbId));

      // Also remove from the array
      setEditAssetData((prev) =>
        prev.map((a) => {
          if (a.thumbnailId === thumbId) {
            return { ...a, image: null, thumbnailId: null };
          }
          return a;
        })
      );

      // If our single asset is referencing that ID, clear it
      setAssetData((prev) => {
        if (prev.thumbnailId === thumbId) {
          return { ...prev, thumbnailId: null, thumbnailPreview: '' };
        }
        return prev;
      });

      console.log('Thumbnail doc deleted successfully');
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
    }
  };

  // ─────────────────────────────────────────────────────────
  // On mount, load everything into the array
  // If you only need a single asset, you can skip calling loadAllData
  // and just call loadAssetById from your EditDetails screen.
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line
  }, []);

  return (
    <authContext.Provider
      value={{
        // UI states
        isSidebarOpen,
        setIsSidebarOpen,
        open,
        setOpen,
        previewSrc,
        setPreviewSrc,

        // The array of all assets + their .image, .thumbnailId
        editAssetData,
        setEditAssetData,

        // The array of all thumbnail docs
        thumbnails,
        setThumbnails,

        // Single "current" asset data with .thumbnailPreview
        assetData,
        setAssetData,

        // Asset CRUD
        createAsset,
        updateAsset,
        deleteAsset,

        // Thumbnail ops
        uploadThumbnail,
        editThumbnail,
        deleteThumbnail,

        // Utility
        loadAllData,
        loadAssetById,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};

export default AuthState;
