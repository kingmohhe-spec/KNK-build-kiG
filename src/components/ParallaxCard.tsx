import { useRef, useState, useEffect, type ReactNode } from 'react';

interface ParallaxCardProps {
  image: string;
  imageHeight: string;
  children: ReactNode;
}

export default function ParallaxCard({ image, imageHeight, children }: ParallaxCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = elementCenter - viewportCenter;
      setOffset(distance * -0.12);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1"
    >
      <div className={`${imageHeight} overflow-hidden bg-gray-200 relative`}>
        <img
          src={image}
          alt=""
          className="w-full h-[130%] object-cover"
          style={{
            transform: `translateY(${offset}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      {children}
    </div>
  );
}
