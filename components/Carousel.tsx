'use client';

import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

interface Placard {
    title: string;
    subtitle: string;
}

const placards: Placard[] = [
    {
        title: 'Choose once. Choose well.',
        subtitle: 'Your career path is a long-term commitment. Zero helps you decide deliberately.'
    },
    {
        title: 'Learn by doing real work',
        subtitle: 'No courses. No theory-first learning. You train inside realistic job simulations.'
    },
    {
        title: 'Clarity before commitment',
        subtitle: 'PathFinder helps you understand what different careers actually feel like.'
    }
];

export default function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % placards.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + placards.length) % placards.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % placards.length);
    };

    return (
        <div className={styles.carousel}>
            <button className={styles.arrowLeft} onClick={goToPrevious} aria-label="Previous slide">
                ←
            </button>

            <div className={styles.placardContainer}>
                {placards.map((placard, index) => (
                    <div
                        key={index}
                        className={`${styles.placard} ${index === currentIndex ? styles.active : ''}`}
                    >
                        <h2 className={styles.title}>{placard.title}</h2>
                        <p className={styles.subtitle}>{placard.subtitle}</p>
                    </div>
                ))}
            </div>

            <button className={styles.arrowRight} onClick={goToNext} aria-label="Next slide">
                →
            </button>

            <div className={styles.indicators}>
                {placards.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
