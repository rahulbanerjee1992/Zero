/**
 * Scroll Progress Hook
 * 
 * Tracks scroll position and provides utilities for scroll-based animations
 */

import { useState, useEffect, RefObject } from 'react';

export interface ScrollProgress {
    scrollY: number;
    scrollProgress: number; // 0-1
    direction: 'up' | 'down';
}

/**
 * Track overall page scroll progress
 */
export function useScrollProgress(): ScrollProgress {
    const [scrollY, setScrollY] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [direction, setDirection] = useState<'up' | 'down'>('down');
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Calculate progress (0-1)
            const maxScroll = documentHeight - windowHeight;
            const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

            // Determine direction
            const newDirection = currentScrollY > lastScrollY ? 'down' : 'up';

            setScrollY(currentScrollY);
            setScrollProgress(progress);
            setDirection(newDirection);
            setLastScrollY(currentScrollY);
        };

        // Throttle scroll events for performance
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', onScroll);
    }, [lastScrollY]);

    return { scrollY, scrollProgress, direction };
}

/**
 * Track scroll progress within a specific element
 */
export function useElementScrollProgress(ref: RefObject<HTMLElement>) {
    const [progress, setProgress] = useState(0);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const handleScroll = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementHeight = rect.height;

            // Check if element is in view
            const inView = rect.top < windowHeight && rect.bottom > 0;
            setIsInView(inView);

            if (!inView) {
                setProgress(rect.top > 0 ? 0 : 1);
                return;
            }

            // Calculate progress through element
            // 0 = top of element at bottom of viewport
            // 1 = bottom of element at top of viewport
            const scrolled = windowHeight - rect.top;
            const total = windowHeight + elementHeight;
            const elementProgress = Math.max(0, Math.min(1, scrolled / total));

            setProgress(elementProgress);
        };

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', onScroll);
    }, [ref]);

    return { progress, isInView };
}

/**
 * Trigger callback when scroll reaches threshold
 */
export function useScrollTrigger(
    threshold: number,
    callback: () => void,
    options?: { once?: boolean }
) {
    const { scrollProgress } = useScrollProgress();
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        if (options?.once && hasTriggered) return;

        if (scrollProgress >= threshold) {
            callback();
            setHasTriggered(true);
        }
    }, [scrollProgress, threshold, callback, options?.once, hasTriggered]);
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(elementId: string, offset: number = 0) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Auto-scroll to next section
 */
export function scrollToNextSection(currentSectionId: string) {
    const currentElement = document.getElementById(currentSectionId);
    if (!currentElement) return;

    const nextElement = currentElement.nextElementSibling as HTMLElement;
    if (!nextElement?.id) return;

    scrollToElement(nextElement.id);
}
