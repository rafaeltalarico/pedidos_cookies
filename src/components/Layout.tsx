import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShoppingCart, Package, LogOut, User, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  const isFranchisor = user.user_type === 'franchisor';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Franchise Order System</Link>
          <div className="flex items-center space-x-4">
            {isFranchisor ? (
              <>
                <Link to="/products" className="flex items-center hover:text-indigo-200">
                  <Package size={20} className="mr-1" />
                  <span>Products</span>
                </Link>
                <Link to="/orders" className="flex items-center hover:text-indigo-200">
                  <BarChart3 size={20} className="mr-1" />
                  <span>Orders</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/products" className="flex items-center hover:text-indigo-200">
                  <Package size={20} className="mr-1" />
                  <span>Products</span>
                </Link>
                <Link to="/cart" className="flex items-center hover:text-indigo-200">
                  <ShoppingCart size={20} className="mr-1" />
                  <span>Cart</span>
                </Link>
                <Link to="/orders" className="flex items-center hover:text-indigo-200">
                  <BarChart3 size={20} className="mr-1" />
                  <span>My Orders</span>
                </Link>
              </>
            )}
            <div className="flex items-center hover:text-indigo-200">
              <User size={20} className="mr-1" />
              <span>{user.full_name || user.email}</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center hover:text-indigo-200"
            >
              <LogOut size={20} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Franchise Order System
        </div>
      </footer>
    </div>
  );
};

export default Layout;