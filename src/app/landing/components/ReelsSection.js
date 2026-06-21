"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ReelsSection = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const reelsRef = useRef([]);

  // YouTube Shorts IDs
  const reelsData = [
    { id: 1, videoId: "HTAMLXDz7LY", title: "Urban Collection" },
    { id: 2, videoId: "uKl52F1GpHw", title: "Street Style" },
    { id: 3, videoId: "0GcfwOkB_OU", title: "Limited Edition" },
  ];

  // Add refs to the array
  const addToRefs = (el) => {
    if (el && !reelsRef.current.includes(el)) {
      reelsRef.current.push(el);
    }
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Title Entrance Animation on Scroll
      gsap.from(textRef.current, {
        y: 40, // Offset thoda kam kiya for smoothness
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", 
        },
      });

      // 2. Reels Staggered Pop-up Animation on Scroll
      gsap.from(reelsRef.current, {
        y: 80, // Niche se aane ka offset kam kiya taki footer me na phase
        scale: 0.95,
        opacity: 0,
        duration: 1,
        stagger: 0.15, 
        ease: "back.out(1.2)", 
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%", 
        },
      });
    }, sectionRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    
    <section ref={sectionRef} className="bg-[#0a0a0a] py-16 relative overflow-x-hidden">
      
      {/* Background aesthetic element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Title Section: mb-16 ko mb-10 kar diya taki gap kam ho */}
        <div className="text-center mb-10" ref={textRef}>
          <h2 className="text-white text-4xl md:text-5xl font-extrabold uppercase tracking-widest">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">Drops</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg md:text-xl">Watch our exclusive collections in motion.</p>
        </div>

        {/* 3 Reels in a Row: max-w-6xl ko max-w-4xl/5xl aur gap ko balance kiya */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {reelsData.map((reel, index) => (
            <div 
              key={reel.id} 
              ref={addToRefs}
              className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-black border border-gray-800 shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:border-gray-500"
            >
              {/* YouTube Iframe Player */}
              <iframe
                src={`https://www.youtube.com/embed/${reel.videoId}?autoplay=1&mute=1&loop=1&playlist=${reel.videoId}&controls=0&showinfo=0&modestbranding=1&rel=0`}
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none scale-105 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={reel.title}
              ></iframe>

              {/* Overlay for Text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

              {/* Reel Content / Title */}
              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <h3 className="text-white text-lg lg:text-xl font-bold uppercase tracking-wide translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {reel.title}
                </h3>
                <p className="text-gray-400 text-xs lg:text-sm mt-1 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                  Explore Now
                </p>
              </div>

              {/* Play Icon Indicator (Aesthetic) */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full border border-gray-600 pointer-events-none">
                 <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                 </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;