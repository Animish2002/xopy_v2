import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import FileViewer from "./FileViewer";

const FilePreviewTabs = ({
  files,
  selectedFile,
  onFileSelect,
  showWatermark,
  preventDownload,
}) => {
  const getFileType = (fileName, fileUrl) => {
    if (!fileName) return "other";
    const extension = fileName.split(".").pop()?.toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png"];
    const pdfExtensions = ["pdf"];
    const docExtensions = ["doc", "docx"];
    const textExtensions = ["txt", "text"];

    if (imageExtensions.includes(extension)) return "image";
    if (pdfExtensions.includes(extension)) return "pdf";
    if (docExtensions.includes(extension)) return "document";
    if (textExtensions.includes(extension)) return "text";
    return "other";
  };

  const getFileIcon = (fileType) => {
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
    <Tabs defaultValue={selectedFile.id} className="w-full">
      <div className="border-b border-gray-100">
        <div className="px-6 py-2 flex items-center overflow-x-auto scrollbar-hide">
          <TabsList className="bg-transparent">
            {files.map((file) => {
              const fileType = getFileType(file.fileName, file.fileUrl);
              return (
                <TabsTrigger
                  key={file.id}
                  value={file.id}
                  onClick={() => onFileSelect(file)}
                  className="data-[state=active]:bg-blue-50 data-[state=active]:shadow-none"
                >
                  <span className="mr-2">{getFileIcon(fileType)}</span>
                  {file.fileName}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </div>

      {files.map((file) => (
        <TabsContent key={file.id} value={file.id} className="m-0">
          <iframe
            fileUrl={file.signedUrl || file.fileUrl || file.url} // Use signedUrl first, then fallback
            src={file.signedUrl || file.fileUrl || file.url} // Fallback prop
            fileName={file.fileName || file.name} // Try both possible name properties
            onContextMenu={preventDownload}
            className="w-full h-[80vh]"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FilePreviewTabs;
