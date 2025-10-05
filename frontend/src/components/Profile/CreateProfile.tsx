import { useState, type ChangeEvent } from "react";
import { api } from "../../services/api";

interface FormData {
  name: string;
  country: string;
  foundingYear: number;
  totalPortfolio: number;
  creditRiskScore: number;
  productType: "Mortgage" | "Private" | "Business";
  websiteUrl: string;
  contacts: string;
}

export default function CreateProfileForm() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    country: "",
    foundingYear: new Date().getFullYear(),
    totalPortfolio: 0,
    creditRiskScore: 0,
    productType: "Mortgage",
    websiteUrl: "",
    contacts: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    try {
      await api.createProfile(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        // reset form
        setFormData({
          name: "",
          country: "",
          foundingYear: new Date().getFullYear(),
          totalPortfolio: 0,
          creditRiskScore: 0,
          productType: "Mortgage",
          websiteUrl: "",
          contacts: "",
        });
      }, 3000);
    } catch (err) {
      setError("Failed to create profile: " + (err as Error).message);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create a credit institution profile
      </h2>

      {submitted && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Profile created successfully!
        </div>
      )}

      {error && (
      <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sweden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founding Year
            </label>
            <input
              type="number"
              name="foundingYear"
              value={formData.foundingYear}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Portfolio (EUR)
            </label>
            <input
              type="number"
              name="totalPortfolio"
              value={formData.totalPortfolio}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Risk Score
            </label>
            <input
              type="number"
              name="creditRiskScore"
              value={formData.creditRiskScore}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Type
          </label>
          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Mortgage">Mortgage</option>
            <option value="Private">Private</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contacts
          </label>
          <textarea
            name="contacts"
            value={formData.contacts}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email, phone, address..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Create profile
        </button>
      </div>
    </div>
  );
}
