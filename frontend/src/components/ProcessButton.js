// ProcessButton.jsx
import { Upload } from "lucide-react";

const ProcessButton = ({ isLoading }) => (
    <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
    >
        {isLoading ? (
            <><Upload className="animate-spin -ml-1 mr-2 h-5 w-5" />Processing...</>
        ) : (
            <><Upload className="w-5 h-5 mr-2" />Process CSV</>
        )}
    </button>
);

export default ProcessButton;