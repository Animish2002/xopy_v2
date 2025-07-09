import React, { useState, useEffect, useRef } from "react";
import { Download, Share2, Printer, RefreshCw } from "lucide-react";
import Layout from "./Layout"; // Assuming Layout.jsx is in the same directory
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf'; // Import jsPDF library
import logo from "../assets/xopyLogo.png"; // Adjust path if necessary

// Import ShadCN components (adjust paths if your structure is different)
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
// import { Badge } from "../components/ui/badge"; // Badge was commented out in original, but kept import if needed
import { Avatar } from "../components/ui/avatar";

const DownloadQR = () => {
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [downloading, setDownloading] = useState(false);

  // This ref will now specifically target the content inside the Card
  // that you want to download (excluding the buttons).
  const qrDownloadContentRef = useRef(null);
  const currentUrl = window.location.href; // Captures the full current URL

  const generateQR = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const id = localStorage.getItem("shopOwnerId");
      if (!id) {
        throw new Error("Shop Owner ID not found in localStorage.");
      }

      // Construct the URL for QR generation, including the current client-side URL
      const url = new URL(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/generate-qr/${id}`
      );
      url.searchParams.append("url", currentUrl); // Append the current frontend URL as a query parameter

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate QR code");
      }

      const data = await response.json();
      setQrCodeBase64(data.qrCodeUrl);
    } catch (error) {
      setError(`Failed to generate QR code. ${error.message || 'Please try again.'}`);
      console.error("QR generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "User";
    setUserName(storedName);
    generateQR();
  }, [currentUrl]); // Re-generate if the current URL changes (though less likely in a single-page app context)

  const handleDownload = async () => {
    // Check if the ref has a current element and if a download is not already in progress
    if (!qrDownloadContentRef.current || downloading) return;

    setDownloading(true); // Set downloading state to true

    try {
      // 1. Convert the HTML content (the card's inner part) to a PNG image using dom-to-image
      // Setting a higher quality and ensuring white background for better PDF rendering
      const dataUrl = await domtoimage.toPng(qrDownloadContentRef.current, {
        quality: 1, // Max quality
        bgcolor: 'white', // Ensure the background is white for the image
        // Optionally, you can increase scaleFactor for even higher resolution PNG,
        // which will result in a larger file size but sharper text/images in PDF
        // width: qrDownloadContentRef.current.offsetWidth * 2, // Example: double resolution
        // height: qrDownloadContentRef.current.offsetHeight * 2, // Example: double resolution
        // style: {
        //   transform: 'scale(2)',
        //   transformOrigin: 'top left'
        // },
        filter: (node) => {
          // Exclude script tags from the captured image
          if (node.tagName === 'SCRIPT') return false;
          return true;
        }
      });

      // 2. Initialize jsPDF
      // 'p' for portrait, 'mm' for millimeters, 'a4' page size
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Get page dimensions
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;

      // Calculate image dimensions to fit within PDF with some margin
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pageWidth - 20; // 10mm margin on each side (20mm total)
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 10; // Initial Y position, 10mm top margin

      // 3. Add the image to the PDF
      pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle content that overflows to multiple pages (unlikely for a small QR card, but good practice)
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 4. Save the PDF
      pdf.save(`xopy-qrcode-${userName.toLowerCase().replace(/\s+/g, "-")}.pdf`);

    } catch (err) {
      console.error("Error downloading QR code:", err);
      setError("Failed to download QR code. Please try again.");
    } finally {
      setDownloading(false); // Reset downloading state
    }
  };

  const handleRegenerateQR = () => {
    generateQR(); // Call the QR generation function again
  };

  return (
    <Layout>
      <div className="md:p-4 p-2">
        <div className="p-4 md:text-2xl text-lg ui font-semibold">
          Download QR
        </div>
        <div className="container mx-auto max-w-2xl py-2 md:px-4">
          <Card className="shadow-lg">
            {/* This div will now hold the ref for image capture */}
            <div ref={qrDownloadContentRef}>
              <CardHeader className="text-center border-b pb-6">
                {/* Your commented out CardTitle/Badge remains here */}
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
                    <div
                      className="bg-white rounded-lg border-2 border-yellow-400 p-6 max-w-md mx-auto"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#fbbf24',
                        fontFamily: 'Arial, sans-serif'
                      }}
                    >
                      {/* Logo header */}
                      <div className="flex items-center justify-center mb-6">
                        <Avatar className="w-40 h-30 mr-2">
                          <img
                            src={logo}
                            alt="Xopy Logo"
                            className="w-full h-full"
                            crossOrigin="anonymous" // Essential for canvas rendering to avoid CORS issues
                          />
                        </Avatar>
                      </div>

                      {/* QR Code */}
                      <div
                        className="bg-white p-2 mx-auto border border-gray-100 rounded-md shadow-sm"
                        style={{ backgroundColor: '#ffffff', borderColor: '#f3f4f6' }}
                      >
                        {qrCodeBase64 && (
                          <img
                            src={qrCodeBase64}
                            alt="QR Code"
                            className="w-full h-auto max-w-[250px] mx-auto"
                            crossOrigin="anonymous" // Essential for canvas rendering to avoid CORS issues
                          />
                        )}
                      </div>

                      {/* User name and instruction */}
                      <div className="text-center mt-6">
                        <p
                          className="text-sm mb-1"
                          style={{ color: '#6b7280' }}
                        >
                          Generated for
                        </p>
                        <p
                          className="font-semibold text-lg mb-4"
                          style={{ color: '#1f2937' }}
                        >
                          {userName}
                        </p>

                        <div
                          className="w-full h-px mb-4"
                          style={{ backgroundColor: '#e5e7eb' }}
                        />

                        <div
                          className="mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-md mb-2"
                          style={{ backgroundColor: '#f9fafb' }}
                        >
                          <Share2 className="w-4 h-4" style={{ color: '#d97706' }} />
                          <span style={{ color: '#374151' }}>
                            Scan this QR to share your files.
                          </span>
                        </div>

                        
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </div> {/* Closing tag for the ref div */}

            {/* These buttons are now correctly outside the content that will be downloaded */}
            <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
              <Button
                onClick={handleDownload}
                disabled={!qrCodeBase64 || loading || downloading}
                variant="default"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {downloading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download QR Code
                  </>
                )}
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