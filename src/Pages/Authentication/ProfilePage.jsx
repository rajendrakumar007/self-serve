
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pp from "../../assets/pp.png";

import {
  getCurrentUser,
  isLoggedIn,
  updateUserById,
  setCurrentUser,
  logout,
  findUserByEmail,
  findUserByContact,
} from "../../utils/auth";

const emptyProfile = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  // Stored (decoded) password only for display/comparison; NOT saved to local profile
  password: "",
  // Change password fields (transient)
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const loadProfile = () => getCurrentUser() || { ...emptyProfile };

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
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [revealStoredPassword, setRevealStoredPassword] = useState(false); // (no UI rendered for stored password anymore)

  useEffect(() => {
    const handleStorage = () =>
      setForm({
        ...loadProfile(),
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Hydrate with server-side user (to fetch id/address/gender/password)
    (async () => {
      const local = getCurrentUser();
      if (!local?.email) return;

      try {
        const serverUser = await findUserByEmail(local.email);
        if (serverUser) {
          const decodedPwd = serverUser.password
            ? typeof window !== "undefined"
              ? window.atob(serverUser.password)
              : Buffer.from(serverUser.password, "base64").toString()
            : "";

          const name = [serverUser.firstName, serverUser.middleName, serverUser.lastName]
            .filter(Boolean)
            .join(" ");

          setForm((prev) => ({
            ...prev,
            id: serverUser.id ?? "",
            name,
            email: serverUser.email || "",
            phone: serverUser.contact || "",
            address: serverUser.address || "",
            gender: serverUser.gender || "",
            password: decodedPwd || "", // kept in state for verification logic only
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }));
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openPicOptions = () => setShowPicOptions(true);

  const choosePicOption = (type) => {
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

    // Basic validations
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

    // Change Password validations (only if user is attempting to change)
    const wantsPasswordChange =
      (form.currentPassword?.length || 0) > 0 ||
      (form.newPassword?.length || 0) > 0 ||
      (form.confirmNewPassword?.length || 0) > 0;

    if (wantsPasswordChange) {
      if (!form.currentPassword) {
        setError("Please enter your current password.");
        return;
      }
      // Verify current password against the stored (decoded) one
      // NOTE: If you switch to server-side hashing, do this verification server-side.
      if (form.currentPassword !== form.password) {
        setError("Current password is incorrect.");
        return;
      }
      if (!form.newPassword || !form.confirmNewPassword) {
        setError("Please enter and confirm your new password.");
        return;
      }
      if (form.newPassword !== form.confirmNewPassword) {
        setError("New password and confirmation do not match.");
        return;
      }
      if (form.newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        return;
      }
    }

    setSaving(true);

    const parts = form.name.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
    const middleName = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

    (async () => {
      try {
        const normalizedEmail = form.email.trim().toLowerCase();

        // Uniqueness checks (exclude current id)
        const existingEmailUser = await findUserByEmail(normalizedEmail);
        if (existingEmailUser && existingEmailUser.id !== form.id) {
          setSaving(false);
          setError("Email already registered to another user.");
          return;
        }

        const existingContactUser = await findUserByContact(form.phone);
        if (existingContactUser && existingContactUser.id !== form.id) {
          setSaving(false);
          setError("Mobile number already in use by another user.");
          return;
        }

        const updates = {
          firstName,
          middleName,
          lastName,
          contact: form.phone,
          email: normalizedEmail,
          address: form.address?.trim() ?? "",
          gender: form.gender ?? "",
          // Include password only if user requested a change.
          ...(wantsPasswordChange ? { password: form.newPassword } : {}),
        };

        const res = await updateUserById(form.id, updates);
        if (!res.ok) {
          setSaving(false);
          setError(res.message || "Unable to save profile");
          return;
        }

        // Update local profile (no password stored locally)
        setCurrentUser({
          id: form.id,
          firstName,
          middleName,
          lastName,
          email: normalizedEmail,
          contact: form.phone,
          address: form.address?.trim() ?? "",
          gender: form.gender ?? "",
        });

        // If password changed, update the transient UI state and stored password display.
        let newStoredPassword = form.password;
        if (wantsPasswordChange) {
          newStoredPassword = form.newPassword; // display updated stored value (decoded; your utils encode when persisting)
        }

        setForm((prev) => ({
          ...prev,
          password: newStoredPassword,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));

        setSaving(false);
        setSuccess("Profile saved successfully.");
      } catch (err) {
        console.error(err);
        setSaving(false);
        setError("Unable to save profile");
      }
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
              <h2 className="text-2xl font-bold text-textPrimary">
                {form?.name && form.name.trim() ? `Hi ${form.name.split(" ")[0]}` : "Your Profile"}
              </h2>
            </div>
            <div className="mt-2">
              <button
                onClick={openPicOptions}
                className="px-3 py-1 rounded-md bg-accent text-textInverted text-sm hover:opacity-90"
              >
                Change Profile Pic
              </button>
              {showPicOptions && (
                <div className="mt-3 grid gap-2">
                  <button
                    onClick={() => choosePicOption("gallery")}
                    className="py-2 rounded-md bg-primary text-textInverted hover:bg-primaryDark transition"
                  >
                    From Gallery
                  </button>
                  <button
                    onClick={() => choosePicOption("camera")}
                    className="py-2 rounded-md bg-primary text-textInverted hover:bg-primaryDark transition"
                  >
                    From Camera
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* small action popup */}
        {showPicAction && (
          <div className="mb-3 p-3 rounded-md bg-primary text-textInverted text-sm">
            {picActionType === "gallery" ? "Open Gallery" : "Open Camera"}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-4">
          {/* Non-editable ID
          <div>
            <label className="block text-sm mb-1 text-textMuted">Customer ID</label>
            <input
              type="text"
              name="id"
              value={form.id ?? ""}
              readOnly
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted/60 text-textPrimary border border-borderDefault outline-none cursor-not-allowed"
            />
          </div> */}

          {/* Name */}
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

          {/* Email */}
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

          {/* Mobile */}
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
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm mb-1 text-textMuted">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Your current address"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm mb-1 text-textMuted">Gender</label>
            <select
              name="gender"
              value={form.gender || ""}
              onChange={onChange}
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Transgender">Transgender</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Change Password Section (kept) */}
          <div className="mt-4 border border-borderDefault rounded-md p-4 bg-bgMuted/40">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold text-textPrimary">Change Password</h3>
              <button
                type="button"
                onClick={() => setShowPasswordInputs((s) => !s)}
                className="text-sm px-3 py-1 rounded-md bg-bgCard border border-borderDefault text-textPrimary hover:bg-bgHover"
              >
                {showPasswordInputs ? "Collapse" : "Expand"}
              </button>
            </div>

            {showPasswordInputs && (
              <div className="space-y-3">
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword || ""}
                  onChange={onChange}
                  className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Current password"
                  autoComplete="current-password"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword || ""}
                  onChange={onChange}
                  className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="New password"
                  autoComplete="new-password"
                />

                <input
                  type="password"
                  name="confirmNewPassword"
                  value={form.confirmNewPassword || ""}
                  onChange={onChange}
                  className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted text-textPrimary placeholder:text-textMuted border border-borderDefault outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </div>
            )}
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
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-md bg-accent text-textInverted hover:opacity-90"
          >
            Back to Home
          </button>
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