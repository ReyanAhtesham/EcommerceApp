import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Message from "../../components/Message";
import Loader from "../../components/Loader";

import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get('payment_success');
  const sessionId = searchParams.get('session_id');

  const { 
    data: order, 
    refetch, 
    isLoading, 
    error 
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // Handle Stripe payment verification
  useEffect(() => {
    if (paymentSuccess === 'true' && sessionId && order && !order.isPaid) {
      
      const verifyPayment = async () => {
        try {
          console.log("Verifying payment with session ID:", sessionId);
          
          // Using the existing payOrder mutation with the session ID
          const result = await payOrder({ 
            orderId, 
            details: { 
              id: sessionId,
              source: 'stripe'
            } 
          }).unwrap();
          
          console.log("Payment verification result:", result);
          toast.success("Payment successful!");
          refetch();
        } catch (err) {
          console.error("Payment verification error:", err);
          toast.error(err?.data?.message || err.message || "Failed to verify payment");
        }
      };
      
      verifyPayment();
    }
  }, [paymentSuccess, sessionId, order, payOrder, orderId, refetch]);

  // Handle Stripe checkout
  const handleStripeCheckout = async () => {
    if (!order) return;
    
    try {
      console.log("Initiating checkout for order ID:", orderId);
      const res = await fetch(`/api/orders/${orderId}/stripe-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: order.orderItems }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error(error.message || "Stripe checkout failed");
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };
  
  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || "Error loading order"}</Message>;

  return (
    <div className="container flex flex-col pl-[10rem] md:flex-row pb-7">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2">${item.price}</td>
                      <td className="p-2">
                        ${(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>
          {order.isPaid ? (
            <>
            <Message variant="success">
              Paid on {new Date(order.paidAt).toLocaleString()}
            </Message>
            <br />
            </>
          ) : (
            <Message variant="danger">Not paid</Message>
          )}
          
          {order.isDelivered ? (
            <Message variant="success">
              Delivered on {new Date(order.deliveredAt).toLocaleString()}
            </Message>
          ) : (
            <Message variant="danger">Not delivered</Message>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>$ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>$ {order.totalPrice}</span>
        </div>

        {/* Payment button - only show if not paid */}
        {!order.isPaid && (
          <button
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded w-full mt-4"
            onClick={handleStripeCheckout}
            disabled={loadingPay}
          >
            {loadingPay ? "Processing..." : "Pay with Stripe"}
          </button>
        )}

        {/* Admin controls - only show for admins */}
        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 hover:bg-pink-600 text-white w-full py-2 mt-4 rounded"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;