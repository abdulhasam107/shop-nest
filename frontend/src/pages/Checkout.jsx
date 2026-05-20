import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    try {
      setLoading(true);

      // ✅ FIXED: using productId (NOT _id)
      const formattedItems = cartItems.map((item) => ({
        productid: item.productId,   // 🔥 IMPORTANT FIX
        quantity: item.qty,
        price: item.price,
      }));

      const token = user?.token;

      if (!token) {
        alert('Please login again');
        navigate('/login');
        return;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: formattedItems,
          address,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(clearCart());
        navigate('/ordersuccess');
      } else {
        alert(data.message || 'Order failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (!cartItems.length) {
      alert('Cart is empty');
      return;
    }

    if (
      !address.fullName ||
      !address.street ||
      !address.city ||
      !address.postalCode ||
      !address.country
    ) {
      alert('Please fill all fields');
      return;
    }

    placeOrder();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">

          <h3>Shipping Address</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Street"
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Country"
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
          />

          <div className="checkout-summary">
            <h4>Total: ₹{totalPrice.toFixed(2)}</h4>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;