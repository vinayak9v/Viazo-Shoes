'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, Heart, ShoppingCart, Zap, Maximize2, 
  Truck, RefreshCcw, ShieldCheck, ChevronLeft, ChevronRight,
  Award, PackageOpen
} from 'lucide-react';

// --- MOCK DATA ---
const productImages = [
  '/main-shoe-side.png', // Replace with actual paths
  '/main-shoe-angle.png',
  '/main-shoe-top.png',
  '/main-shoe-bottom.png'
];

const sizes = [6, 7, 8, 9, 10, 11];
const colors = [{ name: 'Black', code: 'bg-black' }, { name: 'White', code: 'bg-white' }, { name: 'Olive', code: 'bg-[#4b5320]' }];

const relatedProducts = [
  { id: 1, name: 'Viazo Runner Pro', price: 2799, img: '/shoe-2.png' },
  { id: 2, name: 'Viazo Classic White', price: 2499, img: '/shoe-4.png' },
  { id: 3, name: 'Viazo Streetwear', price: 2999, img: '/shoe-9.png' },
  { id: 4, name: 'Viazo All Black', price: 2999, img: '/shoe-8.png' },
];

export default function ProductPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [activeSize, setActiveSize] = useState(8);
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('DESCRIPTION');

  return (
    <div className="min-h-screen bg-white font-sans text-black pb-0">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb */}
        <nav className="text-[11px] font-medium text-gray-500 mb-8 tracking-wide">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/men" className="hover:text-black transition-colors">Men</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-black font-semibold border-b border-black pb-0.5">Urban Grid Sneaker</span>
        </nav>

        {/* ========================================== */}
        {/* MAIN PRODUCT SECTION                       */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 h-full">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible no-scrollbar shrink-0">
              {productImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-[#f6f6f6] border-2 transition-all ${
                    activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
                  } rounded-lg overflow-hidden flex items-center justify-center p-2`}
                >
                  {/* Using standard img tag fallback if next/image placeholder paths are empty */}
                  <div className="w-full h-full bg-gray-200 rounded"></div> 
                  {/* Replace above div with: <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain" /> */}
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative w-full aspect-square sm:aspect-auto sm:h-[600px] bg-[#f8f8f8] rounded-xl flex items-center justify-center p-8">
              {/* Badges & Actions */}
              <div className="absolute top-6 left-6 bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-full z-10">
                NEW
              </div>
              <button className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10">
                <Maximize2 size={18} strokeWidth={1.5} />
              </button>
              
              {/* Main Shoe Image placeholder */}
              <div className="w-3/4 h-3/4 bg-gray-300 rounded-lg transform -rotate-12"></div>
              {/* <Image src={productImages[activeImage]} alt="Urban Grid Sneaker" fill className="object-contain p-12" priority /> */}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col pt-4">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Urban Grid Sneaker</h1>
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
              <span className="text-3xl font-black">₹2,999</span>
              <span className="text-lg text-gray-400 line-through font-semibold">₹4,499</span>
              <span className="text-sm font-bold text-green-600">33% OFF</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6">Inclusive of all taxes</p>

            {/* Short Desc */}
            <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-md">
              Premium handcrafted sneakers designed for all-day comfort and modern lifestyle.
            </p>

            {/* Color Selector */}
            <div className="mb-8">
              <div className="text-sm mb-3">Color: <span className="font-semibold text-black">{colors[activeColor].name}</span></div>
              <div className="flex gap-3">
                {colors.map((color, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveColor(idx)}
                    className={`w-9 h-9 rounded-full p-1 border-2 transition-colors ${activeColor === idx ? 'border-gray-400' : 'border-transparent'}`}
                  >
                    <div className={`w-full h-full rounded-full ${color.code} ${color.code === 'bg-white' ? 'border border-gray-300' : ''}`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm">Select Size (UK)</span>
                <Link href="#" className="text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-black">Size Guide</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setActiveSize(size)}
                    className={`w-12 h-12 text-sm font-semibold rounded border transition-all ${
                      activeSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-gray-300 rounded w-[120px] h-12 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:text-gray-500 transition-colors">-</button>
                <span className="flex-1 text-center font-semibold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:text-gray-500 transition-colors">+</button>
              </div>
              <button className="flex-1 h-12 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors rounded">
                <ShoppingCart size={16} strokeWidth={2} /> ADD TO CART
              </button>
              <button className="flex-1 h-12 border border-black bg-white text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors rounded">
                <Zap size={16} strokeWidth={2} /> BUY NOW
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

        {/* ========================================== */}
        {/* BOTTOM TABS & CROSS-SELL                   */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 pt-16 border-t border-gray-200 mb-20">
          
          {/* Left: Description Tabs */}
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
              <div className="text-sm text-gray-600 leading-relaxed pr-4">
                <p className="mb-4">
                  Viazo Urban Grid Sneaker combines premium vegan leather, a lightweight EVA sole, and a minimal design language to deliver unmatched comfort and style. Perfect for everyday wear, travel and casual outings.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[13px]">
                  <li>Premium vegan leather upper</li>
                  <li>Lightweight EVA sole for superior comfort</li>
                  <li>Breathable lining for all-day freshness</li>
                  <li>Durable build for long-lasting use</li>
                </ul>
              </div>
            )}
            {/* You can add content for FEATURES and REVIEWS here later */}
          </div>

          {/* Right: You May Also Like */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-base font-bold uppercase tracking-wide">YOU MAY ALSO LIKE</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((prod) => (
                <div key={prod.id} className="group cursor-pointer">
                  <div className="relative w-full aspect-[4/3] bg-[#f8f8f8] mb-3 rounded-lg overflow-hidden flex items-center justify-center">
                     <div className="w-3/4 h-3/4 bg-gray-200 rounded transition-transform duration-500 group-hover:scale-105"></div>
                     {/* <Image src={prod.img} alt={prod.name} fill className="object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" /> */}
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1 line-clamp-1">{prod.name}</h3>
                  <p className="text-sm font-black">₹{prod.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* BOTTOM BLACK TRUST BAR                     */}
      {/* ========================================== */}
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