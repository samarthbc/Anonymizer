// FileUpload.jsx
import { FileSpreadsheet } from "lucide-react";

const FileUpload = ({ handleFileChange }) => (
    <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Upload CSV File
        </label>
        <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
    </div>
);

export default FileUpload;
