'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Search, User, ShoppingCart, Menu, X, ImageIcon, Loader2 } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  // --- UI STATES ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --- SEARCH STATES ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // --- DATA STATES ---
  const [categories, setCategories] = useState([]);
  
  // Redux Cart
  const cartItems = useSelector((state) => state.cart.items);
  const totalCartItems = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Component mount hone par categories fetch karna
  useEffect(() => {
    setMounted(true);

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories?page=1&limit=6'); 
        if (response.ok) {
          const result = await response.json();
          let fetchedArray = [];
          if (Array.isArray(result)) fetchedArray = result;
          else if (result?.data?.data) fetchedArray = result.data.data;
          else if (result?.categories) fetchedArray = result.categories;
          else if (result?.data) fetchedArray = result.data;

          setCategories(fetchedArray);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // --- LIVE SEARCH LOGIC (Debounced) ---
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products/search?q=${searchQuery}`);
        const data = await res.json();
        
        if (data.success) {
          setSearchResults(data.data || []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery('');
    setSearchResults([]);
    setIsMobileMenuOpen(false); 
  };

  return (
    <nav className="relative w-full bg-black text-white px-6 md:px-8 flex items-center justify-between font-sans z-50 shadow-md">
      
      {/* Left: Logo Area */}
      <Link href="/" className="flex items-center gap-3 py-4">
      
        <Image 
          src="/logo'2.jpg.jpeg"    
          alt="Viazo Logo" 
          width={60}          
          height={60}        
          className="object-contain"
        />
        {/* <span className="text-2xl font-bold tracking-wide hidden sm:block">Viazo</span> */}
      </Link>
      

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center h-full text-[11px] font-bold tracking-widest uppercase">
        <Link href="/" className="hover:text-gray-400 transition-colors h-full flex items-center px-4 py-6">Home</Link>
        <Link href="/shop" className="hover:text-gray-400 transition-colors h-full flex items-center px-4 py-6">Shop</Link>
        
        {/* COLLECTIONS LINK WITH HOVER MEGA MENU */}
        <div 
          className="group h-full flex items-center px-4 py-6 cursor-pointer"
          onMouseEnter={() => setIsCollectionsHovered(true)}
          onMouseLeave={() => setIsCollectionsHovered(false)}
        >
          <Link href="/shop" className="group-hover:text-gray-400 transition-colors">
            Collections
          </Link>

          {/* Mega Menu Dropdown */}
          {isCollectionsHovered && categories.length > 0 && !isSearchOpen && (
            <div className="absolute top-full left-0 w-full bg-[#0a0a0a] text-white border-t border-zinc-900 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-w-[1200px] mx-auto px-8 py-6">
                <div className="flex flex-wrap justify-center gap-8">
                  {categories.map((cat) => {
                    const catId = cat.id || cat._id;
                    return (
                      <Link 
                        href={`/category/${catId}`} 
                        key={catId} 
                        className="group/item flex flex-col items-center w-24 sm:w-28"
                      >
                        <div className="w-full aspect-square bg-zinc-900 rounded-lg mb-3 flex items-center justify-center p-3 overflow-hidden transition-colors duration-300 group-hover/item:bg-zinc-800 border border-zinc-800">
                          {cat.imageUrl ? (
                            <img 
                              src={cat.imageUrl} 
                              alt={cat.name} 
                              className="w-full h-full object-contain transition-transform duration-500 group-hover/item:scale-110"
                            />
                          ) : (
                            <ImageIcon size={24} className="text-zinc-700" />
                          )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center text-gray-300 group-hover/item:text-white transition-colors">
                          {cat.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <Link href="/about" className="hover:text-gray-400 transition-colors h-full flex items-center px-4 py-6">About Us</Link>
        <Link href="/contact" className="hover:text-gray-400 transition-colors h-full flex items-center px-4 py-6">Contact</Link>
      </div>

      {/* Right: Actions & Icons */}
      <div className="flex items-center gap-5 md:gap-6 py-4">
        
        <div className="hidden md:flex items-center gap-6">
          <button onClick={handleSearchToggle} aria-label="Search" className={`transition-colors ${isSearchOpen ? 'text-white' : 'hover:text-gray-400'}`}>
            {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
          </button>
          <Link href="/profile">
            <button aria-label="User Profile" className="hover:text-gray-400 transition-colors">
              <User size={20} strokeWidth={1.5} />
            </button>
          </Link>
        </div>
        
        <Link href="/cart" aria-label="Cart" className="relative hover:text-gray-400 transition-colors block">
          <ShoppingCart size={20} strokeWidth={1.5} />
          {mounted && totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-bold h-[16px] w-[16px] rounded-full flex items-center justify-center animate-pulse">
              {totalCartItems}
            </span>
          )}
        </Link>

        <button 
          className="md:hidden flex items-center hover:text-gray-400 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {/* ------------------------------------------- */}
      {/* SEARCH DROPDOWN OVERLAY                     */}
      {/* ------------------------------------------- */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0a0a0a] border-t border-zinc-900 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for sneakers, boots, collections..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg py-4 pl-12 pr-12 outline-none focus:border-gray-500 transition-colors text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Live Search Results */}
            {searchQuery.trim().length > 1 && (
              <div className="mt-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {isSearching ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-gray-500" size={32} />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.map((item) => {
                      const pId = item.id || item._id;
                      
                      // FIXED IMAGE EXTRACTION: Direct 'image' check karega pehle (Aapke Search API ke liye)
                      const primaryImg = item.image || 
                                        (typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.imageUrl) || 
                                        'https://placehold.co/100x100/eeeeee/31343c?text=No+Image';

                      return (
                        <Link 
                          href={`/product/${pId}`} 
                          key={pId}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-4 bg-zinc-900 p-3 rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-800/50 hover:border-zinc-700 group"
                        >
                          <div className="w-16 h-16 bg-[#f4f4f4] rounded shrink-0 overflow-hidden flex items-center justify-center p-1">
                            {/* Standard img tag taaki Cloudinary error na aaye */}
                            <img src={primaryImg} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white line-clamp-1 mb-1">{item.name}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">₹{item.discountPrice || item.price}</span>
                              {item.discountPrice && (
                                <span className="text-[10px] text-gray-500 line-through">₹{item.price}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-10 text-sm">
                    No products found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* ------------------------------------------- */}
      {/* MOBILE MENU DROPDOWN OVERLAY                */}
      {/* ------------------------------------------- */}
      {isMobileMenuOpen && !isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0a0a0a] border-t border-zinc-900 flex flex-col md:hidden p-6 shadow-2xl animate-in slide-in-from-top-2">
          
          <div className="flex flex-col gap-5 text-sm font-semibold tracking-widest uppercase mb-6">
            <Link href="/" onClick={toggleMenu} className="hover:text-gray-400">Home</Link>
            <Link href="/shop" onClick={toggleMenu} className="hover:text-gray-400">Shop</Link>
            <Link href="/shop" onClick={toggleMenu} className="hover:text-gray-400">Collections</Link>
            <Link href="/about" onClick={toggleMenu} className="hover:text-gray-400">About Us</Link>
            <Link href="/contact" onClick={toggleMenu} className="hover:text-gray-400">Contact</Link>
          </div>

          <hr className="border-zinc-800 mb-6" />

          <div className="flex flex-col gap-5 text-sm font-semibold tracking-widest uppercase text-gray-300">
            <Link href="/profile" onClick={toggleMenu} className="flex items-center gap-4 hover:text-white transition-colors">
              <User size={20} strokeWidth={1.5} /> 
              My Profile
            </Link>
            
            <Link href="/cart" onClick={toggleMenu} className="flex items-center gap-4 hover:text-white transition-colors">
              <ShoppingCart size={20} strokeWidth={1.5} /> 
              Cart ({mounted ? totalCartItems : 0})
            </Link>

            <button onClick={handleSearchToggle} className="flex items-center gap-4 hover:text-white transition-colors text-left">
              <Search size={20} strokeWidth={1.5} /> 
              Search
            </button>
          </div>

        </div>
      )}
    </nav>
  );
}