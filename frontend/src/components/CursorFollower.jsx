import React, { useState, useEffect, useRef } from 'react';

const CursorFollower = () => {
    const mainCursor = useRef(null);
    const ringCursor = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Track positions via refs for high-performance animation
    const mousePos = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });

    useEffect(() => {
        // Only enable on desktop
        if (!window.matchMedia("(pointer: fine)").matches) return;

        setIsVisible(true);
        document.body.style.cursor = 'none';

        const onMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            // Direct update for zero latency on main dot
            if (mainCursor.current) {
                mainCursor.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            }
        };

        const onMouseEnter = () => setIsHovering(true);
        const onMouseLeave = () => setIsHovering(false);

        // Observe DOM for interactive elements
        const addListeners = () => {
            document.querySelectorAll('a, button, input, textarea, [role="button"], .premium-card').forEach(el => {
                el.addEventListener('mouseenter', onMouseEnter);
                el.addEventListener('mouseleave', onMouseLeave);
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        addListeners();

        const observer = new MutationObserver(addListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        // Animation Loop
        let rafId;
        const animate = () => {
            // Smooth follow (Lerp)
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

            if (ringCursor.current) {
                ringCursor.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${isHovering ? 1.8 : 1})`;

                // Dynamic styling based on hover state (accessed via closure scope of this effect run)
                // Note: We need to rely on the re-render from isHovering change to update this closure logic
                // properly if we don't use refs for state. Since we dep on [isHovering], this works.
            }
            rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);

        const onWindowLeave = () => setIsVisible(false);
        const onWindowEnter = () => setIsVisible(true);
        document.addEventListener('mouseleave', onWindowLeave);
        document.addEventListener('mouseenter', onWindowEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onWindowLeave);
            document.removeEventListener('mouseenter', onWindowEnter);
            cancelAnimationFrame(rafId);
            observer.disconnect();
            document.body.style.cursor = 'auto';

            document.querySelectorAll('a, button, input').forEach(el => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, [isHovering]); // Re-run effect when hover state changes to update animation styling

    if (!isVisible) return null;

    return (
        <>
            {/* Main Dot */}
            <div
                ref={mainCursor}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#0ea5e9', // Ocean Blue
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transition: 'width 0.2s, height 0.2s', // Smooth resize if needed
                    mixBlendMode: 'difference' // Cool contrast effect
                }}
            />

            {/* Trailing Ring */}
            <div
                ref={ringCursor}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '32px',
                    height: '32px',
                    border: '1.5px solid rgba(14, 165, 233, 0.5)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transition: 'border-color 0.2s, background-color 0.2s', // Smooth color shift
                    backgroundColor: isHovering ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                    borderColor: isHovering ? 'rgba(14, 165, 233, 0.8)' : 'rgba(14, 165, 233, 0.5)'
                }}
            />
        </>
    );
};

export default CursorFollower;
