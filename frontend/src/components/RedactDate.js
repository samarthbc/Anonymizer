import { useState } from "react";
import { Key } from "lucide-react";

const RedactDate = ({ handleRedact }) => {
    const [columnName, setColumnName] = useState("");
    const [redactDay, setRedactDay] = useState(false);
    const [redactMonth, setRedactMonth] = useState(false);
    const [redactYear, setRedactYear] = useState(false);

    const handleSubmit = () => {
        if (!columnName) {
            alert("Please enter a column name.");
            return;
        }

        const options = {
            column: columnName,
            redact_day: redactDay,
            redact_month: redactMonth,
            redact_year: redactYear,
        };

        handleRedact(options);
    };

    return (
        <div className="space-y-2 mt-8">
            <label className="flex items-center text-sm font-medium text-gray-700">
                <Key className="w-4 h-4 mr-2" />
                Redact Date
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Column Name"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={handleSubmit}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                >
                    Redact
                </button>
            </div>
            <div className="flex items-center gap-3">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={redactDay}
                        onChange={() => setRedactDay(!redactDay)}
                        className="mr-2"
                    />
                    Redact Day
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={redactMonth}
                        onChange={() => setRedactMonth(!redactMonth)}
                        className="mr-2"
                    />
                    Redact Month
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={redactYear}
                        onChange={() => setRedactYear(!redactYear)}
                        className="mr-2"
                    />
                    Redact Year
                </label>
            </div>
        </div>
    );
};

export default RedactDate;
