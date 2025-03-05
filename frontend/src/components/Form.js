import { useState } from "react";
import "./Form.css";

const Form = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [columns, setColumns] = useState("");
    const [kValue, setKValue] = useState("");

    const handleFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleColumnsChange = (event) => {
        setColumns(event.target.value);
    };

    const handleKChange = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setKValue(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!csvFile) {
            alert("Please upload a CSV file.");
            return;
        }

        if (!columns.trim()) {
            alert("Please enter column names.");
            return;
        }

        if (!kValue || parseInt(kValue, 10) < 1) {
            alert("Please enter a valid k-anonymity value (k ≥ 1).");
            return;
        }

        const formData = new FormData();
        formData.append("file", csvFile);
        formData.append("columns", columns);
        formData.append("k", parseInt(kValue, 10));

        try {
            const response = await fetch("http://localhost:8000/input", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log(data)
        } catch (error) {
            console.log("Failed to connect to the server." + error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
                <label>Upload CSV File</label>
                <input type="file" accept=".csv" onChange={handleFileChange} />
            </div>

            <div className="form-group">
                <label>Table Column Names (comma-separated)</label>
                <input type="text" value={columns} onChange={handleColumnsChange} placeholder="e.g., name, age, address" />
            </div>

            <div className="form-group">
                <label>K-anonymity Value (k ≥ 1)</label>
                <input type="number" value={kValue} onChange={handleKChange} min="1" />
            </div>

            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
};

export default Form;
