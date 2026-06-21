'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../../../redux/cartSlice'; 
import { ArrowLeft, Minus, Plus, X, Tag, Layers, RefreshCcw, ShieldCheck, Truck, MapPin } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  
  // --- HYDRATION FIX ---
  // Tells Next.js to wait for the browser to load before rendering the cart details
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- REDUX STORE ---
  const cartItems = useSelector((state) => state.cart.items) || [];
  const dispatch = useDispatch();

  // --- LOCAL STATES ---
  const [token, setToken] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failed' | 'verifying'

  const API_BASE = '/api/user';

  // --- 1. INITIALIZE & FETCH ADDRESSES ---
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchAddresses(storedToken);
    }
  }, []);

  const fetchAddresses = async (authToken) => {
    try {
      const res = await fetch(`${API_BASE}/addresses`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      const fetchedAddresses = data.data || data || [];
      
      setAddresses(fetchedAddresses);
      // Auto-select default address or the first one
      if (fetchedAddresses.length > 0) {
        const defaultAddr = fetchedAddresses.find(a => a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : fetchedAddresses[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  // --- 2. VERIFY PAYMENT (If returning from PhonePe) ---
  useEffect(() => {
    const txnId = searchParams.get('merchantTransactionId');

    if (txnId && token) {
      setPaymentStatus('verifying');
      verifyPayment(txnId);
    }
  }, [searchParams, token]);

  const verifyPayment = async (merchantTransactionId) => {
    try {
      const res = await fetch(`/api/phonepe/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ merchantTransactionId })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setPaymentStatus('failed');
    }
  };

  // --- 3. CREATE ORDER & PROCEED TO PAYMENT ---
  const handleCheckout = async () => {
    if (!token) {
      alert("Please login to proceed to checkout.");
      router.push('/login');
      return;
    }
    if (!selectedAddressId) {
      alert("Please select a delivery address or add one in your profile.");
      return;
    }

    setIsCheckingOut(true);
    try {
      // 1. Format the cart items to match the API exactly
      const formattedItems = cartItems.map(item => ({
        productId: Number(item.id) || item.productId, 
        quantity: Number(item.quantity),
        size: item.size?.toString() || "",
        color: item.color || ""
      }));

      // 2. Call the Create Order API
      const res = await fetch(`/api/phonepe/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          addressId: Number(selectedAddressId), 
          items: formattedItems 
        })
      });
      
      // 3. Read the response text FIRST to catch HTML errors gracefully
      const responseText = await res.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Status ${res.status}: ${responseText.substring(0, 100)}...`);
      }

      // 4. Handle Backend Errors
      if (!res.ok || !data.success) {
        throw new Error(data.message || `Backend rejected the request (Status ${res.status})`);
      }

      // 5. Redirect on Success
      const paymentUrl = data.data?.redirectUrl || data.redirectUrl || data.url; 
      if (paymentUrl) {
        window.location.href = paymentUrl; // Redirect to PhonePe
      } else {
        alert("Order created, but payment URL not found in response.");
      }
      
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(error.message || "Something went wrong during checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // --- CART HANDLERS ---
  const handleUpdateQuantity = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = Math.floor(subtotal * 0.1); // Assuming 10% discount for demo
  const total = subtotal - discount;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- PREVENT HYDRATION MISMATCH ---
  if (!isMounted) {
    // Return empty div with same structure to prevent flicker
    return <div className="min-h-screen bg-white font-sans text-black pb-20" />; 
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-4">
            HOME / CART
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">YOUR CART</h1>
              <p className="text-sm text-gray-500 mt-1">{totalItems} Items</p>
            </div>
            <Link href="/shop" className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors">
              <ArrowLeft size={16} strokeWidth={2} className="mr-2" /> CONTINUE SHOPPING
            </Link>
          </div>
        </div>

        {/* Payment Status Messages */}
        {paymentStatus === 'verifying' && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-sm flex items-center gap-2">
            <RefreshCcw size={16} className="animate-spin" /> Verifying your payment, please wait...
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 font-semibold text-sm">
            Payment successful! Your order has been placed.
          </div>
        )}
        {paymentStatus === 'failed' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 font-semibold text-sm">
            Payment failed or could not be verified. Please try again or contact support.
          </div>
        )}

        {/* Main Grid: Cart Items (Left) + Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 border border-gray-200">
            {cartItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-6 gap-6 relative">
                    
                    {/* Image & Details */}
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#f9f9f9] flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-bold uppercase tracking-wide">{item.name}</h3>
                        {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                        <p className="text-sm font-bold mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Quantity & Price Controls */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 sm:gap-12 mt-4 sm:mt-0">
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 w-[100px]">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="px-3 py-2 text-gray-500 hover:text-black transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex-1 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="px-3 py-2 text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-sm font-bold w-[70px] text-right">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors sm:absolute sm:top-6 sm:right-6 lg:static"
                        aria-label="Remove item"
                      >
                        <X size={20} strokeWidth={1.5} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 font-medium">Your cart is currently empty.</div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-[#f8f8f8] p-8 sticky top-8 border border-gray-200">
            <h2 className="text-base font-bold uppercase tracking-wide mb-6">ORDER SUMMARY</h2>
            
            <div className="flex flex-col gap-4 text-sm mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} Items)</span>
                <span className="font-semibold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-black uppercase">Free</span>
              </div>
              {discount > 0 && cartItems.length > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="font-semibold text-[#22c55e]">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black">₹{total > 0 ? total.toLocaleString('en-IN') : 0}</span>
            </div>

            {/* Address Selection Area */}
            {cartItems.length > 0 && (
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">
                  <MapPin size={14} /> DELIVER TO:
                </label>
                {addresses.length > 0 ? (
                  <select 
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full border border-gray-300 bg-white p-3 text-sm outline-none focus:border-black cursor-pointer"
                  >
                    <option value="" disabled>Select Delivery Address</option>
                    {addresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label ? `${addr.label} - ` : ''} {addr.line1}, {addr.city} - {addr.pincode}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-gray-500">
                    No address found. <Link href="/profile" className="text-black border-b border-black font-semibold">Add one in Profile</Link>.
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCheckout}
                className={`w-full text-white text-[11px] font-black uppercase tracking-widest py-4 transition-colors flex justify-center items-center gap-2 ${
                  cartItems.length === 0 || isCheckingOut || (!selectedAddressId && addresses.length > 0) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-black hover:bg-gray-800 active:scale-[0.98]'
                }`}
                disabled={cartItems.length === 0 || isCheckingOut}
              >
                {isCheckingOut ? 'PROCESSING...' : 'PAY WITH PHONEPE'}
              </button>
              
              <button className="w-full border border-gray-300 bg-transparent text-black text-[11px] font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors">
                <Tag size={16} strokeWidth={2} /> APPLY COUPON
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Trust Badges */}
        <div className="mt-20 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          <div className="p-8 flex items-start gap-4">
            <Layers className="text-black shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Premium Quality</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">High grade raw materials<br/>for maximum durability.</p>
            </div>
          </div>
          <div className="p-8 flex items-start gap-4">
            <RefreshCcw className="text-black shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Easy Returns</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">Simple returns process<br/>within 7 days.</p>
            </div>
          </div>
          <div className="p-8 flex items-start gap-4">
            <ShieldCheck className="text-black shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Secure Payment</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">100% secure payments<br/>secured by PhonePe.</p>
            </div>
          </div>
          <div className="p-8 flex items-start gap-4">
            <Truck className="text-black shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Free Shipping</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">Free delivery on all orders<br/>above ₹999.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}