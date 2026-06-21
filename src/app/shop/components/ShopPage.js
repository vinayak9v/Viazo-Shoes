'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux'; 
import { addToCart } from '../../../../redux/cartSlice'; 
import { ShoppingCart, ChevronDown, Layers, CloudRain, ShieldCheck, Truck, Loader2, Check } from 'lucide-react';

// --- STATIC FILTER DATA ---
const genders = [
  { name: 'Men', count: 32 },
  { name: 'Women', count: 10 },
  { name: 'Unisex', count: 6 },
];
const sizes = ['6', '7', '8', '9', '10', '11', '12'];
const colorOptions = ['black', 'white', 'gray', 'blue', 'green', 'brown', 'red'];

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState(4000);
  
  // --- API STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];

  // --- FETCH API DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Categories
        const catRes = await fetch('/api/admin/categories?page=1&limit=50');
        const catResult = await catRes.json();
        
        let fetchedCat = [];
        if (Array.isArray(catResult)) fetchedCat = catResult;
        else if (catResult?.data?.data) fetchedCat = catResult.data.data;
        else if (catResult?.categories) fetchedCat = catResult.categories;
        else if (catResult?.data) fetchedCat = catResult.data;
        
        setCategories(fetchedCat);

        // 2. Fetch Products
        const prodRes = await fetch('/api/admin/products?page=1&limit=48');
        const prodResult = await prodRes.json();
        
        let fetchedProd = [];
        if (Array.isArray(prodResult)) fetchedProd = prodResult;
        else if (prodResult?.data?.data) fetchedProd = prodResult.data.data;
        else if (prodResult?.products) fetchedProd = prodResult.products;
        else if (prodResult?.data) fetchedProd = prodResult.data;

        setProducts(fetchedProd);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (e, product, primaryImg) => {
    e.preventDefault(); 
    
    // Safely extract color and size matching your new API string arrays
    const colorVal = typeof product.colors?.[0] === 'object' ? product.colors[0].color : product.colors?.[0];
    const sizeVal = typeof product.sizes?.[0] === 'object' ? product.sizes[0].size : product.sizes?.[0];

    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price),
      image: primaryImg,
      quantity: 1,
      size: sizeVal || null, 
      color: colorVal || null
    }));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* ========================================== */}
          {/* LEFT SIDEBAR: FILTERS                      */}
          {/* ========================================== */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Filters</h2>

            {/* CATEGORIES */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Categories</h3>
              <ul className="flex flex-col gap-3 text-sm text-gray-600">
                <li>
                  <button className="hover:text-black transition-colors w-full text-left font-semibold text-black">
                    All Collections
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id || cat._id}>
                    <button className="hover:text-black transition-colors w-full text-left flex justify-between">
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* GENDER */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Gender</h3>
              <ul className="flex flex-col gap-3 text-sm text-gray-600">
                {genders.map((gender, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <input type="checkbox" id={`gender-${idx}`} className="w-4 h-4 accent-black border-gray-300 rounded-sm" />
                    <label htmlFor={`gender-${idx}`} className="cursor-pointer select-none">
                      {gender.name} <span className="text-gray-400">({gender.count})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* SIZE */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Size (UK)</h3>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size, idx) => (
                  <button key={idx} className="border border-gray-200 py-2 text-xs font-medium hover:border-black hover:bg-black hover:text-white transition-all text-center">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Color</h3>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color, idx) => (
                  <button 
                    key={idx} 
                    style={{ backgroundColor: color }}
                    className="w-6 h-6 rounded-full border border-gray-300 hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 transition-all"
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Price</h3>
              <p className="text-sm text-gray-600 mb-4">₹1,000 - ₹{priceRange.toLocaleString('en-IN')}</p>
              <input 
                type="range" 
                min="1000" 
                max="10000" 
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-black h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-6" 
              />
              <button className="w-full bg-black text-white text-[11px] font-bold uppercase tracking-widest py-3 hover:bg-gray-800 transition-colors mb-3">
                APPLY FILTERS
              </button>
              <button className="w-full bg-transparent text-black border border-gray-300 text-[11px] font-bold uppercase tracking-widest py-3 hover:bg-gray-50 transition-colors">
                CLEAR ALL
              </button>
            </div>
          </aside>

          {/* ========================================== */}
          {/* RIGHT CONTENT: PRODUCT GRID                */}
          {/* ========================================== */}
          <div className="flex-1 w-full">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-4 lg:border-none lg:pb-0">
              <p className="text-sm text-gray-500">
                {isLoading ? 'Loading products...' : `Showing ${products.length} results`}
              </p>
              <div className="relative">
                <select className="appearance-none border border-gray-300 text-xs font-bold uppercase tracking-widest py-3 pl-4 pr-10 bg-white cursor-pointer hover:border-black transition-colors outline-none rounded-none">
                  <option>SORT BY: NEWEST</option>
                  <option>PRICE: LOW TO HIGH</option>
                  <option>PRICE: HIGH TO LOW</option>
                  <option>BEST SELLERS</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
            </div>

            {/* Product Grid & Loader */}
            {isLoading ? (
              <div className="flex justify-center items-center py-32">
                <Loader2 size={40} className="animate-spin text-gray-400" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center py-32 text-gray-500">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => {
                  const pId = product.id || product._id;
                  
                  // FIXED IMAGE EXTRACTION: Direct 'image' check karega pehle, fir 'images' array check karega
                  const primaryImg = product.image || 
                                     (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.imageUrl) || 
                                     'https://placehold.co/600x600/eeeeee/31343c?text=No+Image';

                  const secondaryImg = (typeof product.images?.[1] === 'string' ? product.images[1] : product.images?.[1]?.imageUrl) || primaryImg;

                  const isInCart = cartItems.some((item) => item.id === pId);

                  const categoryName = product.categoryName || product.category?.name;

                  return (
                    <div key={pId} className="group flex flex-col h-full">
                      
                      {/* FIXED: Replaced next/image with standard HTML <img> tags */}
                      <Link 
                        href={`/product/${pId}`}
                        className="relative w-full aspect-square bg-[#f6f6f6] mb-4 overflow-hidden flex items-center justify-center p-4 block"
                      >
                        {/* Primary Image */}
                        <img 
                          src={primaryImg} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-110 z-10"
                        />

                        {/* Secondary Image */}
                        <img 
                          src={secondaryImg} 
                          alt={`${product.name} Alternate`} 
                          className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-110 z-0"
                        />

                        {/* Category Badge */}
                        {categoryName && (
                          <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider z-20">
                            {categoryName}
                          </span>
                        )}
                      </Link>

                      {/* Product Name Link */}
                      <Link href={`/product/${pId}`} className="block hover:opacity-80 transition-opacity">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-900 line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-sm font-black">
                          ₹{product.discountPrice ? product.discountPrice : product.price}
                        </p>
                        {product.discountPrice && (
                          <p className="text-[11px] text-gray-400 font-semibold line-through">
                            ₹{product.price}
                          </p>
                        )}
                      </div>
                      
                      {/* Available Colors */}
                      <div className="flex gap-1.5 mb-4">
                        {product.colors && product.colors.map((colorObj, idx) => {
                          const colorCode = typeof colorObj === 'object' ? colorObj.color : colorObj;
                          return (
                            <div 
                              key={idx} 
                              style={{ backgroundColor: colorCode }}
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              title={colorCode}
                            />
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 mt-auto">
                        {isInCart ? (
                          <Link 
                            href="/cart" 
                            className="w-full bg-green-600 text-white text-[10px] font-black uppercase tracking-widest py-3 text-center flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                          >
                            <Check size={14} strokeWidth={3} /> ALREADY IN CART
                          </Link>
                        ) : (
                          <>
                            <Link 
                              href={`/product/${pId}`}
                              className="flex-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 text-center hover:bg-gray-800 transition-colors"
                            >
                              VIEW DETAILS
                            </Link>
                            <button 
                              onClick={(e) => handleAddToCart(e, product, primaryImg)}
                              className="bg-black text-white p-3 hover:bg-gray-800 transition-colors flex items-center justify-center shrink-0" 
                              aria-label="Add to Cart"
                            >
                              <ShoppingCart size={16} strokeWidth={2} />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM TRUST BADGES */}
        <div className="mt-20 mb-10 border border-gray-200 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          <div className="p-8 flex items-start gap-4">
            <Layers className="text-black shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Premium Quality</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">High grade raw materials<br/>for maximum durability.</p>
            </div>
          </div>
          <div className="p-8 flex items-start gap-4">
            <CloudRain className="text-black shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Easy Returns</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">Simple returns process<br/>within 7 days.</p>
            </div>
          </div>
          <div className="p-8 flex items-start gap-4">
            <ShieldCheck className="text-black shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1">Secure Payment</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">100% secure payments<br/>secured by Razorpay.</p>
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