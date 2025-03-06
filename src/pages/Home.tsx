import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShoppingCart, Package, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuthStore();
  const isFranchisor = user?.user_type === 'franchisor';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          Bem-vindo ao Pedido Certo
        </h1>
        <p className="text-gray-600 mb-6">
        Conectando franqueados e franqueadora com eficiência, agilidade e controle total dos pedidos. Simplifique a gestão e impulsione seu negócio!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {isFranchisor ? (
            <>
              <Link to="/products" className="bg-white border border-indigo-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Package size={24} className="text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Gerenciar Produtos</h2>
                </div>
                <p className="text-gray-600">Cadastre, edite e gerencie os produtos disponíveis para os franqueados.</p>
              </Link>
              
              <Link to="/orders" className="bg-white border border-indigo-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <BarChart3 size={24} className="text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Gerenciar Pedidos</h2>
                </div>
                <p className="text-gray-600">Visualize e atualize o status dos pedidos feitos pelos franqueados.</p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/products" className="bg-white border border-indigo-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Package size={24} className="text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Ver Produtos</h2>
                </div>
                <p className="text-gray-600">Explore os produtos disponíveis para pedido.</p>
              </Link>
              
              <Link to="/cart" className="bg-white border border-indigo-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <ShoppingCart size={24} className="text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Carrinho</h2>
                </div>
                <p className="text-gray-600">Visualize e finalize seus pedidos.</p>
              </Link>
              
              <Link to="/orders" className="bg-white border border-indigo-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <BarChart3 size={24} className="text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Meus Pedidos</h2>
                </div>
                <p className="text-gray-600">Acompanhe o status dos seus pedidos.</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;