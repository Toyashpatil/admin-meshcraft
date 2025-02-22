import React, { useState } from "react";
import { FaUserShield, FaUsersCog, FaEdit, FaSignOutAlt, FaCogs, FaTrash, FaCheck } from "react-icons/fa";
import ProfilePic from "../assets/Face.png";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "Admin Name",
    email: "admin@example.com",
    role: "Super Admin",
    bio: "Managing system users & ensuring security. Admin dashboard access.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempAdmin, setTempAdmin] = useState(admin);
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", role: "Moderator", email: "john@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
  ]);

  const handleEdit = () => {
    setAdmin(tempAdmin);
    setIsEditing(false);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-3xl bg-[#1b1e33] p-6 rounded-3xl shadow-lg text-white relative">
        
        {/* Profile Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={ProfilePic} alt="Admin" className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-lg object-cover" />
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={tempAdmin.name}
                  onChange={(e) => setTempAdmin({ ...tempAdmin, name: e.target.value })}
                  className="w-full text-xl font-bold bg-transparent border-b-2 border-gray-500 focus:border-purple-500 outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold">{admin.name}</h1>
              )}
              <p className="text-gray-400">{admin.email}</p>
              <span className="text-sm bg-purple-700 px-3 py-1 rounded-full font-bold">{admin.role}</span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition">
            <FaEdit />
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Bio Section */}
        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={tempAdmin.bio}
              onChange={(e) => setTempAdmin({ ...tempAdmin, bio: e.target.value })}
              className="w-full bg-transparent border-b-2 border-gray-500 focus:border-purple-500 outline-none p-2"
            />
          ) : (
            <p className="text-gray-300">{admin.bio}</p>
          )}

          {isEditing && (
            <button
              onClick={handleEdit}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:scale-105 transition-transform">
              <FaCheck /> Save Changes
            </button>
          )}
        </div>

        {/* User Management Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-purple-400">Manage Users</h2>
          <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-md">
            {users.length === 0 ? (
              <p className="text-gray-500 text-sm">No users found</p>
            ) : (
              <ul className="space-y-3">
                {users.map(user => (
                  <li key={user.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <span className="text-xs bg-blue-700 px-2 py-1 rounded">{user.role}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full">
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <button className="w-full py-3 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 justify-center">
            <FaUsersCog /> Manage Users
          </button>
          <button className="w-full py-3 cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 justify-center">
          <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Logout Button */}
        {/* <div className="mt-6 text-center">
          <button className="py-2 px-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center gap-2 mx-auto">
            <FaSignOutAlt /> Logout
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AdminProfile;
