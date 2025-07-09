// Preferences.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Droplet,
  Layers,
  FileText,
  Trash2,
  User,
  Phone,
  Mail,
} from "lucide-react";
import confetti from "canvas-confetti";

const stages = ["Upload", "Customer Details", "Print Details", "Confirm"];

const Preferences = () => {
  const { id } = useParams();
  const [stage, setStage] = useState(0);
  const [files, setFiles] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  });
  const [preferences, setPreferences] = useState({
    noofCopies: "1",
    printType: "BLACK_WHITE",
    paperType: "",
    printSide: "SINGLE_SIDED",
    specificPages: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null);
  const [amount, setAmount] = useState(0);

  const paperSizes = [
    { value: "A4", label: "A4", description: "210×297mm" },
    { value: "A3", label: "A3", description: "297×420mm" },
    { value: "A5", label: "A5", description: "148×210mm" },
    { value: "Letter", label: "Letter", description: "8.5×11in" },
    { value: "Legal", label: "Legal", description: "8.5×14in" },
  ];

  const printSides = [
    { value: "SINGLE_SIDED", label: "Single Sided", icon: "📄" },
    { value: "DOUBLE_SIDED", label: "Double Sided", icon: "📃" },
  ];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "image/jpeg" ||
        file.type === "image/png"
    );

    if (validFiles.length !== newFiles.length) {
      alert(
        "Some files were not added. Please upload only PDF, DOC, or DOCX files."
      );
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Append customer and print details
    formData.append("shopOwnerId", id);
    // Only append customer details if they're provided
    if (customerDetails.customerName) {
      formData.append("customerName", customerDetails.customerName);
    }
    if (customerDetails.customerPhone) {
      formData.append("customerPhone", customerDetails.customerPhone);
    }
    if (customerDetails.customerEmail) {
      formData.append("customerEmail", customerDetails.customerEmail);
    }

    formData.append("noofCopies", preferences.noofCopies);
    formData.append("printType", preferences.printType);
    formData.append("paperType", preferences.paperType);
    formData.append("printSide", preferences.printSide);
    formData.append("specificPages", preferences.specificPages);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/printshop/print-jobs`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit print job");
      }
      console.log(formData);
      const data = await response.json();
      setToken(data.printJob.tokenNumber);
      setAmount(data.printJob.totalCost);
      // Add after successful submission (right before confetti)
      if (socket && connected) {
        socket.emit("customerSubmission", {
          shopOwnerId: id,
          customerName: customerDetails.customerName || "Anonymous Customer",
          tokenNumber: data.tokenNumber, // From API response
        });
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStage = () =>
    setStage((prev) => Math.min(prev + 1, stages.length - 1));
  const prevStage = () => setStage((prev) => Math.max(prev - 1, 0));

  const renderCustomerDetails = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="space-y-4"
    >
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <p>
            All fields are optional. You can leave them blank if you prefer.
          </p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Customer Name (Optional)
          </label>
          <input
            type="text"
            value={customerDetails.customerName}
            onChange={(e) =>
              setCustomerDetails((prev) => ({
                ...prev,
                customerName: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={customerDetails.customerPhone}
            onChange={(e) =>
              setCustomerDetails((prev) => ({
                ...prev,
                customerPhone: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Email Address (Optional)
          </label>
          <input
            type="email"
            value={customerDetails.customerEmail}
            onChange={(e) =>
              setCustomerDetails((prev) => ({
                ...prev,
                customerEmail: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderPrintDetails = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Copy className="w-4 h-4 mr-2" />
            Number of copies
          </label>
          <input
            type="number"
            min="1"
            value={preferences.noofCopies}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                noofCopies: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Droplet className="w-4 h-4 mr-2" />
            Print type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="printType"
                value="BLACK_WHITE"
                checked={preferences.printType === "BLACK_WHITE"}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    printType: e.target.value,
                  }))
                }
              />
              <span className="ml-2">Black & White</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="printType"
                value="COLOR"
                checked={preferences.printType === "COLOR"}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    printType: e.target.value,
                  }))
                }
              />
              <span className="ml-2">Color</span>
            </label>
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Paper Size
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {paperSizes.map((size) => (
              <button
                key={size.value}
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, paperType: size.value }))
                }
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  preferences.paperType === size.value
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {preferences.paperType === size.value && (
                  <Check className="absolute top-2 right-2 w-4 h-4 text-blue-500" />
                )}
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">
                    {size.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {size.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Print Side - Toggle Switch Style */}
        <div className="space-y-4 mb-8">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Print Side
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {printSides.map((side) => (
              <button
                key={side.value}
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, printSide: side.value }))
                }
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md transition-all duration-200 ${
                  preferences.printSide === side.value
                    ? "bg-white shadow-sm text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="mr-2">{side.icon}</span>
                {side.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Specific Pages (e.g., 1-5,7,9)
          </label>
          <input
            type="text"
            value={preferences.specificPages}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                specificPages: e.target.value,
              }))
            }
            placeholder="Leave blank to print all pages"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStage = () => {
    switch (stage) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Upload className="w-12 h-12 mb-2 text-blue-500" />
                <span className="text-sm text-gray-500">
                  Upload PDF, DOC, DOCX, PNG, or JPEG files
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                />
              </label>
            </div>
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Uploaded Files:</h3>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <p className="text-sm flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {file.name}
                    </p>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      case 1:
        return renderCustomerDetails();
      case 2:
        return renderPrintDetails();
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h3 className="text-lg font-semibold">Confirm your order</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Customer Details</h4>
                  <div className="mt-2 space-y-2">
                    <p>
                      Name: {customerDetails.customerName || "Not provided"}
                    </p>
                    <p>
                      Phone: {customerDetails.customerPhone || "Not provided"}
                    </p>
                    <p>
                      Email: {customerDetails.customerEmail || "Not provided"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Files</h4>
                  <div className="mt-2">
                    {files.map((file, index) => (
                      <p key={index}>{file.name}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Print Preferences</h4>
                  <div className="mt-2 space-y-2">
                    <p className="flex items-center">
                      <Copy className="w-4 h-4 mr-2" />
                      Copies: {preferences.noofCopies}
                    </p>
                    <p className="flex items-center">
                      <Droplet className="w-4 h-4 mr-2" />
                      Print type:{" "}
                      {preferences.printType === "BLACK_WHITE"
                        ? "Black & White"
                        : "Color"}
                    </p>
                    <p className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Paper Size: {preferences.paperType || "Not selected"}
                    </p>
                    <p className="flex items-center">
                      <Layers className="w-4 h-4 mr-2" />
                      Print Side:{" "}
                      {preferences.printSide === "SINGLE_SIDED"
                        ? "Single Sided"
                        : "Double Sided"}
                    </p>
                    <p className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Page Range: {preferences.specificPages || "All pages"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (token) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 bg-white p-8 rounded-lg shadow-lg"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360, 0],
          }}
          transition={{ duration: 1 }}
        >
          <Check className="w-20 h-20 mx-auto text-green-500" />
        </motion.div>
        <h3 className="text-2xl font-semibold text-gray-800">
          Your print job has been submitted!
        </h3>
        <p className="text-lg text-gray-600">
          Your token number is:{" "}
          <span className="font-bold text-blue-600">{token}</span>
        </p>
        <p className="text-lg text-gray-600">
          Amount to be paid:{" "}
          <span className="font-bold text-blue-600">{amount}</span>
        </p>
        <p className="text-sm text-gray-500">
          Please keep this token for reference when collecting your prints.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Start New Request
        </button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Print Request
          </h2>
          <div className="mt-2 flex justify-between">
            {stages.map((s, index) => (
              <div key={s} className="flex flex-col items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= stage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  initial={false}
                  animate={{
                    backgroundColor: index <= stage ? "#3B82F6" : "#E5E7EB",
                    color: index <= stage ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  {index + 1}
                </motion.div>
                <span className="mt-2 text-xs text-gray-500">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">{renderStage()}</AnimatePresence>
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStage}
            disabled={stage === 0}
            className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              stage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </button>
          <button
            onClick={nextStage}
            disabled={
              (stage === 0 && files.length === 0) ||
              (stage === 2 &&
                (!preferences.paperType || !preferences.noofCopies)) ||
              stage === stages.length - 1
            }
            className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (stage === 0 && files.length === 0) ||
              (stage === 2 &&
                (!preferences.paperType || !preferences.noofCopies)) ||
              stage === stages.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
