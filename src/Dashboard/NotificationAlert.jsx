import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

const NotificationAlert = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top duration-300">
      <Alert
        variant={notification.type === "success" ? "default" : "destructive"}
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
  );
};
export default NotificationAlert;
