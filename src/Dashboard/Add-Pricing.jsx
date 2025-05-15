import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import Layout from "./Layout";

const AddPricing = () => {
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

  const [formData, setFormData] = useState({
    paperType: "A4",
    printType: "BLACK_WHITE",
    singleSided: "",
    doubleSided: "",
    shopOwnerId: "",
  });

  const [notification, setNotification] = useState({
    show: false,
    type: "", // success, error
    message: "",
  });

  useEffect(() => {
    const sid = localStorage.getItem("shopOwnerId");
    if (sid) {
      setFormData((prev) => ({ ...prev, shopOwnerId: sid }));
    } else {
      showNotification(
        "error",
        "Session not found. Please log in again to continue."
      );
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.singleSided || !formData.doubleSided) {
      showNotification("error", "Please fill in all price fields");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/photocopycenter/pricing-config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            singleSided: Number(formData.singleSided),
            doubleSided: Number(formData.doubleSided),
          }),
        }
      );

      if (response.ok) {
        showNotification(
          "success",
          "Pricing configuration updated successfully!"
        );

        // Reset form fields
        setFormData((prev) => ({
          ...prev,
          singleSided: "",
          doubleSided: "",
        }));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update pricing");
      }
    } catch (error) {
      showNotification("error", error.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="p-4 md:text-2xl text-lg ui font-semibold">
        Add Print Pricing
      </div>
      {notification.show && (
        <div
          className={`absolute top-20  right-8 p-4 rounded-md shadow-md mb-4 transition-all transform -translate-y-2 z-50 flex items-center justify-between ${
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
      <div className="max-w-md mx-auto relative">
        {/* Custom Notification */}

        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold ui">
              Print Pricing Configuration
            </CardTitle>
            <CardDescription>
              Set pricing for different paper types and print options
            </CardDescription>
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
                    <SelectTrigger id="paperType">
                      <SelectValue placeholder="Select paper size" />
                    </SelectTrigger>
                    <SelectContent>
                      {PaperTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select the paper size for this pricing configuration
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printType">Print Type</Label>
                  <Select
                    value={formData.printType}
                    onValueChange={(value) => handleChange("printType", value)}
                  >
                    <SelectTrigger id="printType">
                      <SelectValue placeholder="Select print type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PrintTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose between color or black & white printing
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-4">
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
                    <span className="absolute right-3 top-2 text-muted-foreground">
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
                    <span className="absolute right-3 top-2 text-muted-foreground">
                      ₹
                    </span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save Pricing
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddPricing;
