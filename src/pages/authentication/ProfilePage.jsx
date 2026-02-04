
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
} from "../../utils/auth/auth";
import Navbar from "../../components/common/Navbar";

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
  const [showPicAction, setShowPicAction] = useState(false);
  const [picActionType, setPicActionType] = useState("");
 
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

    // Change Password (kept as-is; no inputs in this UI, so it won't trigger)
    const wantsPasswordChange =
      (form.currentPassword?.length || 0) > 0 ||
      (form.newPassword?.length || 0) > 0 ||
      (form.confirmNewPassword?.length || 0) > 0;

    if (wantsPasswordChange) {
      if (!form.currentPassword) {
        setError("Please enter your current password.");
        return;
      }
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
          address: form.address?.trim() ?? "", // kept (hidden from UI)
          gender: form.gender ?? "", // kept (hidden from UI)
          ...(wantsPasswordChange ? { password: form.newPassword } : {}),
        };

        const res = await updateUserById(form.id, updates);
        if (!res.ok) {
          setSaving(false);
          setError(res.message || "Unable to save profile");
          return;
        }

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

        let newStoredPassword = form.password;
        if (wantsPasswordChange) {
          newStoredPassword = form.newPassword;
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
    <>
   
    <Navbar/>

<div className="min-h-screen w-full bg-bgBase dark:bg-secondary text-textPrimary dark:text-textInverted flex items-center justify-center p-6">
  {/* Wide shell */}
  <div className="w-full max-w-6xl bg-bgCard/80 dark:bg-secondary/80 backdrop-blur-sm rounded-xl shadow-lg border border-borderDefault dark:border-borderStrong overflow-hidden">
    {/* Header / Hero */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 px-6 md:px-10 py-8 bg-bgCard dark:bg-secondary">
      <img
        src={pp}
        alt="avatar"
        className="w-24 h-24 rounded-full bg-bgMuted dark:bg-secondary object-cover ring-4 ring-bgCard dark:ring-secondary shadow-md"
      />
      <div className="flex-1 w-full">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-textPrimary dark:text-textInverted">
            {form?.name && form.name.trim() ? `Hi ${form.name.split(" ")[0]}` : "Your Profile"}
          </h1>
        </div>

        {showPicAction && (
          <div className="mt-3 p-3 rounded-md bg-successGradient dark:text-textInverted text-sm inline-block">
            {picActionType === "gallery" ? "Open Gallery" : "Open Camera"}
          </div>
        )}
      </div>
    </div>

    {/* Content grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-6 md:p-10">
      {/* Left: Form card (span 2) */}
      <div className="md:col-span-2 bg-bgCard dark:bg-secondary rounded-xl border border-borderDefault dark:border-borderStrong shadow-sm">
        <div className="px-5 py-5 border-b border-borderDefault dark:border-borderStrong">
          <h2 className="text-xl font-semibold text-textPrimary dark:text-textInverted">Account Details</h2>
          <p className="text-sm text-textMuted dark:text-textInverted mt-1">
            Update your contact information below.
          </p>
        </div>

        <form onSubmit={onSave} className="p-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1 text-textMuted dark:text-textInverted">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email (only here) */}
          <div>
            <label className="block text-sm mb-1 text-textMuted dark:text-textInverted">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight disabled:cursor-not-allowed"
              placeholder="Enter your email"
              disabled

            />
          </div>

          {/* Mobile (only here) */}
          <div>
            <label className="block text-sm mb-1 text-textMuted dark:text-textInverted">Mobile</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              maxLength={10}
              className="w-full px-4 py-3 text-sm rounded-md bg-bgMuted dark:bg-secondary/70 text-textPrimary dark:text-textInverted placeholder:text-textMuted dark:placeholder:text-textSecondary border border-borderDefault dark:border-borderStrong outline-none focus:ring-2 focus:ring-primaryLight focus:border-primaryLight"
              placeholder="10-digit mobile number"
            />
          </div>

          {/* Save + status */}
          {error && <p className="text-danger dark:text-textInverted text-sm text-center">{error}</p>}
          {success && <p className="text-success dark:text-textInverted text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 px-4 py-3 text-textInverted rounded-md bg-primary dark:text-textInverted transition hover:bg-primaryDark hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>

      {/* Right: Snapshot & Security (no duplicates) */}
      <div className="space-y-6">
        {/* Snapshot: only non-form data */}
        <div className="bg-bgCard dark:bg-secondary rounded-xl border border-borderDefault dark:border-borderStrong shadow-sm p-5">
          <h3 className="text-base font-semibold text-textPrimary dark:text-textInverted mb-4">Account Snapshot</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-borderDefault dark:border-borderStrong p-4 bg-bgMuted dark:bg-secondary/60">
              <div className="text-xs text-textMuted dark:text-textInverted">Customer ID</div>
              <div className="text-sm font-semibold text-textPrimary dark:text-textInverted">{form.userId || "—"}</div>
            </div>
            <div className="rounded-lg border border-borderDefault dark:border-borderStrong p-4 bg-successBg dark:bg-success/10">
              <div className="text-xs text-textMuted dark:text-textInverted">Status</div>
              <div className="text-sm font-semibold text-success ">Active</div>
            </div>
          </div>
        </div>

        {/* Security: single reset password action */}
        <div className="bg-bgCard dark:bg-secondary rounded-xl border border-borderDefault dark:border-borderStrong shadow-sm p-5">
          <h3 className="text-base font-semibold text-textPrimary dark:text-textInverted mb-2">Security</h3>
          <p className="text-sm text-textMuted dark:text-textInverted mb-4">
            Keep your account secure with a strong password. You can reset it below.
          </p>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="px-4 py-2 rounded-md bg-primary text-textInverted dark:text-textInverted hover:bg-primaryDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>

    {/* Footer actions */}
    <div className="px-6 md:px-10 py-4 bg-bgCard/70 dark:bg-secondary/70 border-t border-borderDefault dark:border-borderStrong flex flex-wrap gap-3 justify-between">
      <div className="text-xs text-textMuted dark:text-textInverted">Safe • Secure • Hassle-free</div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-md bg-bgMuted text-textPrimary dark:text-textInverted hover:bg-bgHover dark:bg-secondary dark:hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
        >
          Back to Home
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md bg-danger text-textInverted dark:text-textInverted hover:bg-danger/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dangerBg"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</div>

 </>
  );
}
