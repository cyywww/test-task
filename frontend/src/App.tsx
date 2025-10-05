import { useState } from 'react';
import CreateProfileForm from './components/Profile/CreateProfile.tsx';
import CSVImport from './components/Loans/ImportLoans.tsx';
import TokenizeLoans from './components/Loans/TokenizeLoans.tsx';
import LoanDashboard from './components/Dashboard/Dashboard.tsx';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Headers */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'dashboard'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'profile'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Create Profile
              </button>
              <button
                onClick={() => setCurrentView('import')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'import'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Import Loans
              </button>
              <button
                onClick={() => setCurrentView('tokenize')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'tokenize'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Tokenize Loans
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="py-10">
        {currentView === 'dashboard' && <LoanDashboard />}
        {currentView === 'profile' && <CreateProfileForm />}
        {currentView === 'import' && <CSVImport />}
        {currentView === 'tokenize' && <TokenizeLoans />}
      </main>
    </div>
  );
}

export default App;