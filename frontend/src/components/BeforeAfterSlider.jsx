import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BeforeAfterSlider({ beforeImage, afterImage }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((e.clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((e.touches[0].clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image (Background) */}
      <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-bold pointer-events-none">BEFORE</div>

      {/* After Image (Foreground, clipped) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        <div className="absolute top-4 right-4 bg-success/80 text-white px-2 py-1 rounded text-xs font-bold pointer-events-none">AFTER</div>
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white border-2 border-primary rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M18 8L22 12L18 16" />
            <path d="M6 8L2 12L6 16" />
          </svg>
        </div>
      </div>
    </div>
  );
}
