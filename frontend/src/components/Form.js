import { useState } from "react";
import FileUpload from "./FileUpload";
import ErrorMessage from "./ErrorMessage";
import ProcessButton from "./ProcessButton";
import RedactColumn from "./RedactColumn";
import NormalizeColumn from "./NormalizeColumn";
import RedactDate from "./RedactDate";
import CSVPreview from "./CSVPreview";
import DownloadSection from "./DownloadSection";
import KAnonymity from "./KAnonymity";
import IDiversity from "./IDiversity";
import RedactZip from "./RedactZip";
import MInvariance from "./MInvarience";
import SyntheticNumCol from "./SyntheticNumCol";
import SyntheticCatCol from "./SyntheticCatCol";
import { SERVER_URL } from "../constants";

const Form = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [redactColumn, setRedactColumn] = useState("");
    const [normalizeColumn, setNormalizeColumn] = useState("");
    const [redactZip, setRedactZip] = useState("");
    const [fileName, setFileName] = useState("");
    const [findK, setFindK] = useState(false);
    const [syntheticCol, setSyntheticCol] = useState("")
    const [syntheticll, setSyntheticll] = useState(0)
    const [syntheticul, setSyntheticul] = useState(0)
    const [syntheticdt, setSyntheticdt] = useState("int")

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setCsvFile(file);
        setFileName(file.name);
        setError("");
    };

    const parseCSV = (csvString) => {
        const rows = csvString.split("\n").map(row => row.split(","));
        setTableData(rows);
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(SERVER_URL+"/input", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Server responded with an error");

            const result = await response.json();
            setDownloadUrl(URL.createObjectURL(new Blob([result.file], { type: "text/csv" })));
            parseCSV(result.file);
            setFindK(true);
        } catch (error) {
            setError("Failed to process the file. Please try again.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!csvFile) return setError("Please upload a CSV file.");
        setIsLoading(true);
        await uploadFile(csvFile);
        setIsLoading(false);
    };

    const processColumn = async (url, column) => {
        const formData = new FormData();
        formData.append("file_name", fileName);
        formData.append("column", column);

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Server responded with an error");

            const result = await response.json();
            setDownloadUrl(URL.createObjectURL(new Blob([result.file], { type: "text/csv" })));
            parseCSV(result.file);
            setFindK(!findK)
        } catch (error) {
            setError("Failed to process the file. Please try again.");
        }
    };

    const redactDate = async (options) => {
        const formData = new FormData();
        formData.append("file_name", fileName);
        formData.append("column", options.column);
        formData.append("redactDay", options.redact_day);
        formData.append("redactMonth", options.redact_month);
        formData.append("redactYear", options.redact_year);

        try {
            const response = await fetch(SERVER_URL+"/redactdate", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Server responded with an error");

            const result = await response.json();
            setDownloadUrl(URL.createObjectURL(new Blob([result.file], { type: "text/csv" })));
            parseCSV(result.file);
            setFindK(!findK)
        } catch (error) {
            setError("Failed to process the file. Please try again.");
        }
    };

    const handleSynthesizeNumCol = async(options) => {
        const formData = new FormData();
        formData.append("file_name", fileName);
        formData.append("column", options.column);
        formData.append("lower", options.lower);
        formData.append("upper", options.upper);
        formData.append("datatype", options.datatype);

        try {
            const response = await fetch(SERVER_URL+"/synnumcol", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Server responded with an error");

            const result = await response.json();
            setDownloadUrl(URL.createObjectURL(new Blob([result.file], { type: "text/csv" })));
            parseCSV(result.file);
            setFindK(!findK)
        } catch (error) {
            setError("Failed to process the file. Please try again.");
        }
    }

    const handleSynthesizeCatCol = async(options) => {
        const formData = new FormData();
        formData.append("file_name", fileName);
        formData.append("column", options.column);
        formData.append("string_list",options.categories);

        try {
            const response = await fetch(SERVER_URL+"/syncatcol", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Server responded with an error");

            const result = await response.json();
            setDownloadUrl(URL.createObjectURL(new Blob([result.file], { type: "text/csv" })));
            parseCSV(result.file);
            setFindK(!findK)
        } catch (error) {
            setError("Failed to process the file. Please try again.");
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div className="bg-white rounded-xl shadow-lg p-6 w-2/3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FileUpload handleFileChange={handleFileChange} />
                        <ErrorMessage error={error} />
                        <ProcessButton isLoading={isLoading} />
                    </form>
                    <RedactColumn redactColumn={redactColumn} setRedactColumn={setRedactColumn} handleRedact={() => processColumn(SERVER_URL+"/redactcol", redactColumn)} />
                    <NormalizeColumn normalizeColumn={normalizeColumn} setNormalizeColumn={setNormalizeColumn} handleNormalize={() => processColumn(SERVER_URL+"/groupcol", normalizeColumn)} />
                    <RedactZip redactzip={redactZip} setRedactzip={setRedactZip} handleRedact={() => processColumn(SERVER_URL+"/redactzip", redactZip)} />
                    <RedactDate handleRedact={redactDate} />
                    <SyntheticNumCol handleSynthesize={handleSynthesizeNumCol} />
                    <SyntheticCatCol handleSynthesize={handleSynthesizeCatCol} />
                </div>
                <div className="flex flex-col space-y-4">
                    <KAnonymity file_name={fileName} findK={findK} />
                    <IDiversity file_name={fileName} findIDiversity={findK} />
                    <MInvariance file_name={fileName} findMInvariance={findK} />
                </div>
            </div>
            <div className="mx-auto">
                <CSVPreview tableData={tableData} />
                <DownloadSection downloadUrl={downloadUrl} />
            </div>
        </div>
    );
};

export default Form;
