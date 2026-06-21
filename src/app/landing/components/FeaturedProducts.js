'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../redux/cartSlice'; // Path check kar lena
import { ShoppingCart, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'; // Optional

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/admin/products?page=1&limit=10');
        const result = await response.json();

        if (result.success && result.data && result.data.data) {
          setProducts(result.data.data);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (e, product, primaryImage) => {
    e.preventDefault();
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price),
      image: primaryImage,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));
    
    // toast.success(`${product.name} added to cart!`);
    console.log('Dispatched to Redux:', cartItem);
  };

  return (
    <section className="w-full bg-white py-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative flex flex-col items-center justify-center mb-12">
          <div className="text-center">
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">
              Featured Products
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
              New Arrivals
            </h2>
            <div className="w-10 h-[3px] bg-black mx-auto mt-5"></div>
          </div>
          
          <Link 
            href="/shop" 
            className="mt-6 md:mt-0 md:absolute md:right-0 md:bottom-2 flex items-center text-[11px] font-extrabold uppercase tracking-widest text-gray-600 hover:text-black transition-colors"
          >
            VIEW ALL PRODUCTS <ChevronRight size={16} strokeWidth={2.5} className="ml-1" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={40} />
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              // API Response ke hisaab se image update kar diya hai
              const primaryImage = product.image || '/placeholder.png';
              const hoverImage = product.image || primaryImage; // API mein ek hi image hai

              return (
                <div 
                  key={product.id} 
                  className="bg-[#f4f4f4] p-6 relative group transition-colors duration-300 hover:bg-[#ececec] flex flex-col justify-between"
                >
                  
                  {/* Category Name update kar diya hai */}
                  {product.categoryName && (
                    <div className="absolute top-4 left-4 bg-black text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-20 pointer-events-none">
                      {product.categoryName}
                    </div>
                  )}

                  <Link 
                    href={`/product/${product.id}`} 
                    className="relative w-full h-44 md:h-52 mb-6 overflow-hidden flex items-center justify-center block"
                  >
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-xl transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-110 group-hover:-translate-y-2 z-10"
                    />
                    <Image
                      src={hoverImage}
                      alt={`${product.name} alternate view`}
                      fill
                      className="object-contain drop-shadow-xl transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-2 absolute inset-0 z-0"
                    />
                  </Link>

                  <div className="flex items-end justify-between mt-auto">
                    
                    <Link href={`/product/${product.id}`} className="block flex-1 group-hover:opacity-80 transition-opacity">
                      <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <p className="text-base font-black text-black">
                          ₹{product.discountPrice ? product.discountPrice : product.price}
                        </p>
                        {product.discountPrice && (
                          <p className="text-xs text-gray-400 font-semibold line-through">
                            ₹{product.price}
                          </p>
                        )}
                      </div>
                    </Link>
                    
                    {/* Add to Cart Button */}
                    <button 
                      className="bg-black text-white p-3 hover:bg-gray-800 transition-colors active:scale-95 shrink-0 ml-2 relative z-10"
                      aria-label="Add to cart"
                      onClick={(e) => handleAddToCart(e, product, primaryImage)}
                    >
                      <ShoppingCart size={18} strokeWidth={2} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}