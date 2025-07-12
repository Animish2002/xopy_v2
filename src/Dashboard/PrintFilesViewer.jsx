import React, { useState, useEffect } from "react";
import axios from "axios";
import { RefreshCw, Menu, ArrowLeft, CheckCircle } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import Layout from "./Layout";
import PrintJobsList from "./PrintJobsList";
import PrintJobDetails from "./PrintJobDetails";
import FilePreviewTabs from "./FilePreviewTabs";
import NotificationAlert from "./NotificationAlert";
import EmptyState from "./EmptyState";

const PrintFilesViewer = () => {
  const [printJobs, setPrintJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showWatermark, setShowWatermark] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [socket, connected] = useSocket();

  // Utility functions
  const formatToddmmyy = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileSelect = (job, file) => {
    console.log("Selecting file:", file); // Debug log
    const fileWithUrl = {
      ...file,
      fileUrl: file.fileUrl || file.url || file.downloadUrl, // Try different URL properties
      fileName: file.fileName || file.name || file.originalName, // Try different name properties
    };

    console.log("File with URL:", fileWithUrl); // Debug log
    setSelectedJob(job);
    setSelectedFile(file);
    setShowWatermark(false);
    setIsMobileMenuOpen(false);
  };

  const preventDownload = (e) => {
    e.preventDefault();
    setShowWatermark(true);
    setTimeout(() => setShowWatermark(false), 3000);
  };

  // Filter jobs based on selected tab
  const filteredJobs = printJobs.filter((job) => {
    const matchesTab =
      selectedTab === "all" || job.status.toLowerCase() === selectedTab;
    return matchesTab;
  });

  const handleStatusUpdate = async (jobId) => {
    try {
      setUpdatingStatus(true);
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/printshop/print-jobs/${jobId}/status`,
        { status: "COMPLETED" }
      );

      if (socket && connected) {
        socket.emit("updatePrintJobStatus", { jobId, status: "COMPLETED" });
      }

      if (response.data.success) {
        setPrintJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, status: "COMPLETED" } : job
          )
        );

        if (selectedJob?.id === jobId) {
          setSelectedJob((prev) => ({ ...prev, status: "COMPLETED" }));
        }

        showNotification("success", "Print job marked as completed");
      }
    } catch (err) {
      showNotification("error", "Failed to update status: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const shopId = localStorage.getItem("shopOwnerId");
      if (!shopId) throw new Error("Shop ID not found");

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/printshop/shop-files/${shopId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setPrintJobs(response.data.data);
        if (selectedJob) {
          const updatedJob = response.data.data.find(
            (job) => job.id === selectedJob.id
          );
          if (updatedJob) setSelectedJob(updatedJob);
        }
        showNotification("success", "Print jobs refreshed successfully");
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Socket effects
  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewJob = (job) => {
      setPrintJobs((prev) => {
        const exists = prev.some((j) => j.id === job.id);
        return exists ? prev : [job, ...prev];
      });
    };

    const handleStatusUpdate = (update) => {
      setPrintJobs((prev) =>
        prev.map((job) =>
          job.id === update.id ? { ...job, status: update.status } : job
        )
      );
    };

    const shopId = localStorage.getItem("shopOwnerId");
    if (shopId) {
      socket.emit("joinShopRoom", shopId);
    }

    socket.on("newPrintJob", handleNewJob);
    socket.on("printJobStatusUpdate", handleStatusUpdate);

    return () => {
      socket.off("newPrintJob", handleNewJob);
      socket.off("printJobStatusUpdate", handleStatusUpdate);
    };
  }, [socket]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="max-w-screen-2xl mx-auto px-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="p-4 md:text-2xl text-lg font-semibold">
                View Prints
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {connected ? "Live" : "Offline"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Mobile Menu */}
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72">
                    <SheetHeader>
                      <SheetTitle>Print Jobs</SheetTitle>
                    </SheetHeader>
                    <div className="pt-2">
                      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                        <TabsList className="w-full grid grid-cols-3 mb-6">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="pending">Pending</TabsTrigger>
                          <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <div className="space-y-1">
                        {filteredJobs.map((job) => (
                          <div
                            key={job.id}
                            className="p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleFileSelect(job, job.files[0])}
                          >
                            <div className="font-medium">
                              {job.customerName || "Unnamed Customer"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Token: {job.tokenNumber}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <Button variant="ghost" size="icon" onClick={fetchFiles}>
                  <RefreshCw
                    className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <NotificationAlert notification={notification} />

        {/* Main Content */}
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Job List */}
            <div className="hidden md:block w-64 lg:w-96 flex-shrink-0">
              <PrintJobsList
                jobs={filteredJobs}
                loading={loading}
                selectedJob={selectedJob}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                onJobSelect={handleFileSelect}
                onStatusUpdate={handleStatusUpdate}
                updatingStatus={updatingStatus}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative">
              {selectedJob && selectedFile ? (
                <Card>
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="md:hidden mr-2"
                          onClick={() => setSelectedJob(null)}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedJob.status.toLowerCase() !== "completed" && (
                          <Button
                            onClick={() => handleStatusUpdate(selectedJob.id)}
                            disabled={updatingStatus}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <PrintJobDetails
                      job={selectedJob}
                      formatDate={formatToddmmyy}
                    />
                    <div className="relative">
                      <FilePreviewTabs
                        files={selectedJob.files}
                        selectedFile={selectedFile}
                        onFileSelect={setSelectedFile}
                        showWatermark={showWatermark}
                        preventDownload={preventDownload}
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrintFilesViewer;
