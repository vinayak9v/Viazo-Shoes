import { Layers, CloudRain, Shield, Leaf } from 'lucide-react';

export default function FeaturesBanner() {
  const features = [
    {
      id: 1,
      icon: Layers,
      title: "PREMIUM QUALITY",
      description: "Carefully crafted with high quality materials.",
    },
    {
      id: 2,
      icon: CloudRain, // Matching the cloud icon from the image
      title: "MAXIMUM COMFORT",
      description: "Designed for all-day comfort and style.",
    },
    {
      id: 3,
      icon: Shield,
      title: "DURABLE & RELIABLE",
      description: "Built to last. Made for every step you take.",
    },
    {
      id: 4,
      icon: Leaf,
      title: "SUSTAINABLE",
      description: "We care for the planet as much as you do.",
    },
  ];

  return (
    <section className="w-full bg-white py-12 border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout with Tailwind divide utility for vertical lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.id} 
                className="flex items-start gap-4 p-6 lg:px-8"
              >
                {/* Icon */}
                <Icon 
                  className="w-8 h-8 text-black shrink-0" 
                  strokeWidth={1.5} 
                />
                
                {/* Text Content */}
                <div>
                  <h3 className="text-[13px] font-bold text-black uppercase tracking-wider mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed pr-4">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}