import React, { useEffect, useState } from 'react';

const BackgroundBubbles = () => {
    const [bubbles, setBubbles] = useState([]);

    useEffect(() => {
        const newBubbles = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 40 + 20}px`,
            animationDuration: `${Math.random() * 10 + 15}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.4 + 0.6, // Higher base opacity (0.6 - 1.0)
            glowColor: Math.random() > 0.5 ? '#06b6d4' : '#3b82f6' // Cyan vs Blue (Solid Hex for max intensity)
        }));
        setBubbles(newBubbles);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0,
            pointerEvents: 'none'
        }}>
            {bubbles.map(b => (
                <div
                    key={b.id}
                    style={{
                        position: 'absolute',
                        bottom: '-100px',
                        left: b.left,
                        width: b.size,
                        height: b.size,
                        borderRadius: '50%',
                        // High Contrast Gradient: Bright White Core -> Transparent
                        background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, rgba(255,255,255,0.8) 20%, transparent 80%)',
                        // Strong Border
                        border: '1.5px solid rgba(255, 255, 255, 0.9)',
                        animation: `bubbleRise ${b.animationDuration} infinite ease-in-out`,
                        animationDelay: b.animationDelay,
                        opacity: b.opacity,
                        // Intense Double Layer Glow
                        boxShadow: `0 0 15px ${b.glowColor}, 0 0 30px ${b.glowColor}, inset 0 0 5px rgba(255, 255, 255, 0.8)`,
                        backdropFilter: 'contrast(1.2) brightness(1.2)' // Enhance background behind bubble
                    }}
                />
            ))}
        </div>
    );
};

export default BackgroundBubbles;
