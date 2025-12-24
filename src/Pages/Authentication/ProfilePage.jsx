import profile from "../../assets/pp.png";
import React, { useState } from "react";

const ProfilePage = () => {
  const [customer, setCustomer] = useState({
    avatar: "",
    name: "Satya",
    number: "9876543210",
    email: "satya@gmail.com",
  });

  const [editMode, setEditMode] = useState(false);
  const [tempCustomer, setTempCustomer] = useState(customer);
  const [errors, setErrors] = useState({});
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  // Validation for profile fields (logic unchanged)
  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value || value.length < 2) {
        error = "Name must be at least 2 characters.";
      }
    }

    if (name === "number") {
      if (!/^\d{10}$/.test(value)) {
        error = "Please enter valid mobile number.";
      }
    }

    if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
        error = "Please enter valid Email.";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempCustomer({ ...tempCustomer, [name]: value });

    // Real-time validation (logic unchanged)
    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  const validateProfile = () => {
    let newErrors = {};
    Object.keys(tempCustomer).forEach((field) => {
      const errorMsg = validateField(field, tempCustomer[field]);
      if (errorMsg) newErrors[field] = errorMsg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateProfile()) {
      setCustomer(tempCustomer);
      setEditMode(false);
      alert("Profile updated successfully!");
    } else {
      alert("Please fix the errors before saving.");
    }
  };

  const handleDiscard = () => {
    setTempCustomer(customer);
    setErrors({});
    setEditMode(false);
  };

  const handleLogout = () => {
    alert("Logged out!");
  };

  const handleAvatarUpdate = (option) => {
    alert(`Profile pic successfully uploaded from ${option}!`);
    setShowAvatarOptions(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-secondary bg-gradient-to-br from-secondary to-primaryDark text-textInverted">
      {/* Card — same style as Login/Signup */}
      <div className="w-full max-w-sm bg-bgCard/95 backdrop-blur-sm rounded-card shadow-lg p-6 sm:p-7 border border-borderDefault text-textPrimary">
        {/* Title */}
        <h2 className="mb-4 text-center font-bold text-2xl">Customer Profile</h2>

        {/* Avatar */}
        <img
          src={customer.avatar || profile}
          alt="Avatar"
          className="block w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-cyan-400 transition-transform duration-300 hover:scale-105"
        />

        {/* Update Profile Picture Button */}
        <button
          className="w-full py-2 px-3 rounded-md bg-primary text-textInverted hover:bg-primaryDark transition transform hover:scale-[1.02] mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          onClick={() => setShowAvatarOptions(!showAvatarOptions)}
        >
          Update Profile Picture
        </button>

        {/* Avatar Options */}
        {showAvatarOptions && (
          <div className="flex justify-center gap-2 mb-4">
            <button
              className="flex-1 py-2 px-3 rounded-md bg-success text-textInverted hover:bg-success/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
              onClick={() => handleAvatarUpdate("Camera")}
            >
              Upload from Camera
            </button>
            <button
              className="flex-1 py-2 px-3 rounded-md bg-borderStrong text-textInverted hover:bg-borderStrong/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
              onClick={() => handleAvatarUpdate("Gallery")}
            >
              Choose from Gallery
            </button>
          </div>
        )}

        {/* Name */}
        <label className="block text-left font-semibold text-textSecondary mt-2 mb-1">
          Name:
        </label>
        <input
          type="text"
          name="name"
          className="w-full mb-2 px-3 py-2 rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-bgMuted disabled:text-textMuted"
          value={tempCustomer.name}
          onChange={handleChange}
          disabled={!editMode}
        />
        {errors.name && (
          <p className="text-danger text-xs mb-2">{errors.name}</p>
        )}

        {/* Number */}
        <label className="block text-left font-semibold text-textSecondary mt-2 mb-1">
          Mobile Number:
        </label>
        <input
          type="text"
          name="number"
          className="w-full mb-2 px-3 py-2 rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-bgMuted disabled:text-textMuted"
          value={tempCustomer.number}
          onChange={handleChange}
          disabled={!editMode}
        />
        {errors.number && (
          <p className="text-danger text-xs mb-2">{errors.number}</p>
        )}

        {/* Email */}
        <label className="block text-left font-semibold text-textSecondary mt-2 mb-1">
          Email:
        </label>
        <input
          type="email"
          name="email"
          className="w-full mb-2 px-3 py-2 rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-bgMuted disabled:text-textMuted"
          value={tempCustomer.email}
          onChange={handleChange}
          disabled={!editMode}
        />
        {errors.email && (
          <p className="text-danger text-xs mb-2">{errors.email}</p>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {editMode ? (
            <>
              <button
                className="flex-1 py-2 px-3 rounded-md bg-success text-textInverted hover:bg-success/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="flex-1 py-2 px-3 rounded-md bg-borderStrong text-textInverted hover:bg-borderStrong/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </>
          ) : (
            <button
              className="flex-1 py-2 px-3 rounded-md bg-primary text-textInverted hover:bg-primaryDark transition transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}

          <button
            className="flex-1 py-2 px-3 rounded-md bg-danger text-textInverted hover:bg-danger/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
