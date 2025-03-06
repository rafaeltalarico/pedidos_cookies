import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import ProductForm from './pages/ProductForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <AuthGuard>
            <Layout>
              <Home />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/products" element={
          <AuthGuard>
            <Layout>
              <Products />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/products/new" element={
          <AuthGuard allowedUserTypes={['franchisor']}>
            <Layout>
              <ProductForm />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/products/edit/:id" element={
          <AuthGuard allowedUserTypes={['franchisor']}>
            <Layout>
              <ProductForm />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/cart" element={
          <AuthGuard allowedUserTypes={['franchisee']}>
            <Layout>
              <Cart />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/orders" element={
          <AuthGuard>
            <Layout>
              <Orders />
            </Layout>
          </AuthGuard>
        } />
        <Route path="/orders/:id" element={
          <AuthGuard>
            <Layout>
              <OrderDetails />
            </Layout>
          </AuthGuard>
        } />
      </Routes>
    </Router>
  );
}

export default App;