import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Plus, Edit, ShoppingCart } from 'lucide-react';

const Products: React.FC = () => {
  const { products, fetchProducts, isLoading } = useProductStore();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const isFranchisor = user?.user_type === 'franchisor';

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, value)
    }));
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const quantity = quantities[productId] || 1;
    
    if (product) {
      addItem(product, quantity);
      
      // Show added confirmation
      setAddedToCart(prev => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [productId]: false }));
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        {isFranchisor && (
          <Link 
            to="/products/new" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Novo Produto
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Nenhum produto cadastrado.</p>
          {isFranchisor && (
            <Link 
              to="/products/new" 
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Cadastrar Primeiro Produto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-sm text-gray-500 mb-3">SKU: {product.sku}</p>
                  </div>
                  {isFranchisor && (
                    <Link 
                      to={`/products/edit/${product.id}`} 
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={18} />
                    </Link>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{product.description || 'Sem descrição'}</p>
                
                {!isFranchisor && (
                  <div className="mt-4">
                    <div className="flex items-center mb-3">
                      <label htmlFor={`quantity-${product.id}`} className="mr-3 text-sm text-gray-600">
                        Quantidade:
                      </label>
                      <input
                        id={`quantity-${product.id}`}
                        type="number"
                        min="1"
                        value={quantities[product.id] || 1}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                        className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center"
                      />
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
                        addedToCart[product.id]
                          ? 'bg-green-500 text-white'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      {addedToCart[product.id] ? 'Adicionado!' : 'Adicionar ao Carrinho'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;