import { Tag } from "lucide-react";
import { useState } from "react";

const SyntheticCatCol = ({ handleSynthesize }) => {
    const [columnName, setColumnName] = useState("");
    const [categories, setCategories] = useState("");

    const handleSubmit = () => {
        const categoryList = categories.split(",").map(cat => cat.trim());

        const options = {
            column: columnName,
            categories: categoryList
        };

        handleSynthesize(options);
    };

    return (
        <div className="space-y-2 mt-8">
            <label className="flex items-center text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4 mr-2" />
                Synthesize Categorical Column
            </label>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-gray-700"
                    placeholder="Enter column name"
                />
            </div>
            <div className="flex space-x-2 mt-2">
                <input
                    type="text"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-gray-700"
                    placeholder="Enter categories (comma-separated)"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-blue-700"
                >
                    Synthesize
                </button>
            </div>
        </div>
    );
};

export default SyntheticCatCol;
