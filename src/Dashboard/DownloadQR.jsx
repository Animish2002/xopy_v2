import React, { useState, useEffect, useRef } from "react";
import { Download, Share2, Printer, RefreshCw } from "lucide-react";
import Layout from "./Layout";
import html2canvas from "html2canvas";

// Import ShadCN components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

const DownloadQR = () => {
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const qrContainerRef = useRef(null);
  const currentUrl = window.location.href;

  useEffect(() => {
    // Get user's name from localStorage or set default
    const storedName = localStorage.getItem("userName") || "User";
    setUserName(storedName);

    const generateQR = async () => {
      setLoading(true);
      try {
        const id = localStorage.getItem("sessionId");
        const url = new URL(
          `${process.env.REACT_APP_API}/auth/generate-qr/${id}`
        );
        url.searchParams.append("url", currentUrl);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }

        const data = await response.json();
        setQrCodeBase64(data.qrCodeUrl);
        setError("");
      } catch (error) {
        setError("Failed to generate QR code. Please try again.");
        console.error("QR generation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [currentUrl]);

  const handleDownload = async () => {
    try {
      if (!qrContainerRef.current) return;

      // Create a canvas from the branded QR container
      const canvas = await html2canvas(qrContainerRef.current, {
        scale: 3, // Higher resolution
        backgroundColor: null,
      });

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create download link
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `xopy-qrcode-${userName
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading QR code:", err);
      setError("Failed to download QR code. Please try again.");
    }
  };

  const handleRegenerateQR = () => {
    generateQR();
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="p-4 md:text-2xl text-lg ui font-semibold">Download OR</div>
        <div className="container mx-auto max-w-2xl py-6 px-4">
          <Card className="shadow-lg">
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto mb-2">
                <Badge
                  variant="outline"
                  className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 border-yellow-300"
                >
                  QR Code
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">
                Your Xopy QR Code
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <RefreshCw className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
                  <p className="text-gray-500">Generating your QR code...</p>
                </div>
              ) : (
                <>
                  {/* Branded QR code container to be captured for download */}
                  <div
                    ref={qrContainerRef}
                    className="bg-white rounded-lg border-2 border-yellow-400 p-6 max-w-md mx-auto"
                  >
                    {/* Logo header */}
                    <div className="flex items-center justify-center mb-6">
                      <Avatar className="h-10 w-10 bg-yellow-500 mr-2">
                        <AvatarFallback className="font-bold text-white">
                          X
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-2xl font-bold text-gray-800">
                        Xopy
                      </span>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-2 mx-auto border border-gray-100 rounded-md shadow-sm">
                      {qrCodeBase64 && (
                        <img
                          src={qrCodeBase64}
                          alt="QR Code"
                          className="w-full h-auto max-w-[250px] mx-auto"
                        />
                      )}
                    </div>

                    {/* User name and instruction */}
                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-500">Generated for</p>
                      <p className="font-semibold text-gray-800 text-lg">
                        {userName}
                      </p>

                      <Separator className="my-4" />

                      <div className="mt-4 flex items-center justify-center gap-2 bg-gray-50 py-3 px-4 rounded-md">
                        <Share2 className="w-4 h-4 text-yellow-600" />
                        <span className="text-gray-700">
                          Scan & share files for printing
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Printer className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Ready for instant printing
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                      <p className="text-xs text-gray-500">
                        Powered by Xopy • xopy.com
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
              <Button
                onClick={handleDownload}
                disabled={!qrCodeBase64 || loading}
                variant="default"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Branded QR Code
              </Button>

              <Button
                onClick={handleRegenerateQR}
                disabled={loading}
                variant="outline"
                className="text-gray-600"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Regenerate QR Code
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DownloadQR;
