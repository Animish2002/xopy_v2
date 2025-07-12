import React from "react";
import { Badge } from "../components/ui/badge";
import { User, Mail, Phone, Clock } from "lucide-react";

const PrintJobDetails = ({ job, formatDate }) => {
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

  return (
    <>
      {/* Job Header */}
      <div className="px-6 p-2 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <div className="font-semibold text-lg">
            Print Job #{job.tokenNumber}
          </div>
          <Badge variant="outline" className={getStatusColor(job.status)}>
            {job.status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <User className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm">{job.customerName}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm">{job.customerEmail}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm">{job.customerPhone}</span>
          </div>
        </div>
      </div>

      {/* Print Specifications */}
      <div className="px-6 p-2 border-t border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Print Specifications</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Copies</p>
            <p className="font-medium">{job.noofCopies}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Print Type</p>
            <p className="font-medium">{job.printType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Paper Type</p>
            <p className="font-medium">{job.paperType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Print Side</p>
            <p className="font-medium">{job.printSide?.replace("_", " ")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pages</p>
            <p className="font-medium">{job.totalPages || "All Pages"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Cost</p>
            <p className="font-medium">
              ₹{Number(job.totalCost || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          Last updated: {formatDate(job.createdAt)}
        </div>
      </div>
    </>
  );
};

export default PrintJobDetails;