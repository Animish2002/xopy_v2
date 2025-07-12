import React from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CheckCircle, User, Mail, Phone } from "lucide-react";

const PrintJobCard = ({ job, isSelected, onSelect, onStatusUpdate, updatingStatus }) => {
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

  const customerName = job.metadata
    ? JSON.parse(job.metadata)?.customerName
    : job.customerName;

  return (
    <div
      className={`hover:bg-blue-50 cursor-pointer ${
        isSelected ? "bg-blue-50" : ""
      }`}
    >
      <div className="p-3" onClick={() => onSelect(job, job.files[0])}>
        <div className="flex items-center justify-between mb-1">
          <span
            className={`font-medium ${
              isSelected ? "text-blue-700" : "text-gray-900"
            }`}
          >
            {customerName || "Unnamed Customer"}
          </span>
          <Badge variant="outline" className={getStatusColor(job.status)}>
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
              onStatusUpdate(job.id);
            }}
            disabled={updatingStatus}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
        </div>
      )}
    </div>
  );
};

export default PrintJobCard;