// DownloadSection.jsx
import { Download } from "lucide-react";

const DownloadSection = ({ downloadUrl }) => (
    downloadUrl && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center">
            <h3 className="text-lg font-medium text-green-800 mb-4">Processing Complete!</h3>
            <a
                href={downloadUrl}
                download="processed.csv"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
                <Download className="w-5 h-5 mr-2" />
                Download Processed CSV
            </a>
        </div>
    )
);

export default DownloadSection;