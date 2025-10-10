import React, { useEffect, useState } from 'react'
import './funfacts.css'

const FunFacts = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('animate-in');
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('');

  const facts = [
    "Talk is cheap. Show me the code. — Linus Torvalds",
    "First, solve the problem. Then, write the code. — John Johnson",
    "Code is like humor. When you have to explain it, it's bad. — Cory House",
    "Programs must be written for people to read, and only incidentally for machines to execute. — Harold Abelson",
    "Make it work, make it right, make it fast. — Kent Beck",
    "The only way to learn a new programming language is by writing programs in it. — Dennis Ritchie",
    "Programming isn't about what you know; it's about what you can figure out. — Chris Pine",
    "Clean code always looks like it was written by someone who cares. — Robert C. Martin",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler",
    "The best error message is the one that never shows up. — Thomas Fuchs"
  ];

  const handleCarouselNavigate = (dir) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(dir);
    
    // Trigger exit animation
    setAnimationClass('animate-out');
    
    // Wait for exit animation to complete before changing content
    setTimeout(() => {
      if (dir === 'next') {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
      } else {
        setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length);
      }
      
      // Trigger enter animation
      setAnimationClass('animate-in');
      
      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
        setDirection('');
      }, 1000);
    }, 400);
  };

  const handleDotClick = (index) => {
    if (isAnimating || index === currentFactIndex) return;
    
    setIsAnimating(true);
    setDirection('dot');
    setAnimationClass('animate-out');
    
    setTimeout(() => {
      setCurrentFactIndex(index);
      setAnimationClass('animate-in');
      
      setTimeout(() => {
        setIsAnimating(false);
        setDirection('');
      }, 1000);
    }, 400);
  };

  // Auto-rotate facts
  useEffect(() => {
    const interval = setInterval(() => {
      handleCarouselNavigate('next');
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section id="fun-facts" className="fun-facts">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Fun Facts</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Inspiring quotes that guide my coding journey</p>
        </div>

        <div className="carousel-container">
          <button
            className="carousel-btn carousel-btn-prev"
            onClick={() => handleCarouselNavigate('prev')}
            aria-label="Previous fact"
            disabled={isAnimating}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="carousel-track">
            <div className={`carousel-slide active ${animationClass} ${direction}`}>
              <div className="fact-content">
                <div className="fact-quote-icon">❛❛</div>
                <p className="fact-text">{facts[currentFactIndex]}</p>
                <div className="fact-counter">
                  {currentFactIndex + 1} / {facts.length}
                </div>
              </div>
            </div>
          </div>

          <button
            className="carousel-btn carousel-btn-next"
            onClick={() => handleCarouselNavigate('next')}
            aria-label="Next fact"
            disabled={isAnimating}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="carousel-dots">
          {facts.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentFactIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to fact ${index + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FunFacts