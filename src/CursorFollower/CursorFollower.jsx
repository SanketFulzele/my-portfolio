import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const outline = outlineRef.current;
    
    if (!dot || !outline) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    const speed = 0.15; // Adjust for smoothness (0.1 - 0.3 recommended)
    const outlineSpeed = 0.13; // Slightly slower for the outline

    const animate = () => {
      // Dot movement with easing
      dotX += (mouseX - dotX) * speed;
      dotY += (mouseY - dotY) * speed;
      
      // Outline movement with different easing
      outlineX += (mouseX - outlineX) * outlineSpeed;
      outlineY += (mouseY - outlineY) * outlineSpeed;
      
      // Apply transforms
      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
      
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate();

    // Hide cursor follower when mouse leaves window
    const handleMouseLeave = () => {
      dot.style.opacity = '0';
      outline.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      dot.style.opacity = '1';
      outline.style.opacity = '1';
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div className="cursor-follower">
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={outlineRef} className="cursor-outline"></div>
    </div>
  );
};

export default CursorFollower;