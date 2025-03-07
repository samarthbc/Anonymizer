// ErrorMessage.jsx
import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ error }) => (
    error && (
        <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-md">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
        </div>
    )
);

export default ErrorMessage;
