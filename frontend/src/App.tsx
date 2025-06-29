import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import FundDetails from "./pages/FundDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SavedFunds from "./pages/SavedFunds";

function AppContent() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Routes>
          {/* ✅ Fix root logic: show Dashboard only for unauthenticated users */}
          <Route path="/" element={user ? <Home /> : <Dashboard />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />

          <Route path="/fund/:schemeCode" element={<FundDetails />} />

          <Route
            path="/saved-funds"
            element={
              <ProtectedRoute>
                <SavedFunds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
