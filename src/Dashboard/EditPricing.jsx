import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X, ChevronDown } from "lucide-react";
import Layout from "./Layout";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Note: In a real implementation, these would come from your component library
const Card = ({ className, children }) => (
  <div className={`bg-white rounded-lg border ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 border-b">{children}</div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={`text-xl font-bold ${className}`}>{children}</h3>
);

const CardDescription = ({ children }) => (
  <p className="text-gray-500 mt-1">{children}</p>
);

const CardContent = ({ children }) => <div className="p-6">{children}</div>;

const CardFooter = ({ children }) => (
  <div className="p-6 pt-0 flex items-center">{children}</div>
);

// Mock components for demonstration
const Select = ({ value, onValueChange, children }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full p-2 border rounded-md"
    >
      {children}
    </select>
  );
};

const SelectTrigger = ({ id, children }) => <div id={id}>{children}</div>;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const Input = ({
  id,
  type,
  value,
  onChange,
  min,
  step,
  placeholder,
  className,
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    min={min}
    step={step}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className}`}
  />
);

const Button = ({
  variant = "default",
  size,
  onClick,
  className,
  type,
  children,
}) => {
  const variantClasses = {
    default: "bg-zinc-800 text-white hover:bg-zinc-700",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    link: "bg-transparent text-blue-600 hover:text-blue-800 hover:underline",
  };

  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    default: "py-2 px-4",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md font-medium ${variantClasses[variant]} ${
        sizeClasses[size || "default"]
      } ${className}`}
    >
      {children}
    </button>
  );
};

const Label = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    {children}
  </label>
);

const EditPricing = () => {
  const PaperTypes = [
    "A0",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "LEGAL",
    "LETTER",
    "TABLOID",
  ];
  const PrintTypes = ["COLOR", "BLACK_WHITE"];

  // Simulating the id from useParams
  const { id } = useParams();
  const shopOwnerId = localStorage.getItem("shopOwnerId");

  const [formData, setFormData] = useState({
    id: "",
    paperType: "A4",
    printType: "BLACK_WHITE",
    singleSided: "",
    doubleSided: "",
    shopOwnerId: shopOwnerId,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingConfigs, setExistingConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);

  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    show: false,
    type: "", // success, error
    message: "",
  });

  // Fetch existing pricing configurations when component mounts
  useEffect(() => {
    if (id) {
      fetchExistingPricing();
    } else {
      showNotification("error", "Shop ID not found");
      setLoading(false);
    }
  }, []);

  const fetchExistingPricing = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/photocopycenter/pricing-configById/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pricing configurations");
      }

      const data = await response.json();

      // If data exists, populate form with it
      if (data.pricingConfig) {
        const config = data.pricingConfig;
        setFormData({
          id: config.id,
          paperType: config.paperType,
          printType: config.printType,
          singleSided: config.singleSided,
          doubleSided: config.doubleSided,
          shopOwnerId: config.shopOwnerId || shopOwnerId,
        });
        setIsEditMode(true);
        setSelectedConfig(config);
      }

      // If there are multiple configs, store them
      if (data.pricingConfigs && data.pricingConfigs.length > 0) {
        setExistingConfigs(data.pricingConfigs);
      }
    } catch (error) {
      showNotification("error", error.message || "Failed to load pricing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      id: "",
      paperType: "A4",
      printType: "BLACK_WHITE",
      singleSided: "",
      doubleSided: "",
    }));
    setIsEditMode(false);
    setSelectedConfig(null);
  };

  const handleSelectConfig = (config) => {
    setFormData({
      id: config.id,
      paperType: config.paperType,
      printType: config.printType,
      singleSided: config.singleSided.toString(),
      doubleSided: config.doubleSided.toString(),
      shopOwnerId: id,
    });
    setSelectedConfig(config);
    setIsEditMode(true);
  };

  // Updated handleSubmit function to fix the "shopOwnerId is not allowed" error
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Basic validation
    if (!formData.singleSided || !formData.doubleSided) {
      showNotification("error", "Please fill in all price fields");
      return;
    }

    try {
      // Determine URL and method based on whether we're editing or creating
      let url = `${
        import.meta.env.VITE_BACKEND_BASE_URL
      }/photocopycenter/pricing-config`;
      let method = "POST";

      if (isEditMode) {
        url = `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/photocopycenter/edit-pricing-config/${formData.id}`;
        method = "PUT";
      }

      // Extract only the fields that are allowed by the backend validation
      const { id, paperType, printType, singleSided, doubleSided } = formData;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          paperType,
          printType,
          singleSided: Number(singleSided),
          doubleSided: Number(doubleSided),
          // shopOwnerId is removed from the request body
        }),
      });

      if (response.ok) {
        // Refresh data after successful update
        fetchExistingPricing();

        showNotification(
          "success",
          isEditMode
            ? "Pricing configuration updated successfully!"
            : "Pricing configuration added successfully!"
        );

        if (!isEditMode) {
          resetForm();
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update pricing");
      }
    } catch (error) {
      showNotification("error", error.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Loading pricing configurations...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 text-lg md:text-2xl font-semibold">
        {isEditMode ? "Edit Print Pricing" : "Add Print Pricing"}
      </div>

      {notification.show && (
        <div
          className={`fixed top-20 right-8 p-4 rounded-md shadow-md mb-4 transition-all transform z-50 flex items-center justify-between ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <p>{notification.message}</p>
          </div>
          <button
            onClick={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 ml-4" />
          </button>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <Card className="shadow-lg mt-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isEditMode
                ? "Edit Pricing Configuration"
                : "Print Pricing Configuration"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? `Update pricing for ${
                    formData.paperType
                  } (${formData.printType.replace("_", " ")})`
                : "Set pricing for different paper types and print options"}
            </CardDescription>

            {isEditMode && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-2 text-sm text-blue-700">
                You are editing an existing pricing configuration.
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/shopowner/add-pricing")}
                  className="ml-2"
                >
                  Create New Instead
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paperType">Paper Size</Label>
                  <Select
                    value={formData.paperType}
                    onValueChange={(value) => handleChange("paperType", value)}
                  >
                    {PaperTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                  <p className="text-sm text-gray-500">
                    Select the paper size for this pricing configuration
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printType">Print Type</Label>
                  <Select
                    value={formData.printType}
                    onValueChange={(value) => handleChange("printType", value)}
                  >
                    {PrintTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </Select>
                  <p className="text-sm text-gray-500">
                    Choose between color or black & white printing
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="singleSided">Single Sided Price (₹)</Label>
                  <div className="relative">
                    <Input
                      id="singleSided"
                      type="text"
                      value={formData.singleSided}
                      onChange={(e) =>
                        handleChange("singleSided", e.target.value)
                      }
                      min="0"
                      step="0.5"
                      placeholder="Enter price"
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">
                      ₹
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doubleSided">Double Sided Price (₹)</Label>
                  <div className="relative">
                    <Input
                      id="doubleSided"
                      type="text"
                      value={formData.doubleSided}
                      onChange={(e) =>
                        handleChange("doubleSided", e.target.value)
                      }
                      min="0"
                      step="0.5"
                      placeholder="Enter price"
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">
                      ₹
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                onClick={handleSubmit}
              >
                {isEditMode ? "Update Pricing" : "Save Pricing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditPricing;
