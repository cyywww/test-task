import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../services/api";

// dashboard summary (data fetched from the backend endpoint)
interface Summary {
  totalLoans: number;
  totalLoanAmount: number;
  totalTokenized: number;
  totalTokenizedAmount: number;
  activeLoans: number;
  expiredLoans: number;
}

// Each piece of data in the pie chart (has name, value, and color).
interface PieDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

// Monthly trend chart data (mocked for now).
interface PerformanceDataItem {
  month: string;
  amount: number;
  tokenized: number;
  invested: number;
}

// Single loan information
interface Loan {
  id: string;
  status: string;
  amount: number;
  tokenized: boolean;
}

export default function LoanDashboard() {
  // summary: Saves dashboard statistics.
  const [summary, setSummary] = useState<Summary | null>(null);
  // loans: Saves a list loans.
  const [loans, setLoans] = useState<Loan[]>([]);
  // loading: Saves the loading state, used to display "Loading..."
  const [loading, setLoading] = useState(true);

  // Load data on component mount, only executed once when the component is first rendered
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardData, loansData] = await Promise.all([
        api.getDashboardSummary() as Promise<Summary>,
        api.getAllLoans() as Promise<Loan[]>,
      ]);

      setSummary(dashboardData);
      setLoans(loansData.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setLoading(false);
    }
  };

  // If the data has not been loaded yet, the component directly returns a "loading" prompt.
  if (loading || !summary) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50">
        <p className="text-center text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // I don't know what is being used for investment, so I'll calculate it this way for now.
  const investedAmount = summary.totalTokenizedAmount * 0.75;

  // Preparing pie chart data
  const pieData: PieDataItem[] = [
    { name: "Total Loans", value: summary.totalLoanAmount, color: "#3b82f6" },
    {
      name: "Tokenized",
      value: summary.totalTokenizedAmount,
      color: "#10b981",
    },
    { name: "Invested", value: investedAmount, color: "#8b5cf6" },
  ];

  // Mocked monthly performance data. 
  // I don't want to leave this part of the page empty, so I'll put some mock data charts on it first.
  const performanceData: PerformanceDataItem[] = [
    { month: "January", amount: 650000, tokenized: 380000, invested: 290000 },
    { month: "February", amount: 720000, tokenized: 420000, invested: 310000 },
    { month: "March", amount: 890000, tokenized: 530000, invested: 400000 },
    { month: "April", amount: 950000, tokenized: 580000, invested: 450000 },
    { month: "May", amount: 1100000, tokenized: 670000, invested: 520000 },
    { month: "June", amount: 1240000, tokenized: 750000, invested: 580000 },
  ];

  // Format the number as Euros.
  const formatCurrency = (value: number): string => {
    return "€" + (value / 1000000).toFixed(2) + "M";
  };

  // Format the percentage value.
  const formatPercent = (value: number, total: number): string => {
    return ((value / total) * 100).toFixed(1) + "%";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Loans Dashboard</h1>

      {/* Statistics Card (4 cards)*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* card one: Loans imported */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Loans imported</p>
              <p className="text-2xl font-bold text-gray-800">
                {summary.totalLoans}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Active: {summary.activeLoans} | Expired: {summary.expiredLoans}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* card two: Total loans */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Loans</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(summary.totalLoanAmount)}
              </p>
              <p className="text-xs text-green-600 mt-1">100%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* card three: Tokenized */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tokenized</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(summary.totalTokenizedAmount)}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {formatPercent(
                  summary.totalTokenizedAmount,
                  summary.totalLoanAmount
                )}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* card four: Invested */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Invested</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(investedAmount)}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {formatPercent(investedAmount, summary.totalLoanAmount)}
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Fund distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {/* Show mouse hover tooltip */}
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Histogram */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Monthly Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value: number) =>
                  "€" + (value / 1000000).toFixed(1) + "M"
                }
              />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="amount" name="Total sum" fill="#3b82f6" />
              <Bar dataKey="tokenized" name="Tokenized" fill="#10b981" />
              <Bar dataKey="invested" name="Invested" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loans List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Loans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokenized
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No loans available. Please import loans first.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {loan.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          loan.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{loan.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.tokenized ? "✓" : "✗"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
