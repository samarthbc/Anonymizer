import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

const MInvariance = ({ file_name, findMInvariance }) => {
    const [mValue, setMValue] = useState(null);
    const [isMInvariant, setIsMInvariant] = useState(null);
    const [minRequiredM, setMinRequiredM] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!file_name) return;

        const fetchMInvariance = async () => {
            try {
                console.log(file_name);
                let formData = new FormData();
                formData.append("file_name", file_name);

                const response = await fetch("http://localhost:8000/calculateMInvar", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to fetch M-Invariance");

                const result = await response.json();
                console.log(result);

                setMValue(result.m_value);
                setIsMInvariant(result.is_m_invariant);
                setMinRequiredM(result.min_required_m);
            } catch (err) {
                setError("Error calculating M-Invariance");
            }
        };

        fetchMInvariance();
    }, [findMInvariance]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-72 border border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
                <ShieldAlert className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">M-Invariance</h3>
            </div>
            {error ? (
                <p className="text-red-500 text-sm font-medium">{error}</p>
            ) : (
                <>
                    <p className="text-2xl font-bold text-gray-700">
                        {mValue !== null ? `M = ${mValue}` : "No Data.."}
                    </p>
                    <div className="mt-3">
                        <h4 className="text-md font-semibold text-gray-700">
                            {mValue !== null ? "Details:" : ""}
                        </h4>
                        <ul className="text-sm text-gray-600">
                            <li className="mt-1">
                                <span className="font-medium text-gray-800">{mValue !== null ? `M-Invariant:` : ""}</span> {mValue !== null ? isMInvariant ? "Yes" : "No" : ""}
                            </li>
                            <li className="mt-1">
                                <span className="font-medium text-gray-800">{mValue !== null ? `Min Required M:` : ""}</span> {minRequiredM}
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default MInvariance;
