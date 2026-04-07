import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import Dashboard from './pages/admin/Dashboard';
import CategoryList from './pages/admin/CategoryList';
import AddCategory from './pages/admin/AddCategory';
import ProductList from './pages/admin/ProductList';
import AddProduct from './pages/admin/AddProduct';
import OrderList from './pages/admin/OrderList';
import OrderDetail from './pages/admin/OrderDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* User protected routes */}
        <Route path="/cart" element={
          <ProtectedRoute><Cart /></ProtectedRoute>
        } />
        <Route path="/order-success" element={
          <ProtectedRoute><OrderSuccess /></ProtectedRoute>
        } />

        {/* Admin protected routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute adminOnly><CategoryList /></ProtectedRoute>
        } />
        <Route path="/admin/categories/add" element={
          <ProtectedRoute adminOnly><AddCategory /></ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute adminOnly><ProductList /></ProtectedRoute>
        } />
        <Route path="/admin/products/add" element={
          <ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute adminOnly><OrderList /></ProtectedRoute>
        } />
        <Route path="/admin/orders/:id" element={
          <ProtectedRoute adminOnly><OrderDetail /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;