'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';

export default function CollectionsPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        // Removed the limit=4 so it fetches all available collections for the main page
        const response = await fetch('/api/admin/categories?page=1'); 
        if (response.ok) {
          const result = await response.json();
          
          // Safe Array Extraction
          let fetchedArray = [];
          if (Array.isArray(result)) fetchedArray = result;
          else if (result?.data?.data) fetchedArray = result.data.data;
          else if (result?.categories) fetchedArray = result.categories;
          else if (result?.data) fetchedArray = result.data;

          setCategories(fetchedArray);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">
            Shop By Category
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-black uppercase tracking-tight">
            All Collections
          </h1>
          {/* Small Black Separator Line */}
          <div className="w-12 h-[2px] bg-black mx-auto mt-6"></div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="animate-spin text-gray-400" size={40} />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No collections available right now. Please check back later.
          </div>
        ) : (
          /* Category Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((item) => (
              <Link href={`/category/${item.id || item._id}`} key={item.id || item._id} className="group block h-full">
                <div className="bg-[#f4f4f4] h-full flex flex-col items-center justify-center p-8 transition-colors duration-300 hover:bg-[#ececec]">
                  
                  {/* Image Wrapper */}
                  <div className="relative w-full h-40 md:h-52 mb-8 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="object-contain w-full h-full drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <ImageIcon size={48} className="text-gray-300" />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="text-center mt-auto">
                    <h3 className="text-[15px] font-bold text-black uppercase tracking-wide mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-6 line-clamp-2">
                      {item.description || 'Explore our latest collection built for your comfort and style.'}
                    </p>
                    
                    {/* Shop Now Button Area */}
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-black uppercase tracking-widest transition-transform duration-300 group-hover:translate-x-1">
                      SHOP NOW <ChevronRight size={14} strokeWidth={2.5} />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}