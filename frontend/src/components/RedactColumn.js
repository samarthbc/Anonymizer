import { Key } from "lucide-react";

const RedactColumn = ({ redactColumn, setRedactColumn, handleRedact }) => (
    <div className="space-y-2 mt-8">
        <label className="flex items-center text-sm font-medium text-gray-700">
            <Key className="w-4 h-4 mr-2" />
            Redact Column
        </label>
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value={redactColumn}
                onChange={(e) => setRedactColumn(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-gray-700"
                placeholder="Enter column name"
            />
            <button
                type="button"
                onClick={handleRedact}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
                Redact
            </button>
        </div>
    </div>
);

export default RedactColumn;
