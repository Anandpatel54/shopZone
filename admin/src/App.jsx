import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddEditProduct from './pages/AddEditProduct';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminLayout() {
  return (
    <div className="min-h-screen flex" style={{backgroundColor:'#f1f5f9'}}>
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Topbar />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<AddEditProduct />} />
            <Route path="/products/edit/:id" element={<AddEditProduct />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
      <Route path="/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
