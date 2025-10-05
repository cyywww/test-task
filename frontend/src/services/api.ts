const API_URL = "http://localhost:3000";

export const api = {
  // Profile APIs
  createProfile: async (data: unknown): Promise<unknown> => {
    const response = await fetch(`${API_URL}/profile/create-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAllProfiles: async (): Promise<unknown> => {
    const response = await fetch(`${API_URL}/profile`);
    return response.json();
  },

  // Loan APIs
  uploadCSV: async (file: File): Promise<unknown> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/loan/upload-csv`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  getAllLoans: async (): Promise<unknown> => {
    const response = await fetch(`${API_URL}/loan/all-loans`);
    return response.json();
  },

  tokenizeLoans: async (loanIds: string[]): Promise<unknown> => {
    const response = await fetch(`${API_URL}/loan/tokenize-loans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loanIds }),
    });
    return response.json();
  },

  // Dashboard APIs
  getDashboardSummary: async (): Promise<unknown> => {
    const response = await fetch(`${API_URL}/dashboard`);
    return response.json();
  },
};
