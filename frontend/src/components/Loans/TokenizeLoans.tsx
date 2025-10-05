import { useState, useEffect } from "react";
import { api } from "../../services/api";

interface Loan {
  id: string;
  amount: number;
  status: string;
  riskGroup: string;
  tokenized: boolean;
}

interface Result {
  success: boolean;
  message: string;
}

export default function TokenizeLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const data = await api.getAllLoans() as Loan[];
      setLoans(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load loans:", error);
      setLoading(false);
    }
  };

  const handleSelectLoan = (loanId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedLoans((prev) =>
      prev.includes(loanId)
        ? prev.filter((id) => id !== loanId)
        : [...prev, loanId]
    );
  };

  const handleSelectAll = () => {
    const availableLoans = loans
      .filter((loan) => !loan.tokenized && loan.status === "ACTIVE")
      .map((loan) => loan.id);

    if (selectedLoans.length === availableLoans.length) {
      setSelectedLoans([]);
    } else {
      setSelectedLoans(availableLoans);
    }
  };

  const handleTokenize = async () => {
    if (selectedLoans.length === 0) {
      setResult({ success: false, message: "Please select at least one loan!" });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      await Promise.all(
        selectedLoans.map(loanId => 
          api.tokenizeLoans([loanId])
        )
      );

      const totalAmount = loans
        .filter((loan) => selectedLoans.includes(loan.id))
        .reduce((sum, loan) => sum + loan.amount, 0);

      setResult({
        success: true,
        message: `${selectedLoans.length} loans have been tokenized, amounted €${totalAmount.toLocaleString()}`,
      });

      await loadLoans();
      setSelectedLoans([]);
    } catch (error) {
      setResult({
        success: false,
        message: "Tokenization failed: " + (error as Error).message,
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-600">Loading loans...</p>
      </div>
    );
  }

  const availableLoans = loans.filter(
    (loan) => !loan.tokenized && loan.status === "ACTIVE"
  );
  const selectedAmount = loans
    .filter((loan) => selectedLoans.includes(loan.id))
    .reduce((sum, loan) => sum + loan.amount, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tokenize loans</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Number of loans can be tokenized</p>
          <p className="text-2xl font-bold text-blue-900">
            {availableLoans.length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 mb-1">Selected loans</p>
          <p className="text-2xl font-bold text-green-900">
            {selectedLoans.length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Selected amount</p>
          <p className="text-2xl font-bold text-purple-900">
            €{selectedAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {result && (
        <div
          className={`mb-6 p-4 rounded-md ${
            result.success
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Select the loan to tokenize</h3>
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {selectedLoans.length === availableLoans.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {loans.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No loans available. Please import loans first.
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="w-12 px-6 py-3 text-left"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokenized</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => {
                  const isDisabled = loan.tokenized || loan.status === "EXPIRED";
                  const isSelected = selectedLoans.includes(loan.id);

                  return (
                    <tr 
                      key={loan.id}
                      className={`${isDisabled ? "opacity-50" : "hover:bg-gray-50 cursor-pointer"}`}
                      onClick={() => !isDisabled && handleSelectLoan(loan.id)}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (!isDisabled) {
                              handleSelectLoan(loan.id);
                            }
                          }}
                          disabled={isDisabled}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {loan.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        €{loan.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            loan.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Risk {loan.riskGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {loan.tokenized ? (
                          <span className="text-green-600 font-semibold">✓ Tokenized</span>
                        ) : (
                          <span className="text-gray-400">Not Tokenized</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Attention: </span> Untokenized loans with an ACTIVE status can be tokenized.
        </p>
      </div>

      <button
        onClick={handleTokenize}
        disabled={selectedLoans.length === 0 || processing}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          selectedLoans.length === 0 || processing
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {processing
          ? "Processing..."
          : `Tokenize the selected ${selectedLoans.length} loans`}
      </button>
    </div>
  );
}