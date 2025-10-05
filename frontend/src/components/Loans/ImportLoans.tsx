import { useState, type ChangeEvent } from "react";
import { api } from "../../services/api";

export default function CSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [previewData, setPreviewData] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setUploadStatus("");

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split("\n").slice(0, 6);
        setPreviewData(rows);
      };
      reader.readAsText(selectedFile);
    } else {
      setUploadStatus("Please select a valid CSV file");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a CSV file.");
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading...");

    try {
      const result = await api.uploadCSV(file) as { count: number };
      setUploading(false);
      setUploadStatus(
        `Upload success! ${result.count} loans have been imported!`
      );
      setFile(null);
      setPreviewData([]);
    } catch (error) {
      setUploading(false);
      setUploadStatus("Upload failed: " + (error as Error).message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Import loans</h2>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-900 mb-2">CSV requirement:</h3>
        <p className="text-sm text-blue-800 mb-2">
          Each row must include: loan_id, status, amount, payment_schedule,
          interest_rate, ltv, risk_group, agreement_url
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="text-gray-600">
              <svg
                className="mx-auto h-12 w-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm">
                {file ? file.name : "Click to select or drag and drop a CSV file here."}
              </p>
            </div>
          </label>
        </div>

        {previewData.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2 text-gray-700">Data preview:</h3>
            <div className="overflow-x-auto">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {previewData.join("\n")}
              </pre>
            </div>
          </div>
        )}

        {uploadStatus && (
          <div
            className={`p-4 rounded-md ${
              uploadStatus.includes("success")
                ? "bg-green-100 border border-green-400 text-green-700"
                : uploadStatus.includes("failed")
                ? "bg-red-100 border border-red-400 text-red-700"
                : "bg-blue-100 border border-blue-400 text-blue-700"
            }`}
          >
            {uploadStatus}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            !file || uploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload CSV file"}
        </button>
      </div>
    </div>
  );
}