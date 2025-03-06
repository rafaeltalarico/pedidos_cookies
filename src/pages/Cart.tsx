import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, submitOrder, isLoading, error } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleQuantityChange = (productId: string, value: number) => {
    updateQuantity(productId, Math.max(1, value));
  };

  const handleSubmitOrder = async () => {
    if (!user) return;
    
    const newOrderId = await submitOrder(user.id);
    if (newOrderId) {
      setOrderSuccess(true);
      setOrderId(newOrderId);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingBag size={32} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado com Sucesso!</h2>
          <p className="text-gray-600 mb-6">
            Seu pedido foi enviado para a franqueadora e está sendo processado.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Ver Detalhes do Pedido
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Carrinho de Pedidos</h1>
        <button
          onClick={() => navigate('/products')}
          className="text-indigo-600 flex items-center hover:text-indigo-800"
        >
          <ArrowLeft size={18} className="mr-1" />
          Continuar Comprando
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Seu carrinho está vazio.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Ver Produtos
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-700">Produto</th>
                    <th className="text-center py-3 px-4 text-gray-700">Quantidade</th>
                    <th className="text-right py-3 px-4 text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.product.id} className="border-b">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{item.product.name}</p>
                          <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                            className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm">{error}</div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={clearCart}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Limpar Carrinho
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Enviando...' : 'Finalizar Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;