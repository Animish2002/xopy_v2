import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import axios from "axios";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import register from "../assets/register.jpg";
import logo from "../assets/xopyLogo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Check password strength if the password field is changed
    if (name === "password") {
      checkPasswordStrength(value);
    }

    // Check if passwords match
    if (name === "password" || name === "confirmPassword") {
      if (name === "confirmPassword") {
        setPasswordsMatch(formData.password === value);
      } else {
        setPasswordsMatch(value === formData.confirmPassword);
      }
    }
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const isPasswordStrong = () => {
    return (
      passwordStrength.hasMinLength &&
      passwordStrength.hasUpperCase &&
      passwordStrength.hasLowerCase &&
      passwordStrength.hasNumber &&
      passwordStrength.hasSpecialChar
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!isPasswordStrong()) {
      setError("Password doesn't meet the strength requirements");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Remove confirmPassword from the data sent to the server
      const { confirmPassword, ...registrationData } = formData;

      const response = await axios.post(
        `${process.env.REACT_APP_API}/auth/register`,
        registrationData
      );

      if (response.data) {
        setSuccess("Registration successful! You can now login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);

      if (error.response?.status === 409) {
        setError(
          "This email is already registered. Please use another email address."
        );
      } else if (!error.response) {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className="flex items-center text-sm mt-1">
      {met ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-400 mr-2" />
      )}
      <span className={met ? "text-green-600" : "text-gray-500"}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img src={logo} alt="Xopy Logo" className="h-24 w-auto" />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-lg p-8">
        {/* Left Column - Info */}
        <div className="space-y-6 p-4">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-4xl ui">
              Join us today
            </h1>
            <p className="text-lg text-gray-600">
              Create your account to start your journey with us. Get access to
              all our features and services.
            </p>
          </div>
          <div className="hidden md:block relative">
            <img
              src={register}
              alt="Registration illustration"
              className="rounded-lg object-cover"
            />
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Right Column - Registration Form */}
        <Card className="shadow-none border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold ui">
              Create an account
            </CardTitle>
            <CardDescription>Fill in your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Phone Number field */}
                <div className="space-y-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Shop Name
                  </label>
                  <Input
                    id="shopName"
                    type="text"
                    name="shopName"
                    placeholder="Enter your shop name"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className={`w-full pr-10 ${
                        formData.confirmPassword && !passwordsMatch
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {confirmPasswordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-sm text-red-600 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium mt-6"
                disabled={
                  isLoading || (formData.confirmPassword && !passwordsMatch)
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-gray-600">
              By registering, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
