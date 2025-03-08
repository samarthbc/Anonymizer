import { useEffect, useState } from "react";
import { BarChart } from "lucide-react";
import { SERVER_URL } from "../constants";

const IDiversity = ({ file_name, findIDiversity }) => {
    const [iDiversity, setIDiversity] = useState(null);
    const [entropies, setEntropies] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        if (!file_name) return;

        const fetchIDiversity = async () => {
            try {
                console.log(file_name);
                let formData = new FormData();
                formData.append("file_name", file_name);
                
                const response = await fetch(SERVER_URL+"/calculateIDiv", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to fetch i-Diversity");

                const result = await response.json();
                // console.log(result);

                setIDiversity(result.idiv);
                setEntropies(result.entropies);
            } catch (err) {
                setError("Error calculating i-Diversity");
            }
        };

        fetchIDiversity();
    }, [findIDiversity]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-72 border border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
                <BarChart className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">I-Diversity</h3>
            </div>
            {error ? (
                <p className="text-red-500 text-sm font-medium">{error}</p>
            ) : (
                <>
                    <p className="text-2xl font-bold text-gray-700">
                        {iDiversity !== null ? `${iDiversity}` : "No Data.."}
                    </p>
                    <div className="mt-3">
                        <h4 className="text-md font-semibold text-gray-700">
                            {iDiversity !== null ? `Entropies:` : ""}
                        </h4>
                        <ul className="text-sm text-gray-600">
                            {Object.entries(entropies).map(([col, entropy]) => (
                                <li key={col} className="mt-1">
                                    <span className="font-medium text-gray-800">{col}:</span> {entropy.toFixed(3)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default IDiversity;
