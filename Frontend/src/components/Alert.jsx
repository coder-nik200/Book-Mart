import React from "react";
import { AlertCircle } from "lucide-react";

const Alert = ({ type = "info", message, onClose }) => {
  const typeStyles = {
    success: "bg-green-100 text-green-700 border-green-400",
    error: "bg-red-100 text-red-700 border-red-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
    info: "bg-blue-100 text-blue-700 border-blue-400",
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${typeStyles[type]}`} role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xl font-bold hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
