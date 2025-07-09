// ViewPrints.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  Printer,
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  Settings,
  Menu,
  Star,
  Clock,
  Tag,
  ArrowLeft,
  ArrowRight,
  Trash,
} from "lucide-react";
import { useSocket } from "../context/SocketContext";

// Import shadcn components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar } from "../components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import Layout from "./Layout";

const getFileType = (fileName, fileUrl) => {
  const extension = fileName.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const pdfExtensions = ["pdf"];
  const docExtensions = ["doc", "docx"];
  const textExtensions = ["txt", "rtf"];

  if (imageExtensions.includes(extension)) return "image";
  if (pdfExtensions.includes(extension)) return "pdf";
  if (docExtensions.includes(extension)) return "document";
  if (textExtensions.includes(extension)) return "text";

  // Fallback: check URL for Google Docs viewer
  if (fileUrl && fileUrl.includes("docs.google.com")) return "document";

  return "other";
};

const FilePreview = ({ file, showWatermark, preventDownload }) => {
  const fileType = getFileType(file.fileName, file.fileUrl);

  switch (fileType) {
    case "image":
      return (
        <div className="flex justify-center items-center bg-gray-50 min-h-[600px] p-4">
          <img
            src={file.fileUrl}
            alt={file.fileName}
            className="max-w-full max-h-[600px] object-contain shadow-lg rounded"
            onContextMenu={preventDownload}
            onDragStart={(e) => e.preventDefault()}
            style={{
              pointerEvents: showWatermark ? "none" : "auto",
              userSelect: "none",
            }}
          />
        </div>
      );

    case "pdf":
      return (
        <iframe
          src={file.fileUrl}
          className="w-full h-[600px] border-none"
          title={file.fileName}
          onContextMenu={preventDownload}
          style={{
            pointerEvents: showWatermark ? "none" : "auto",
          }}
        />
      );

    case "document":
      // For Word docs, try Google Docs viewer first, then iframe
      const viewerUrl = file.fileUrl.includes("docs.google.com")
        ? file.fileUrl
        : `https://docs.google.com/viewer?url=${encodeURIComponent(
            file.fileUrl
          )}&embedded=true`;

      return (
        <iframe
          src={viewerUrl}
          className="w-full h-[600px] border-none"
          title={file.fileName}
          onContextMenu={preventDownload}
          style={{
            pointerEvents: showWatermark ? "none" : "auto",
          }}
        />
      );

    case "text":
      return (
        <div className="p-6 bg-white min-h-[600px]">
          <div className="bg-gray-50 p-4 rounded border font-mono text-sm">
            <iframe
              src={file.fileUrl}
              className="w-full h-[500px] border-none"
              title={file.fileName}
              onContextMenu={preventDownload}
              style={{
                pointerEvents: showWatermark ? "none" : "auto",
              }}
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col justify-center items-center bg-gray-50 min-h-[600px] p-4">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {file.fileName}
            </h3>
            <p className="text-gray-500 mb-4">
              This file type cannot be previewed directly.
            </p>
            <Button
              onClick={() => window.open(file.fileUrl, "_blank")}
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      );
  }
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [socket, connected] = useSocket();

  useEffect(() => {
    fetchFiles();
  }, []);
  // WebSocket event listeners
  const handleNewPrintJob = (job) => {
    setPrintJobs((prev) => [job, ...prev]);
    setNotification({
      type: "success",
      message: `New job received: ${job.tokenNumber}`,
    });
  };

  // Replace your current socket useEffect with this:
  useEffect(() => {
    if (!socket) return;

    const handleNewJob = (job) => {
      console.log("Received new job:", job); // Debug log
      setPrintJobs((prev) => {
        // Filter out if already exists (prevent duplicates)
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

    // Join shop room on connection
    const shopId = localStorage.getItem("shopOwnerId");
    if (shopId) {
      console.log("Joining shop room:", shopId);
      socket.emit("joinShopRoom", shopId);
    }

    socket.on("newPrintJob", handleNewJob);
    socket.on("printJobStatusUpdate", handleStatusUpdate);

    return () => {
      socket.off("newPrintJob", handleNewJob);
      socket.off("printJobStatusUpdate", handleStatusUpdate);
    };
  }, [socket]); // Only depend on socket

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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setPrintJobs(response.data.data);
        // Update selected job if it exists in the new data
        if (selectedJob) {
          const updatedJob = response.data.data.find(
            (job) => job.id === selectedJob.id
          );
          if (updatedJob) setSelectedJob(updatedJob);
        }

        // Show success notification
        setNotification({
          type: "success",
          message: "Print jobs refreshed successfully",
        });

        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to convert ISO date string to dd/mm/yy format
  function formatToddmmyy(isoDateString) {
    const date = new Date(isoDateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year

    return `${day}/${month}/${year}`;
  }

  const handleFileSelect = (job, file) => {
    setSelectedJob(job);
    setSelectedFile(file);
    setShowWatermark(false);
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const preventDownload = (e) => {
    e.preventDefault();
    setShowWatermark(true);
    setTimeout(() => setShowWatermark(false), 3000);
  };

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
        socket.emit("updatePrintJobStatus", {
          jobId,
          status: "COMPLETED",
        });
      }

      if (response.data.success) {
        // Update the job status locally
        setPrintJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, status: "COMPLETED" } : job
          )
        );

        // Update selected job if it's the one being modified
        if (selectedJob?.id === jobId) {
          setSelectedJob((prev) => ({ ...prev, status: "COMPLETED" }));
        }

        // Show success notification
        setNotification({
          type: "success",
          message: "Print job marked as completed",
        });

        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to update status: " + err.message,
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter jobs based on selected tab and search query
  const filteredJobs = printJobs.filter((job) => {
    const matchesTab =
      selectedTab === "all" || job.status.toLowerCase() === selectedTab;

    const matchesSearch =
      job.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tokenNumber?.toString().includes(searchQuery) ||
      job.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Function to get status color for badge
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const Watermark = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none rotate-45 text-gray-500 text-4xl">
      <div className="border-2 border-gray-500 p-4">
        CONFIDENTIAL - DO NOT COPY
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="max-w-screen-2xl mx-auto px-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="p-4 md:text-2xl text-lg ui font-semibold">
                View Prints
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connected ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={connected ? "Connected" : "Disconnected"}
                />
                <span className="text-xs text-gray-500">
                  {connected ? "Live" : "Offline"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
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
                      <SheetTitle className="flex items-center">
                        <Printer className="h-5 w-5 mr-2" /> Print Jobs
                      </SheetTitle>
                    </SheetHeader>
                    <div className="pt-2">
                      <Tabs
                        defaultValue="all"
                        value={selectedTab}
                        onValueChange={setSelectedTab}
                      >
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
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">
                                <span className="font-medium">
                                  {(job.metadata
                                    ? JSON.parse(job.metadata)?.customerName
                                    : job.customerName) || "Unnamed Customer"}
                                </span>
                              </span>

                              <Badge
                                variant="outline"
                                className={getStatusColor(job.status)}
                              >
                                {job.status}
                              </Badge>
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
              </div>

              {/* <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-xl mx-4">
                <Search className="h-4 w-4 text-gray-500 mr-2" />
                <Input
                  type="text"
                  placeholder="Search print jobs, customers, or token numbers"
                  className="border-none bg-transparent shadow-none focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div> */}

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={fetchFiles}>
                  <RefreshCw
                    className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top duration-300">
            <Alert
              variant={
                notification.type === "success" ? "default" : "destructive"
              }
            >
              {notification.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {notification.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Sidebar - Job List (Desktop) */}
            <div className="hidden md:block w-64 lg:w-96 flex-shrink-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Print Jobs</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Newest First</DropdownMenuItem>
                        <DropdownMenuItem>Oldest First</DropdownMenuItem>
                        <DropdownMenuItem>Status: Pending</DropdownMenuItem>
                        <DropdownMenuItem>Status: Completed</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="px-2 pb-2 pt-0">
                  <Tabs
                    defaultValue="all"
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="divide-y divide-slate-100">
                    {loading ? (
                      // Skeleton loaders when loading
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-10 w-full rounded-md" />
                          </div>
                        ))
                    ) : filteredJobs.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">No print jobs found</p>
                      </div>
                    ) : (
                      filteredJobs.map((job) => (
                        <div
                          key={job.id}
                          className={`hover:bg-blue-50 cursor-pointer ${
                            selectedJob?.id === job.id ? "bg-blue-50" : ""
                          }`}
                        >
                          <div
                            className="p-3"
                            onClick={() => handleFileSelect(job, job.files[0])}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`font-medium ${
                                  selectedJob?.id === job.id
                                    ? "text-blue-700"
                                    : "text-gray-900"
                                }`}
                              >
                                <span className="font-medium">
                                  {(job.metadata
                                    ? JSON.parse(job.metadata)?.customerName
                                    : job.customerName) || "Unnamed Customer"}
                                </span>
                              </span>
                              <Badge
                                variant="outline"
                                className={getStatusColor(job.status)}
                              >
                                {job.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              Token: {job.tokenNumber} • {job.files.length}{" "}
                              {job.files.length === 1 ? "file" : "files"}
                            </div>
                            <div className="text-sm line-clamp-2 text-gray-600">
                              {job.files.map((f) => f.fileName).join(", ")}
                            </div>
                          </div>
                          {job.status.toLowerCase() !== "completed" && (
                            <div className="px-3 pb-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(job.id);
                                }}
                                disabled={updatingStatus}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            {/* Mobile Search Bar */}
            {/* <div className="md:hidden mb-4">
              <div className="flex items-center bg-white rounded-lg border px-3 py-2">
                <Search className="h-4 w-4 text-gray-500 mr-2" />
                <Input
                  type="text"
                  placeholder="Search jobs or customers"
                  className="border-none shadow-none focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div> */}

            {/* Main Content Area */}
            <div className="flex-1 relative">
              {selectedJob && selectedFile ? (
                <Card className="gap-2">
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
                        <Badge
                          variant="outline"
                          className={getStatusColor(selectedJob.status)}
                        >
                          {selectedJob.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="px-6 p-2 border-b border-gray-100">
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <div className="font-semibold text-lg">
                          Print Job #{selectedJob.tokenNumber}
                        </div>
                        <div className="text-gray-500">
                          {selectedJob.customerName}
                        </div>
                      </div>
                      <div className="absolute top-6 right-4 flex items-center space-x-2">
                        
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
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            {selectedJob.customerName}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            {selectedJob.customerEmail}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            {selectedJob.customerPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Print Details */}
                    <div className="px-6 p-2 border-t border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Print Specifications
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Copies</p>
                          <p className="font-medium">
                            {selectedJob.noofCopies}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Print Type</p>
                          <p className="font-medium">{selectedJob.printType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Paper Type</p>
                          <p className="font-medium">{selectedJob.paperType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Print Side</p>
                          <p className="font-medium">
                            {selectedJob.printSide?.replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Pages</p>
                          <p className="font-medium">
                            {selectedJob.totalPages || "All Pages"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Cost</p>
                          <p className="font-medium">
                            ₹{Number(selectedJob.totalCost || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* File Preview with Tabs for multiple files */}
                    <div className="relative">
                      {showWatermark && <Watermark />}
                      <Tabs defaultValue={selectedFile.id} className="w-full">
                        <div className="border-b border-gray-100">
                          <div className="px-6 py-2 flex items-center overflow-x-auto scrollbar-hide">
                            <TabsList className="bg-transparent">
                              {selectedJob.files.map((file) => {
                                const fileType = getFileType(
                                  file.fileName,
                                  file.fileUrl
                                );
                                const getFileIcon = () => {
                                  switch (fileType) {
                                    case "image":
                                      return "🖼️";
                                    case "pdf":
                                      return "📄";
                                    case "document":
                                      return "📝";
                                    case "text":
                                      return "📋";
                                    default:
                                      return "📎";
                                  }
                                };

                                return (
                                  <TabsTrigger
                                    key={file.id}
                                    value={file.id}
                                    onClick={() => setSelectedFile(file)}
                                    className="data-[state=active]:bg-blue-50 data-[state=active]:shadow-none"
                                  >
                                    <span className="mr-2">
                                      {getFileIcon()}
                                    </span>
                                    {file.fileName}
                                  </TabsTrigger>
                                );
                              })}
                            </TabsList>
                          </div>
                        </div>

                        {selectedJob.files.map((file) => (
                          <TabsContent
                            key={file.id}
                            value={file.id}
                            className="m-0"
                          >
                            <FilePreview
                              file={file}
                              showWatermark={showWatermark}
                              preventDownload={preventDownload}
                            />
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      Last updated: {formatToddmmyy(selectedJob.createdAt)}
                    </div>
                    
                  </CardFooter>
                </Card>
              ) : (
                <Card className="h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-500" />
                    </div>
                    <CardTitle className="mb-2">
                      No Print Job Selected
                    </CardTitle>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Select a print job from the list to view details and
                      manage files.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrintFilesViewer;
