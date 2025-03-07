import { Tag } from "lucide-react";
import { useState } from "react";

const SyntheticNumCol = ({ handleSynthesize }) => {
    const [columnName, setColumnName] = useState("");
    const [lowerLimit, setLowerLimit] = useState(0);
    const [upperLimit, setUpperLimit] = useState(0);
    const [dataType, setDataType] = useState("int");

    const handleSubmit = () => {
        const options = {
            column: columnName,
            lower: lowerLimit,
            upper: upperLimit,
            datatype: dataType
        };
        handleSynthesize(options);
    };

    return (
        <div className="space-y-2 mt-8">
            <label className="flex items-center text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4 mr-2" />
                Synthesize Numerical Column
            </label>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-gray-700"
                    placeholder="Enter column name"
                />
                <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                    className="px-3 py-2 border rounded-md text-gray-700"
                >
                    <option value="int">Integer</option>
                    <option value="float">Float</option>
                </select>
            </div>
            <div className="flex space-x-2 mt-2">
                <input
                    type="number"
                    value={lowerLimit}
                    onChange={(e) => setLowerLimit(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-gray-700"
                    placeholder="Lower limit"
                />
                <input
                    type="number"
                    value={upperLimit}
                    onChange={(e) => setUpperLimit(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-gray-700"
                    placeholder="Upper limit"
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

export default SyntheticNumCol;
