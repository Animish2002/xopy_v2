import React, { useState, useEffect } from "react";

import { User, Phone, Mail, AtSign, FileText, Camera } from "lucide-react";
import AdminLayout from "./AdminLayout";

const SettingAdminPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Get user ID from localStorage
  const getUserId = () => {
    return localStorage.getItem("sessionId"); // Adjust this if your ID key is different
  };

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");
        const userId = getUserId();

        if (!userId) {
          setError("User ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/user/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        // Update form data with fetched user details from the response structure
        setFormData({
          name: userData.user.name || "",
          phoneNumber: userData.user.phoneNumber || "",
          email: userData.user.email || "",
          address: userData.user.address || "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      const userId = getUserId();

      if (!userId) {
        setError("User ID not found in localStorage");
        setLoading(false);
        return;
      }

      // Password validation
      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        setMessage("Passwords do not match");
        setLoading(false);
        return;
      }

      // Prepare data for API based on backend expectations
      const dataToUpdate = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };

      // Include password only if user is updating password
      if (formData.newPassword) {
        dataToUpdate.password = formData.newPassword;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/update-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const result = await response.json();

      // Clear password fields after successful update
      setFormData({
        ...formData,
        newPassword: "",
        confirmPassword: "",
      });

      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
    // Reset password fields
    setFormData({
      ...formData,
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (loading && !formData.name) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800 mx-auto"></div>
            <p className="mt-4">Loading user data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !formData.name) {
    return (
      <AdminLayout>
        <div className="p-4">
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="md:p-4 p-2">
        <div className="p-4 md:text-2xl text-lg font-semibold">
          General Setting
        </div>

        {/* Message Alert */}
        {message && (
          <div className="mx-auto md:w-10/12 w-full mb-6">
            <div
              className={`p-4 rounded-lg ${
                message.includes("not match") || message.includes("Failed")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          </div>
        )}

        <div className="mx-auto md:w-10/12 w-full">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex justify-between border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleCancel();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="px-4 py-1.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200 shadow-sm"
                  disabled={loading}
                >
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="name"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <User className="h-5 w-5 text-body" />
                        </span>
                        <input
                          className={`w-full rounded border border-stroke py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            !isEditing ? "bg-gray-100" : "bg-gray"
                          }`}
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <Phone className="h-5 w-5 text-body" />
                        </span>
                        <input
                          className={`w-full rounded border border-stroke py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            !isEditing ? "bg-gray-100" : "bg-gray"
                          }`}
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          placeholder="Enter your phone number"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <Mail className="h-5 w-5 text-body" />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray-100 py-3 pl-11.5 pr-4.5 text-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        readOnly={true} // Email should not be editable
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <AtSign className="h-5 w-5 text-body" />
                      </span>
                      <textarea
                        className={`w-full rounded border border-stroke py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                          !isEditing ? "bg-gray-100" : "bg-gray"
                        }`}
                        name="address"
                        id="address"
                        rows="3"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleChange}
                        readOnly={!isEditing}
                      ></textarea>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-6 border-t border-gray-100 mb-5.5">
                      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                        Change Password
                      </h3>
                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="newPassword"
                        >
                          New Password
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="confirmPassword"
                        >
                          Confirm New Password
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex justify-end gap-4.5">
                      <button
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex justify-center bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 py-2 px-6 font-medium disabled:bg-zinc-400"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingAdminPage;
