import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/api';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/admin/all`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setCancelModal({ isOpen: true, orderId });
  };

  const confirmCancelOrder = async () => {
    const orderId = cancelModal.orderId;
    setCancelModal({ isOpen: false, orderId: null });
    
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Order cancelled successfully');
        fetchOrders(); // Refresh the list
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Error cancelling order');
    }
  };

  const deleteOrder = async (orderId) => {
    setDeleteModal({ isOpen: true, orderId });
  };

  const confirmDeleteOrder = async () => {
    const orderId = deleteModal.orderId;
    setDeleteModal({ isOpen: false, orderId: null });
    
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Order deleted successfully');
        fetchOrders(); // Refresh the list
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to delete order');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error('Error deleting order');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Order Management</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-text-muted">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-surface-500 p-4 rounded-lg border border-surface-400/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-primary font-medium">
                    Order ID: {order._id}
                  </p>
                  <p className="text-text-muted">
                    User: {order.userId?.firstName} {order.userId?.lastName} ({order.userId?.email})
                  </p>
                  <p className="text-text-muted">
                    Total: {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(order.totalPrice)}
                  </p>
                  <p className="text-text-muted">
                    Status: <span className={order.status === 'active' ? 'text-green-400' : 'text-red-400'}>{order.status}</span>
                  </p>
                  <p className="text-text-muted">
                    Created: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.bookings && order.bookings.length > 0 && (
                    <div className="mt-2">
                      <p className="text-text-muted">Bookings:</p>
                      <ul className="list-disc list-inside text-sm text-text-muted">
                        {order.bookings.map((booking) => (
                          <li key={booking._id}>
                            {booking.showtimeId?.movieId?.title} - {new Date(booking.showtimeId?.startTime).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  {order.status === 'active' && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded mr-2"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="px-3 py-1 bg-red-800 hover:bg-red-900 text-white rounded"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelModal.isOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        onClose={() => setCancelModal({ isOpen: false, orderId: null })}
        onConfirm={confirmCancelOrder}
        confirmText="Cancel Order"
        theme="default"
      />

      {/* Delete Order Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        title="Delete Order"
        message="Are you sure you want to permanently delete this order? This action cannot be undone."
        onClose={() => setDeleteModal({ isOpen: false, orderId: null })}
        onConfirm={confirmDeleteOrder}
        confirmText="Delete Order"
        theme="default"
      />
    </div>
  );
}