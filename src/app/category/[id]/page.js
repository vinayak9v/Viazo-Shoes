'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // <-- Dynamic URL se ID lene ke liye
import { useSelector, useDispatch } from 'react-redux'; 
import { addToCart } from '../../../../redux/cartSlice'; // Make sure this path is correct based on your folder structure
import { ShoppingCart, ChevronDown, Layers, CloudRain, ShieldCheck, Truck, Loader2, Check } from 'lucide-react';

// --- STATIC FILTER DATA ---
const genders = [
  { name: 'Men', count: 32 },
  { name: 'Women', count: 10 },
  { name: 'Unisex', count: 6 },
];
const sizes = ['6', '7', '8', '9', '10', '11', '12'];
const colorOptions = ['black', 'white', 'gray', 'blue', 'green', 'brown', 'red'];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.id; // URL se ID aayega (e.g., '3')

  const [priceRange, setPriceRange] = useState(4000);
  
  // --- API STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];

  // --- FETCH API DATA ---
  useEffect(() => {
    if (!categoryId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch All Categories (For the left sidebar menu)
        const catRes = await fetch('/api/admin/categories?page=1&limit=50');
        const catResult = await catRes.json();
        
        let fetchedCat = [];
        if (Array.isArray(catResult)) fetchedCat = catResult;
        else if (catResult?.data?.data) fetchedCat = catResult.data.data;
        else if (catResult?.categories) fetchedCat = catResult.categories;
        else if (catResult?.data) fetchedCat = catResult.data;
        
        setCategories(fetchedCat);

        // 2. Fetch Products by Category ID dynamically
        const prodRes = await fetch(`/api/categories/${categoryId}`);
        const prodResult = await prodRes.json();
        
        let fetchedProd = [];
        // Handle your new API response format { success: true, data: [...] }
        if (prodResult?.success && Array.isArray(prodResult?.data)) {
          fetchedProd = prodResult.data;
        } else if (Array.isArray(prodResult)) {
          fetchedProd = prodResult;
        }

        setProducts(fetchedProd);

      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleAddToCart = (e, product, primaryImg) => {
    e.preventDefault(); 
    
    // Safely extract color and size (Handle undefined arrays gracefully since they aren't in this new JSON)
    const colorVal = product.colors && product.colors.length > 0 
        ? (typeof product.colors[0] === 'object' ? product.colors[0].color : product.colors[0]) 
        : null;
        
    const sizeVal = product.sizes && product.sizes.length > 0 
        ? (typeof product.sizes[0] === 'object' ? product.sizes[0].size : product.sizes[0]) 
        : null;

    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price),
      image: primaryImg,
      quantity: 1,
      size: sizeVal, 
      color: colorVal
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
                  <Link href="/shop" className="hover:text-black transition-colors w-full text-left flex justify-between">
                    All Collections
                  </Link>
                </li>
                {categories.map((cat) => {
                  const catId = (cat.id || cat._id).toString();
                  const isActive = categoryId === catId; // Highlight the active category
                  
                  return (
                    <li key={catId}>
                      <Link 
                        href={`/category/${catId}`} 
                        className={`hover:text-black transition-colors w-full text-left flex justify-between ${isActive ? 'font-bold text-black' : ''}`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  )
                })}
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
              <div className="flex flex-col justify-center items-center py-32 text-gray-500 gap-4">
                <p>No products found in this category.</p>
                <Link href="/shop" className="px-6 py-2 bg-black text-white text-xs font-bold uppercase">
                  Back to Shop
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => {
                  const pId = product.id || product._id;
                  
                  // Handle the specific image array of objects: [{id: 2, imageUrl: "..."}]
                  const primaryImg = product.images?.[0]?.imageUrl || 'https://placehold.co/600x600/eeeeee/31343c?text=No+Image';
                  const secondaryImg = product.images?.[1]?.imageUrl || primaryImg;

                  const isInCart = cartItems.some((item) => item.id === pId);
                  const categoryName = product.categoryName || product.category?.name;

                  return (
                    <div key={pId} className="group flex flex-col h-full">
                      
                      {/* Product Image Link Container with normal <img> tags */}
                      <Link 
                        href={`/product/${pId}`}
                        className="relative w-full aspect-square bg-[#f6f6f6] mb-4 overflow-hidden flex items-center justify-center p-4 block"
                      >
                        <img 
                          src={primaryImg} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-110 z-10"
                        />
                        <img 
                          src={secondaryImg} 
                          alt={`${product.name} Alternate`} 
                          className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-110 z-0"
                        />
                        {categoryName && (
                          <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider z-20">
                            {categoryName}
                          </span>
                        )}
                      </Link>

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
                      
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex gap-1.5 mb-4">
                          {product.colors.map((colorObj, idx) => {
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
                      )}

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
      </div>
    </div>
  );
}