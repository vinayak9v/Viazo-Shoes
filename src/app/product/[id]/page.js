'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux'; 
import { addToCart } from '../../../../redux/cartSlice'; 
import { 
  Star, Heart, ShoppingCart, Zap, Maximize2, 
  Truck, RefreshCcw, ShieldCheck, ChevronLeft, ChevronRight,
  Award, PackageOpen, Check, MapPin
} from 'lucide-react';

export default function ProductPage() {
  const params = useParams(); 
  const productId = params?.id; 
  const router = useRouter();
  
  // --- REDUX ---
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];

  // --- PRODUCT & UI STATES ---
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState(0);
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('DESCRIPTION');

  // --- CHECKOUT & API STATES ---
  const [token, setToken] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const API_BASE = '/api/user';

  // --- 1. FETCH PRODUCT DATA ---
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Real API Call
        const res = await fetch(`/api/admin/products/${productId}`);
        const json = await res.json();

        if (json.success) {
          setProductData(json.data);
          // Set initial size if sizes array exists and has items
          if (json.data.sizes?.length > 0) {
            setActiveSize(json.data.sizes[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); 

  // --- 2. FETCH USER ADDRESSES FOR CHECKOUT ---
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
      if (fetchedAddresses.length > 0) {
        const defaultAddr = fetchedAddresses.find(a => a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : fetchedAddresses[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  // --- 3. HANDLE ADD TO CART ---
  const handleAddToCart = () => {
    if (!productData) return;
    
    dispatch(addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.discountPrice ? parseFloat(productData.discountPrice) : parseFloat(productData.price),
      image: productData.images?.[0] || '/placeholder.png',
      quantity: quantity, 
      size: activeSize,
      color: productData.colors?.[activeColor] || null
    }));
  };

  // --- 4. HANDLE DIRECT BUY NOW (PHONEPE) ---
  const handleBuyNow = async () => {
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
      // Format ONLY the current product for the API payload
      const singleItemPayload = [{
        productId: Number(productData.id),
        quantity: Number(quantity),
        size: activeSize?.toString() || "",
        color: productData.colors?.[activeColor] || ""
      }];

      const res = await fetch(`/api/phonepe/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          addressId: Number(selectedAddressId), 
          items: singleItemPayload 
        })
      });
      
      const responseText = await res.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Status ${res.status}: ${responseText.substring(0, 100)}...`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Backend rejected the request (Status ${res.status})`);
      }

      // Redirect to PhonePe
      const paymentUrl = data.data?.redirectUrl || data.redirectUrl || data.url; 
      if (paymentUrl) {
        window.location.href = paymentUrl; 
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;
  if (error || !productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-bold gap-4">
        <h2 className="text-2xl text-red-500">Oops!</h2>
        <p>{error || "Product could not be loaded."}</p>
        <Link href="/" className="px-6 py-2 bg-black text-white text-sm">Go Back Home</Link>
      </div>
    );
  }

  const originalPrice = parseFloat(productData.price);
  const discountPrice = parseFloat(productData.discountPrice);
  const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;

  const isInCart = cartItems.some(item => item.id == productId);

  return (
    <div className="min-h-screen bg-white font-sans text-black pb-0">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb */}
        <nav className="text-[11px] font-medium text-gray-500 mb-8 tracking-wide">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/category/${productData.categoryId}`} className="hover:text-black transition-colors capitalize">
            {productData.categoryName || "Category"}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-black font-semibold border-b border-black pb-0.5 capitalize">{productData.name}</span>
        </nav>

        {/* MAIN PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 h-full">
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible no-scrollbar shrink-0">
              {productData.images?.map((imgUrl, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-[#f6f6f6] border-2 transition-all ${
                    activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
                  } rounded-lg overflow-hidden flex items-center justify-center p-1`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>

            <div className="relative w-full aspect-square sm:aspect-auto sm:h-[600px] bg-[#f8f8f8] rounded-xl flex items-center justify-center p-8">
              <div className="absolute top-6 left-6 bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-full z-10">
                NEW
              </div>
              <button className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10">
                <Maximize2 size={18} strokeWidth={1.5} />
              </button>
              
              {productData.images?.length > 0 && (
                <img 
                  src={productData.images[activeImage]} 
                  alt={productData.name} 
                  className="w-full h-full object-contain rounded-lg mix-blend-multiply"
                />
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col pt-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight capitalize">{productData.name}</h1>
                <p className="text-sm text-gray-500 mt-1">SKU: {productData.sku}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Add to wishlist">
                <Heart size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-black">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" strokeWidth={0} className="text-gray-300" />
              </div>
              <span className="text-xs font-medium text-gray-500">(125 Reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-black">₹{productData.discountPrice || productData.price}</span>
              {discountPercent > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through font-semibold">₹{productData.price}</span>
                  <span className="text-sm font-bold text-green-600">{discountPercent}% OFF</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mb-6">Inclusive of all taxes</p>

            <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-md">
               {productData.shortDescription?.replace(/"shortDescription": /g, '').replace(/"/g, '') || "No description available."}
            </p>

          {/* Color Selector */}
{productData.colors?.length > 0 && (
  <div className="mb-8">
    <div className="text-sm mb-3">
      Color: <span className="font-semibold text-black uppercase">
        {/* Safely extract the color string whether it's an object or a plain string */}
        {typeof productData.colors[activeColor] === 'object' 
          ? productData.colors[activeColor].color 
          : productData.colors[activeColor]}
      </span>
    </div>
    <div className="flex gap-3">
      {productData.colors.map((colorItem, idx) => {
        // Extract hex value safely
        const colorHex = typeof colorItem === 'object' ? colorItem.color : colorItem;
        
        return (
          <button 
            key={idx}
            onClick={() => setActiveColor(idx)}
            className={`w-9 h-9 rounded-full p-1 border-2 transition-colors ${activeColor === idx ? 'border-gray-400' : 'border-transparent'}`}
          >
            <div 
              className={`w-full h-full rounded-full ${colorHex === '#ffffff' ? 'border border-gray-300' : ''}`}
              style={{ backgroundColor: colorHex }}
            ></div>
          </button>
        )
      })}
    </div>
  </div>
)}

            {/* Size Selector */}
            {productData.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm">Select Size</span>
                  <Link href="#" className="text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-black">Size Guide</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productData.sizes.map((sizeValue, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveSize(sizeValue)}
                      className={`w-12 h-12 text-sm font-semibold rounded border transition-all ${
                        activeSize === sizeValue ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'
                      }`}
                    >
                      {sizeValue}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Checkout Address Selector */}
            {token && (
              <div className="mb-6 bg-[#f9f9f9] p-4 border border-gray-200 rounded">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-3">
                  <MapPin size={14} /> DELIVER TO:
                </label>
                {addresses.length > 0 ? (
                  <select 
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full border border-gray-300 bg-white p-2 text-sm outline-none focus:border-black cursor-pointer"
                  >
                    <option value="" disabled>Select Delivery Address</option>
                    {addresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label ? `${addr.label} - ` : ''} {addr.line1}, {addr.city}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-gray-500">
                    No address found. <Link href="/profile" className="text-black border-b border-black font-semibold">Add one</Link> before buying.
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              
              {/* Quantity Changer */}
              <div className="flex items-center border border-gray-300 rounded w-[120px] h-12 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:text-gray-500 transition-colors">-</button>
                <span className="flex-1 text-center font-semibold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:text-gray-500 transition-colors">+</button>
              </div>

              {/* Dynamic Add to Cart / Go to Cart Button */}
              {isInCart ? (
                 <button 
                   onClick={() => router.push('/cart')}
                   className="flex-1 h-12 bg-green-600 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 transition-colors rounded"
                 >
                   <Check size={16} strokeWidth={3} /> GO TO CART
                 </button>
              ) : (
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors rounded"
                >
                  <ShoppingCart size={16} strokeWidth={2} /> ADD TO CART
                </button>
              )}

              {/* Direct Buy Now Button */}
              <button 
                onClick={handleBuyNow}
                disabled={isCheckingOut || (!selectedAddressId && token)}
                className={`flex-1 h-12 border text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded ${
                  isCheckingOut || (!selectedAddressId && token) 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-white text-black border-black hover:bg-gray-50'
                }`}
              >
                <Zap size={16} strokeWidth={2} /> {isCheckingOut ? 'PROCESSING...' : 'BUY NOW'}
              </button>
            </div>

            {/* Mini Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-gray-700" strokeWidth={1.5} />
                <div>
                  <h4 className="text-[11px] font-bold">Free Shipping</h4>
                  <p className="text-[10px] text-gray-500">Order above ₹1499</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCcw size={20} className="text-gray-700" strokeWidth={1.5} />
                <div>
                  <h4 className="text-[11px] font-bold">Easy Returns</h4>
                  <p className="text-[10px] text-gray-500">7 days exchange</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-gray-700" strokeWidth={1.5} />
                <div>
                  <h4 className="text-[11px] font-bold">1 Year Warranty</h4>
                  <p className="text-[10px] text-gray-500">On all products</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 pt-16 border-t border-gray-200 mb-20">
          <div className="lg:col-span-5">
            <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
              {['DESCRIPTION', 'FEATURES', 'REVIEWS (125)'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-bold uppercase tracking-widest pb-3 whitespace-nowrap transition-all ${
                    activeTab === tab ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'DESCRIPTION' && (
              <div className="text-sm text-gray-600 leading-relaxed pr-4 whitespace-pre-wrap">
                {productData.fullDescription?.replace(/"shortDescription": /g, '').replace(/"/g, '') || "No description available."}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM BLACK TRUST BAR */}
      <div className="w-full bg-black text-white border-t border-zinc-800">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
          <div className="flex items-center gap-4 lg:justify-center pt-4 sm:pt-0">
            <Award className="shrink-0" size={32} strokeWidth={1} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Premium Quality</h4>
              <p className="text-[10px] text-gray-400">Carefully crafted for you</p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:justify-center pt-4 sm:pt-0">
            <ShieldCheck className="shrink-0" size={32} strokeWidth={1} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Secure Payments</h4>
              <p className="text-[10px] text-gray-400">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:justify-center pt-4 sm:pt-0">
            <PackageOpen className="shrink-0" size={32} strokeWidth={1} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Easy Returns</h4>
              <p className="text-[10px] text-gray-400">Hassle-free returns</p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:justify-center pt-4 sm:pt-0">
            <Truck className="shrink-0" size={32} strokeWidth={1} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Fast Delivery</h4>
              <p className="text-[10px] text-gray-400">Quick delivery at your door</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}