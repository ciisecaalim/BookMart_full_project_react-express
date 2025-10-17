import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router";

function AdminProfile() {
  const [admin, setAdmin] = useState({ name: "", email: "", avatar: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/profile/public");
        setAdmin(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.response?.data?.error || "Failed to fetch profile", "error");
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => setAdmin({ ...admin, [e.target.name]: e.target.value });
  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
    setRemoveAvatar(false);
  };
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setRemoveAvatar(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", admin.name);
      formData.append("email", admin.email);
      if (avatarFile) formData.append("avatar", avatarFile);
      else if (removeAvatar) formData.append("removeAvatar", "true");

      const res = await axios.put("http://localhost:3000/api/admin/profile/public", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAdmin(res.data);
      setAvatarFile(null);
      setRemoveAvatar(false);

      localStorage.setItem("adminData", JSON.stringify(res.data));
      window.dispatchEvent(new Event("adminDataUpdated"));

      Swal.fire({ icon: "success", title: "Updated!", timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.error || "Could not update profile" });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Admin Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full mb-2 bg-white overflow-hidden flex items-center justify-center border border-gray-300">
            {avatarFile ? (
              <img src={URL.createObjectURL(avatarFile)} alt="Avatar" className="w-full h-full object-cover" />
            ) : admin.avatar ? (
              <img src={`http://localhost:3000${admin.avatar}?t=${Date.now()}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">No Avatar</span>
            )}
          </div>
          <input type="file" onChange={handleAvatarChange} className="text-sm mt-2" />
          {(admin.avatar || avatarFile) && !removeAvatar && (
            <button type="button" onClick={handleRemoveAvatar} className="mt-2 text-red-500 text-sm hover:underline">
              Remove Avatar
            </button>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Name</label>
          <input type="text" name="name" value={admin.name} onChange={handleChange} className="w-full border p-2 rounded mt-1" required />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input type="email" name="email" value={admin.email} onChange={handleChange} className="w-full border p-2 rounded mt-1" required />
        </div>

        <Link to="/dash"> <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition">
          Update Profile
        </button></Link>
      </form>
    </div>
  );
}

export default AdminProfile;
