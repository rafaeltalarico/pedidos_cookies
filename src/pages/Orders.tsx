import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Orders: React.FC = () => {
  const { orders, isLoading, error, fetchOrders, getAverageProcessingTime } = useOrderStore();
  const { user } = useAuthStore();
  const [averageTime, setAverageTime] = useState<string | null>(null);
  
  const isFranchisor = user?.user_type === 'franchisor';
  
  useEffect(() => {
    if (user) {
      fetchOrders(isFranchisor, user.id);
    }
  }, [fetchOrders, isFranchisor, user]);
  
  useEffect(() => {
    const loadAverageTime = async () => {
      const time = await getAverageProcessingTime();
      setAverageTime(time);
    };
    
    loadAverageTime();
  }, [getAverageProcessingTime]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={14} className="mr-1" />
            Pendente
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Finalizado
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={14} className="mr-1" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle size={14} className="mr-1" />
            Desconhecido
          </span>
        );
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };
  
  const formatInterval = (interval: string | null) => {
    if (!interval) return 'N/A';
    
    // Parse PostgreSQL interval format
    const matches = interval.match(/(\d+):(\d+):(\d+)/);
    if (!matches) return interval;
    
    const hours = parseInt(matches[1]);
    const minutes = parseInt(matches[2]);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} minutos`;
    }
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
      <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
        <p>Erro ao carregar pedidos: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {isFranchisor ? 'Todos os Pedidos' : 'Meus Pedidos'}
        </h1>
        {averageTime && (
          <div className="bg-indigo-50 p-3 rounded-md text-indigo-700 text-sm inline-flex items-center">
            <Clock size={16} className="mr-2" />
            Tempo médio de processamento: <span className="font-semibold ml-1">{formatInterval(averageTime)}</span>
          </div>
        )}
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhum pedido encontrado</h2>
          {!isFranchisor && (
            <p className="text-gray-600 mb-6">Faça seu primeiro pedido para começar.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID do Pedido
                  </th>
                  {isFranchisor && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Franqueado
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Itens
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tempo de Processamento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.substring(0, 8)}...
                    </td>
                    {isFranchisor && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.franchisee?.full_name || order.franchisee?.email || 'Desconhecido'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatInterval(order.processing_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;