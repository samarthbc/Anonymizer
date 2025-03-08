import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react"; // Adding an icon for a polished look
import { SERVER_URL } from "../constants";

const KAnonymity = ({ file_name, findK }) => {
    const [kAnonymity, setKAnonymity] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!file_name) return;

        const fetchKAnonymity = async () => {
            try {
                console.log(file_name);
                let formData = new FormData();
                formData.append("file_name", file_name);
                const response = await fetch(SERVER_URL+"/calculateK", {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) throw new Error("Failed to fetch k-anonymity");

                const result = await response.json();
                console.log(result);
                setKAnonymity(result.k);
            } catch (err) {
                setError("Error calculating k-anonymity");
            }
        };

        fetchKAnonymity();
    }, [findK]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-72 border border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">K-Anonymity</h3>
            </div>
            {error ? (
                <p className="text-red-500 text-sm font-medium">{error}</p>
            ) : (
                <p className="text-2xl font-bold text-gray-700">
                    {kAnonymity !== null ? `K = ${kAnonymity}` : "No Data.."}
                </p>
            )}
        </div>
    );
};

export default KAnonymity;
