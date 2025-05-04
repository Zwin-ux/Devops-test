import React, { useState } from "react";

function Orders() {
  // Mock order data - this would normally come from an API
  const [orders, setOrders] = useState([
    { 
      id: "ORD-1001", 
      date: "2025-05-01", 
      status: "Delivered", 
      total: 109.97,
      items: [
        { id: 1, name: "Cloud Storage Plus", price: 29.99, quantity: 2 },
        { id: 2, name: "Virtual Server Pro", price: 49.99, quantity: 1 }
      ]
    },
    { 
      id: "ORD-1002", 
      date: "2025-05-03", 
      status: "Processing", 
      total: 79.99,
      items: [
        { id: 3, name: "Database Hosting", price: 39.99, quantity: 2 }
      ]
    }
  ]);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
        <p className="text-gray-600 mt-2">View and track your order history</p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">No orders yet</h2>
          <p className="mt-2 text-gray-600">When you place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                          <svg className={`ml-1 h-5 w-5 transform ${expandedOrder === order.id ? 'rotate-180' : ''} transition-transform duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                                  </div>
                                  <span className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                              <span className="text-sm font-medium text-gray-900">Total</span>
                              <span className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
