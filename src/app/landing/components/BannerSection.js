import Image from 'next/image';

export default function BannerSection() {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 font-sans">
      
      {/* Left Side: Background Image */}
      <div className="relative w-full h-[60vh] md:h-auto md:min-h-[600px]">
        <Image
          // Demo Unsplash Image - Replace this with your actual downloaded image path later (e.g., '/street-banner.jpg')
          src="/banner (2).png"
          alt="Streetwear Style Sneaker"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Optional Overlay to slightly darken the image if needed */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Right Side: Content Area */}
      <div className="relative bg-black text-white p-12 md:p-20 lg:p-32 flex flex-col justify-center overflow-hidden">
        
        {/* Background Faint Watermark Logo */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <svg 
            width="500" 
            height="500" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
          >
            <path d="M2 2L12 22L22 2H16L12 12L8 2H2Z" fill="currentColor" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="relative z-10 max-w-md">
          <p className="text-[11px] font-bold tracking-[0.2em] text-gray-400 mb-5 uppercase">
            More Than Sneakers
          </p>
          
          <h2 className="text-4xl md:text-5xl lg:text-[54px] font-black uppercase leading-[1.1] mb-6 tracking-tight">
            A Movement.<br />
            A Lifestyle.<br />
            A Choice.
          </h2>
          
          <p className="text-sm text-gray-400 leading-relaxed mb-10 font-medium">
            We design for those who move with confidence and express themselves fearlessly.
          </p>
          
          <button className="bg-white text-black px-9 py-4 text-xs font-black tracking-widest hover:bg-gray-200 transition-transform active:scale-95 w-fit">
            EXPLORE NOW
          </button>
        </div>

      </div>
      
    </section>
  );
}