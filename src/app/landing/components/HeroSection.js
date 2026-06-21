'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Truck, ShieldCheck, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { id: 1, image: '/hero1 (2).png' }, 
  { id: 2, image: '/hero2 (2).png' }, 
  { id: 3, image: '/hero3 (2).png' }, 
  { id: 4, image: '/hero4.png' }, 
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textContainerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Function to move to next slide
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Function to move to previous slide
  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // 1. Automatic Loop (Auto-Play) Logic
  useEffect(() => {
    // Har 4.5 seconds me automatic slide change hogi
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    // Cleanup interval jab component unmount ho ya slide change ho
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeSlide]);

  // Manual Click handler jo interval ko reset karega taaki glitch na ho
  const handleManualNext = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    nextSlide();
  };

  const handleManualPrev = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    prevSlide();
  };


  // 2. Initial Page Load Animation (Premium entrance)
  useGSAP(() => {
    const tl = gsap.timeline();

    // Text Elements Entrance with a modern Custom Ease Feel
    tl.from('.animate-text', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
    });

    // Features Bottom Bar entrance
    tl.from('.animate-feature', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=0.8'); // Starts slightly before text animation finishes

  }, { scope: containerRef });


  // 3. Advanced Smooth Scrolling Image & Subtle Text Kinetic Transition
  useGSAP(() => {
    // Ultimate Smooth Custom Transition for Image Wrapper
    gsap.fromTo(
      imageRef.current,
      { 
        opacity: 0, 
        scale: 1.08,     // Thoda zoom-in se start hoga
        clipPath: 'inset(0% 0% 0% 100%)', // Liquid reveal right to left effect
      },
      { 
        opacity: 1, 
        scale: 1, 
        clipPath: 'inset(0% 0% 0% 0%)', 
        duration: 1.4, 
        ease: 'power4.inOut' // Super fluid transitions
      }
    );

    // Subtle micro-animation on title text when slide changes for micro-interaction premium feel
    gsap.fromTo('.animate-title-slide',
      { y: 15, opacity: 0.7 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    );

  }, { dependencies: [activeSlide], scope: containerRef });


  return (
    <section ref={containerRef} className="relative w-full h-[90vh] bg-black text-white overflow-hidden flex flex-col justify-between font-sans select-none">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full md:w-[60%] md:left-[40%] z-0">
        <div className="relative w-full h-full overflow-hidden">
          
          {/* Image Wrapper - Animated with GSAP */}
          <div ref={imageRef} className="absolute inset-0 w-full h-full will-change-transform">
            <Image
              src={slides[activeSlide].image}
              alt="Viazo Sneakers"
              fill
              className="object-cover md:object-contain object-right transform transition-transform duration-700 ease-out"
              priority
            />
          </div>

          {/* Dark gradient fade over layout */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent md:w-1/2 pointer-events-none z-[1]" />
        </div>
      </div>

      {/* Main Content Component */}
      <div className="relative z-10 flex-1 flex items-center px-8 md:px-20">
        
        {/* Left Vertical Pagination Track */}
        <div className="hidden md:flex flex-col items-center gap-6 mr-16">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => {
              if (autoPlayRef.current) clearInterval(autoPlayRef.current);
              setActiveSlide(index);
            }}>
              <span className={`text-xs font-bold tracking-wider transition-all duration-500 ${activeSlide === index ? 'text-white scale-110 font-black' : 'text-gray-600 hover:text-gray-400'}`}>
                0{slide.id}
              </span>
              <div className={`w-[2px] transition-all duration-700 ease-out ${activeSlide === index ? 'h-14 bg-white' : 'h-0 bg-transparent'}`} />
            </div>
          ))}
        </div>

        {/* Text Area Details */}
        <div ref={textContainerRef} className="max-w-xl">
          <p className="animate-text text-gray-400 text-xs tracking-[0.3em] font-black mb-4">
            NEW COLLECTION 2024
          </p>
          <h1 className="animate-text animate-title-slide text-5xl md:text-7xl font-extrabold uppercase leading-[1.1] mb-6 tracking-tight">
            Move Bold. <br /> Live Fearless.
          </h1>
          <p className="animate-text text-gray-400 text-sm md:text-base mb-10 max-w-sm leading-relaxed font-light">
            Viazo is more than sneakers. <br /> It&apos;s a bold statement of who you are.
          </p>

          {/* Action Buttons */}
          <div className="animate-text flex items-center gap-4">
            <button className="bg-white text-black px-8 py-3.5 text-xs font-black tracking-widest hover:bg-gray-200 transition-all active:scale-95">
              SHOP NOW
            </button>
            <button className="border-2 border-white text-white px-8 py-3.5 text-xs font-black tracking-widest hover:bg-white hover:text-black transition-all active:scale-95">
              EXPLORE COLLECTIONS
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Features Bar Component */}
      <div className="relative z-10 w-full px-8 md:px-20 py-6 border-t border-gray-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0 bg-black/60 backdrop-blur-md">
        
        <div className="flex flex-wrap gap-8 md:gap-16">
          {/* Feature Item 1 */}
          <div className="animate-feature flex items-center gap-3.5">
            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800"><Truck className="text-white" size={20} strokeWidth={1.5} /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Free Shipping</p>
              <p className="text-[10px] text-gray-500 mt-0.5">On orders above ₹999</p>
            </div>
          </div>
          
          {/* Feature Item 2 */}
          <div className="animate-feature flex items-center gap-3.5">
            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800"><ShieldCheck className="text-white" size={20} strokeWidth={1.5} /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">1 Year Warranty</p>
              <p className="text-[10px] text-gray-500 mt-0.5">For all products</p>
            </div>
          </div>

          {/* Feature Item 3 */}
          <div className="animate-feature flex items-center gap-3.5">
            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800"><RefreshCcw className="text-white" size={20} strokeWidth={1.5} /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Easy Returns</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Simple 7-day process</p>
            </div>
          </div>
        </div>

        {/* Liquid Slider Navigation Controls */}
        <div className="animate-feature flex items-center gap-4">
          <button 
            onClick={handleManualPrev}
            className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all active:scale-90"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleManualNext}
            className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all active:scale-90"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}