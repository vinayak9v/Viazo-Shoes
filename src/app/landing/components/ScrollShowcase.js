'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Next.js mein SSR (Server Side Rendering) ke errors se bachne ke liye
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollShowcase() {
  const mainRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const textSectionRef = useRef(null);

  useGSAP(() => {
    
    // 1. HORIZONTAL SCROLL
    const totalScrollWidth = horizontalScrollRef.current.scrollWidth - window.innerWidth;

    gsap.to(horizontalScrollRef.current, {
      x: -totalScrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: horizontalSectionRef.current,
        start: "top top",
        end: () => `+=${totalScrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    // 2. TEXT REVEAL
    gsap.from(".reveal-line", {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: textSectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    // 3. PARALLAX CARDS
    gsap.utils.toArray('.parallax-card').forEach((card) => {
      gsap.fromTo(card,
        { y: 150, opacity: 0.2, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 40%",
            scrub: 1.5,
          }
        }
      );
    });

  }, { scope: mainRef });

  return (
    <div ref={mainRef} className="w-full bg-black text-white font-sans overflow-x-hidden">
      
      {/* Intro Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-center">
          Scroll <br/> To Explore
        </h1>
        <p className="mt-8 text-gray-500 uppercase tracking-widest text-sm animate-pulse">
          Scroll Down ↓
        </p>
      </section>

      {/* --- EFFECT 1: PINNED HORIZONTAL SCROLL --- */}
      <section ref={horizontalSectionRef} className="h-screen w-full overflow-hidden bg-[#0a0a0a]">
        <div 
          ref={horizontalScrollRef} 
          className="h-full w-[300vw] flex items-center px-20 gap-32"
        >
          <div className="w-[100vw] flex-shrink-0">
            <h2 className="text-[10vw] font-black leading-none text-white whitespace-nowrap uppercase">
              Beyond Limits.
            </h2>
          </div>
          <div className="w-[80vw] flex-shrink-0">
            <h2 className="text-[10vw] font-black leading-none text-transparent stroke-text whitespace-nowrap uppercase" style={{ WebkitTextStroke: '2px white' }}>
              Defy Gravity.
            </h2>
          </div>
          <div className="w-[80vw] flex-shrink-0 flex items-center justify-center">
            {/* Image 1 Container */}
            <div className="relative w-[500px] h-[600px] overflow-hidden rounded-xl">
               <Image 
                 src="/add.png" // Yahan apni image ka path daalein
                 alt="Gravity Defying Sneaker" 
                 fill 
                 className="object-cover"
               />
            </div>
          </div>
        </div>
      </section>

      {/* --- EFFECT 2: TEXT REVEAL --- */}
    {/* --- EFFECT 2: TEXT REVEAL & YOUTUBE VIDEO --- */}
      <section ref={textSectionRef} className="py-40 px-8 md:px-32 bg-black min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Text Content */}
        <div className="w-full overflow-hidden">
          <p className="reveal-line text-sm font-bold text-gray-500 tracking-[0.3em] uppercase mb-8">
            The Philosophy
          </p>
          <div className="overflow-hidden">
            <h3 className="reveal-line text-4xl md:text-6xl xl:text-7xl font-black uppercase leading-tight">
              We Don't Just
            </h3>
          </div>
          <div className="overflow-hidden">
            <h3 className="reveal-line text-4xl md:text-6xl xl:text-7xl font-black uppercase leading-tight text-gray-400">
              Make Sneakers.
            </h3>
          </div>
          <div className="overflow-hidden mt-6">
            <p className="reveal-line text-xl md:text-2xl text-gray-300 font-light max-w-xl">
              Every stitch, every sole, every design is engineered to push you forward. It's not about the shoes, it's about where they take you.
            </p>
          </div>
        </div>

        {/* Right Column: YouTube Video */}
   {/* --- White Product Frame --- */}
{/* --- Edge-to-Edge Shoppable Reel Frame --- */}
<div className="reveal-line bg-white rounded-[2.5rem] shadow-2xl relative max-w-[460px] mx-auto flex flex-col overflow-hidden">

    {/* Reels Size Video Container - Touches Top, Left, and Right Edges */}
    <div className="w-full aspect-[9/16] relative bg-black">
        {/* Viazo Runner Shorts Link */}
        <iframe
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none scale-105" 
        src="https://www.youtube.com/embed/5SXaeYOG20k?autoplay=1&mute=1&loop=1&playlist=5SXaeYOG20k&controls=0&showinfo=0"
        title="Viazo Runner Sneaker Reel"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        ></iframe>
    </div>

    {/* Bottom Area - Only white space is here for the button */}
    <div className="p-5 bg-white">
        <button className="w-full bg-black text-white text-lg font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group">
            Shop Now
            {/* Arrow Icon */}
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
        </button>
    </div>
    
</div>

      </section>

      {/* --- EFFECT 3: PARALLAX SCRUB CARDS --- */}
      <section className="py-32 px-8 md:px-20 bg-zinc-950 flex flex-col items-center gap-32">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-20">
          
          {/* Image 2 Container */}
          <div className="parallax-card relative w-full h-[500px] md:h-[700px] md:mt-32 rounded-xl overflow-hidden">
            <Image 
              src="/io (2).png" // Yahan apni image ka path daalein
              alt="Urban Grid Sneaker" 
              fill 
              className="object-cover"
            />
            <h4 className="absolute -bottom-10 left-0 text-3xl font-black uppercase z-10 drop-shadow-lg text-white">Urban Grid</h4>
          </div>

          {/* Image 3 Container */}
          <div className="parallax-card relative w-full h-[500px] md:h-[700px] rounded-xl overflow-hidden">
            <Image 
              src="/gyu.png" // Yahan apni image ka path daalein
              alt="Aero Tech Sneaker" 
              fill 
              className="object-cover"
            />
            <h4 className="absolute -bottom-10 right-0 text-3xl font-black uppercase z-10 drop-shadow-lg text-white">Aero Tech</h4>
          </div>

        </div>
      </section>

      {/* Footer Outro */}
      <section className="h-[50vh] flex items-center justify-center border-t border-zinc-900">
         <h2 className="text-2xl font-black tracking-widest text-zinc-600 uppercase">End of Sequence</h2>
      </section>

    </div>
  );
}