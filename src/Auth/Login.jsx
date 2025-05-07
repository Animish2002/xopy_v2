import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import logo from "../assets/xopyLogo.png";
import LoginIllustration from "../assets/Login-Illustration.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`,
        formData
      );

      if (response.data) {
        const { token, user } = response.data;
        login(token);
        // localStorage.setItem("userName", user.name);
        setSuccess(`Welcome back, ${user.role}!`);

        if (user.role === "ShopOwner") {
          navigate("/shopowner/dashboard");
        } else if (user.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);

      if (error.response?.status === 401 || error.response?.status === 404) {
        setError("Invalid email or password. Please try again.");
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

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-900 md:p-4 md:w-full w-[25rem] mx-auto">
      {/* Logo */}

      <div className="absolute md:top-4 md:left-6 top-2 left-3">
        <img src={logo} alt="Xopy Logo" className="md:h-24 h-20 w-auto" />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-2xl md:p-8 p-4 md:mt-0 mt-10">
        {/* Left Column - Info */}
        <div className="space-y-6 p-4">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl ui">
              Welcome back
            </h1>
            <p className="md:text-lg text-sm text-gray-600">
              Seamlessly access your account with our intuitive login system.
              Get back to what matters most.
            </p>
          </div>
          <div className="hidden md:block relative">
            <img
              src={LoginIllustration}
              alt="Login illustration"
              className="rounded-lg object-cover"
            />
          </div>
          <div className="text-xs md:text-sm">
            <span className="text-gray-600">New to our platform? </span>
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold ui">Sign in</CardTitle>
            <CardDescription className="text-xs md:text-xl">
              Enter your credentials to access your account
            </CardDescription>
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div>
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
                    className="w-full mt-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgetPassword"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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
                {/* If you want to add form validation error messages */}
                {/* <p className="text-sm text-red-600">Error message here</p> */}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-gray-600">
              Protected by industry-standard security practices
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
