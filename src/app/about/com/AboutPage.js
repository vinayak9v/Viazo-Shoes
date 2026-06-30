'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Globe, Users, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function AboutPage() {
  const coreValues = [
    {
      icon: <ShieldCheck size={28} strokeWidth={1.5} />,
      title: "Authenticity",
      description: "Every drop is 100% verified. We believe in keeping sneaker culture real, transparent, and built on trust."
    },
    {
      icon: <Zap size={28} strokeWidth={1.5} />,
      title: "Innovation",
      description: "From our digital platforms to our physical packaging, we are constantly pushing the boundaries of retail."
    },
    {
      icon: <Users size={28} strokeWidth={1.5} />,
      title: "Community First",
      description: "Viazo isn't just a store; it's a movement. We empower creators, collectors, and casual wearers alike."
    },
    {
      icon: <Globe size={28} strokeWidth={1.5} />,
      title: "Global Reach",
      description: "Sneaker culture has no borders. We curate styles from around the world and deliver them straight to your door."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col pt-20 pb-24">
      
      {/* Page Header */}
      <div className="text-center px-4 mb-16 md:mb-24">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">
          Behind The Brand
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-black uppercase tracking-tight">
          Our Story
        </h1>
        <div className="w-12 h-[2px] bg-black mx-auto mt-6"></div>
      </div>

      {/* Story Section - Image & Text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Image Placeholder */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[4/5] bg-[#f4f4f4] flex items-center justify-center overflow-hidden">
              {/* Replace the content below with your actual image */}
              {/* <img src="/your-about-image.jpg" alt="Viazo Store" className="object-cover w-full h-full" /> */}
              
              <div className="text-center text-gray-400 flex flex-col items-center">
                <ImageIcon size={64} className="mb-4 opacity-50" />
                <p className="text-sm font-bold uppercase tracking-widest">Brand Image</p>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute top-0 left-0 w-full h-full border-[16px] border-white z-10 pointer-events-none mix-blend-overlay"></div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-tight mb-6">
              Redefining Sneaker Culture For The Modern Era.
            </h2>
            <div className="space-y-6 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                Founded in 2024, Viazo started with a simple idea: access to premium, authentic sneakers and streetwear shouldn't be complicated. We saw a gap between the passionate community and the chaotic secondary market, and we set out to bridge it.
              </p>
              <p>
                We are more than just a retailer. We are curators of style, deeply embedded in the culture we represent. Our team consists of industry veterans, passionate collectors, and forward-thinking technologists working together to build a seamless shopping experience.
              </p>
              <p>
                Whether you are hunting for a rare grail, looking for your daily beaters, or exploring upcoming streetwear trends, Viazo is built for every version of you.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-black py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
              Our Core Values
            </h2>
            <div className="w-12 h-[2px] bg-white mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
            {coreValues.map((value, index) => (
              <div key={index} className="flex flex-col items-center lg:items-start">
                <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Join the Movement CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mt-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-tight mb-4">
          Join The Movement
        </h2>
        <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
          Become a part of the Viazo community to get exclusive access to drops, members-only offers, and faster checkout.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/collections" 
            className="w-full sm:w-auto bg-black text-white text-[11px] font-bold uppercase tracking-widest py-4 px-10 hover:bg-gray-800 transition-colors"
          >
            Shop Collections
          </Link>
          <Link 
            href="/register" 
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-black border border-black text-[11px] font-bold uppercase tracking-widest py-4 px-10 hover:bg-black hover:text-white transition-colors"
          >
            Create Account
            <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

    </div>
  );
}