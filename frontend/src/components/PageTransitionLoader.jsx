import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InfinityLoader } from './ui/loader-13';

const PageTransitionLoader = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Show loader on route change
        setLoading(true);

        // Hide after 1 second as requested
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [location]); // Trigger on location change

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex flex-col items-center gap-4">
                <InfinityLoader className="text-primary w-24 h-24" size={100} />
                <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
};

export default PageTransitionLoader;
