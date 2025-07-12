import React from "react";
import { Card, CardTitle } from "../components/ui/card";
import { FileText } from "lucide-react";

const EmptyState = () => {
  return (
    <Card className="h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FileText className="h-8 w-8 text-gray-500" />
        </div>
        <CardTitle className="mb-2">No Print Job Selected</CardTitle>
        <p className="text-gray-500 max-w-md mx-auto">
          Select a print job from the list to view details and manage files.
        </p>
      </div>
    </Card>
  );
};

export default EmptyState;