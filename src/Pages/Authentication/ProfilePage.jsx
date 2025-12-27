
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, isLoggedIn, updateUserProfile, setCurrentUser, logout } from "../../utils/auth";
import pp from "../../assets/pp.png";

const loadProfile = () => getCurrentUser() || { name: "", email: "", phone: "" };

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

export default function Profile() {
  const [form, setForm] = useState(loadProfile());
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPicOptions, setShowPicOptions] = useState(false);
  const [showPicAction, setShowPicAction] = useState(false);
  const [picActionType, setPicActionType] = useState("");

  useEffect(() => {
    // In case profile was updated elsewhere
    const handleStorage = () => setForm(loadProfile());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openPicOptions = () => setShowPicOptions(true);

  const choosePicOption = (type) => {
    // close options and show a small action popup (demo-only)
    setShowPicOptions(false);
    setPicActionType(type);
    setShowPicAction(true);
    setTimeout(() => setShowPicAction(false), 2000);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/\D/g, "") : value,
    }));
  };

  const onSave = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!form.email.trim() || !validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.phone.trim() || !validatePhone(form.phone)) {
      setError("Mobile must be exactly 10 digits.");
      return;
    }

    setSaving(true);

    // Build name parts
    const parts = form.name.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
    const middleName = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

    // Attempt to update server/local users
    (async () => {
      const res = await updateUserProfile(form.email.trim().toLowerCase(), {
        firstName,
        middleName,
        lastName,
        contact: form.phone,
        email: form.email.trim().toLowerCase(),
      });

      if (!res.ok) {
        setSaving(false);
        setError(res.message || "Unable to save profile");
        return;
      }

      // Update stored profile shown to user
      setCurrentUser({ firstName, middleName, lastName, email: form.email.trim().toLowerCase(), contact: form.phone });
      setSaving(false);
      setSuccess("Profile saved successfully.");
    })();
  };

  return (
    <div className="min-h-screen bg-secondary bg-gradient-to-br from-secondary to-primaryDark text-textInverted flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-bgCard/95 backdrop-blur-sm rounded-card shadow-lg p-6 sm:p-8 border border-borderDefault">
        {/* Avatar + title */}
        <div className="flex items-center gap-4 mb-5">
          <img src={pp} alt="avatar" className="w-16 h-16 rounded-full bg-bgMuted object-cover" />
          <div className="flex-1">
            <div className="flex items-baseline gap-3">
              {/* Show greeting with first name when available, otherwise fallback to 'Your Profile' */}
              <h2 className="text-2xl font-bold text-textPrimary">
                {form?.name && form.name.trim() ? `Hi ${form.name.split(" ")[0]}` : "Your Profile"}
              </h2>
            </div>
            <div className="mt-2">
              <button onClick={openPicOptions} className="px-3 py-1 rounded-md bg-accent text-textInverted text-sm hover:opacity-90">Change Profile Pic</button>
              {showPicOptions && (
                <div className="mt-3 grid gap-2">
                  <button onClick={() => choosePicOption('gallery')} className="py-2 rounded-md bg-bgCard border border-borderDefault hover:bg-bgHover">From Gallery</button>
                  <button onClick={() => choosePicOption('camera')} className="py-2 rounded-md bg-bgCard border border-borderDefault hover:bg-bgHover">From Camera</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* small action popup when choosing gallery/camera */}
        {showPicAction && (
          <div className="mb-3 p-3 rounded-md bg-primary text-textInverted text-sm">
            {picActionType === 'gallery' ? 'Open Gallery' : 'Open Camera'}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-textMuted">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-textMuted">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-textMuted">Mobile</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              maxLength={10}
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="10-digit mobile number"
            />
            <small className="text-textMuted text-xs">Must be 10 digits</small>
          </div>

          {error && <p className="text-danger text-sm text-center">{error}</p>}
          {success && <p className="text-success text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 px-4 py-3 text-base rounded-md bg-primary text-textInverted transition hover:bg-primaryDark hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>

        <div className="mt-5 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-md bg-accent text-textInverted hover:opacity-90">Back to Home</button>

          <button
            onClick={handleLogout}
            className="text-sm bg-danger/90 text-textInverted px-3 py-2 rounded-md hover:bg-danger transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
