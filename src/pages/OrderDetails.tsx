import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { OrderWithItems } from '../lib/supabase';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrder, updateOrderStatus, isLoading, error } = useOrderStore();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const isFranchisor = user?.user_type === 'franchisor';

  useEffect(() => {
    const loadOrder = async () => {
      if (id) {
        const orderData = await getOrder(id);
        setOrder(orderData);
      }
    };
    
    loadOrder();
  }, [id, getOrder]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock size={16} className="mr-1" />
            Pendente
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle size={16} className="mr-1" />
            Finalizado
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle size={16} className="mr-1" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <AlertCircle size={16} className="mr-1" />
            Desconhecido
          </span>
        );
    }
  };

  const handleStatusUpdate = async (status: 'pending' | 'completed' | 'cancelled') => {
    if (!id) return;
    
    setStatusUpdating(true);
    await updateOrderStatus(id, status);
    const updatedOrder = await getOrder(id);
    setOrder(updatedOrder);
    setStatusUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Voltar para Pedidos
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Pedido não encontrado.</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Voltar para Pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="text-indigo-600 flex items-center hover:text-indigo-800 mr-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Detalhes do Pedido</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">ID do Pedido</p>
              <p className="text-lg font-medium text-gray-800">{order.id}</p>
            </div>
            <div className="mt-4 md:mt-0">
              {getStatusBadge(order.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Data do Pedido</p>
              <p className="text-gray-800">{formatDate(order.created_at)}</p>
            </div>
            {order.completed_at && (
              <div>
                <p className="text-sm text-gray-500">Data de Finalização</p>
                <p className="text-gray-800">{formatDate(order.completed_at)}</p>
              </div>
            )}
            {order.processing_time && (
              <div>
                <p className="text-sm text-gray-500">Tempo de Processamento</p>
                <p className="text-gray-800">{order.processing_time}</p>
              </div>
            )}
            {isFranchisor && order.franchisee && (
              <div>
                <p className="text-sm text-gray-500">Franqueado</p>
                <p className="text-gray-800">{order.franchisee.full_name || order.franchisee.email}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Itens do Pedido</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-700">Produto</th>
                    <th className="text-center py-3 px-4 text-gray-700">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{item.product?.name}</p>
                          <p className="text-sm text-gray-500">SKU: {item.product?.sku}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-800">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {(isFranchisor || (!isFranchisor && order.status === 'pending')) && (
            <div className="mt-6 pt-6 border-t">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ações</h2>
              <div className="flex flex-wrap gap-3">
                {isFranchisor && order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={statusUpdating}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {statusUpdating ? 'Atualizando...' : 'Marcar como Finalizado'}
                  </button>
                )}
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={statusUpdating}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {statusUpdating ? 'Atualizando...' : 'Cancelar Pedido'}
                  </button>
                )}
                {isFranchisor && order.status === 'cancelled' && (
                  <button
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={statusUpdating}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {statusUpdating ? 'Atualizando...' : 'Reativar Pedido'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;