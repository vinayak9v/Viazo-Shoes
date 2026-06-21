"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const MarqueeSection = () => {
  // Container ref for GSAP context
  const sectionRef = useRef(null); 
  const textRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  const imagesRow1 = [
    "/v1.jpeg", "/v2.jpeg", "/v3.jpeg", "/v4.jpeg",
    "/v5.jpeg", "/v6.jpeg", "/v7.jpeg", "/v8.jpeg",
  ];

  const imagesRow2 = [
    "/v9.jpeg", "/v10.jpeg", "/v11.jpeg", "/v12.jpeg",
    "/v13.jpeg", "/v14.jpeg", "/v15.jpeg", "/v16.jpeg",
  ];

  useEffect(() => {
    // gsap.context helps clean up animations when component unmounts
    let ctx = gsap.context(() => {
      
      // 1. EXTRA ANIMATION: Title Text Fade In & Slide Up
      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // 2. EXTRA ANIMATION: Images Pop-in Effect
      gsap.from(".gallery-img", {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        stagger: 0.05, // Ek ke baad ek image aayegi
        ease: "back.out(1.5)",
      });

      // Row 1: Moves Left
      const tween1 = gsap.to(row1Ref.current, {
        xPercent: -50,
        ease: "none",
        duration: 25, // Normal base duration
        repeat: -1,
      });

      // Row 2: Moves Right
      const tween2 = gsap.fromTo(
        row2Ref.current,
        { xPercent: -50 },
        {
          xPercent: 0,
          ease: "none",
          duration: 25, // Normal base duration
          repeat: -1,
        }
      );

      // --- FAST TO SLOW LOGIC ---
      
      // Ekdam fast speed (20x speed) se start hoga
      tween1.timeScale(20);
      tween2.timeScale(20);

      // Thik 3 seconds baad slow down hona start hoga
      gsap.to([tween1, tween2], {
        timeScale: 1, // Wapas normal speed (1x) pe aayega
        duration: 2.5, // Dheere-dheere slow hone me 2.5s lagenge (premium feel)
        ease: "expo.out", // Smooth deceleration (car ke brake jaisa)
        delay: 3, // Start hone ke 3 seconds baad ye chalega
      });

    }, sectionRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-20 overflow-hidden relative">
      {/* Title / Heading for the section */}
      <div className="container mx-auto px-6 mb-12" ref={textRef}>
        <h2 className="text-white text-4xl font-bold uppercase tracking-wide">
          Trending <span className="text-gray-500"></span>
        </h2>
      </div>

      {/* Row 1 - Moving Left */}
      <div className="flex w-max mb-8" ref={row1Ref}>
        {[...imagesRow1, ...imagesRow1].map((src, index) => (
          <div key={index} className="gallery-img w-[300px] md:w-[400px] mx-4 shrink-0">
            <img
              src={src}
              alt={`Gallery 1 - ${index}`}
              className="w-full h-[250px] object-cover rounded-xl border border-gray-800 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        ))}
      </div>

      {/* Row 2 - Moving Right */}
      <div className="flex w-max" ref={row2Ref}>
        {[...imagesRow2, ...imagesRow2].map((src, index) => (
          <div key={index} className="gallery-img w-[300px] md:w-[400px] mx-4 shrink-0">
            <img
              src={src}
              alt={`Gallery 2 - ${index}`}
              className="w-full h-[250px] object-cover rounded-xl border border-gray-800 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlays for smooth fading at the screen edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
    </section>
  );
};

export default MarqueeSection;