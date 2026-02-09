'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

export default function Commit() {
    const router = useRouter();
    const { selectedCareer } = usePathFinder();
    const [showVideo, setShowVideo] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setTimeout(() => setIsAnimated(true), 100);
    }, []);

    if (!selectedCareer) {
        router.push('/pathfinder/recommendation');
        return null;
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const getColor = (name: string) => {
        const colors = [
            '#2563eb', '#7c3aed', '#db2777', '#dc2626',
            '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#4f46e5'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    const getQuote = (career: string) => {
        const quotes: { [key: string]: string } = {
            'Software Engineering': 'Build systems that scale.',
            'Data Science': 'Turn data into decisions.',
            'Business Analyst': 'Bridge data with organizational impact.',
            'Marketing': 'Tell stories that resonate.',
            'Sales': 'Build relationships that last.',
            'Security Engineering / Cyber Security': 'Defend the digital frontier.',
            'AI / Machine Learning': 'Train the future of intelligence.',
            'UX / UI Design': 'Design experiences that delight.',
            'Product / Project Management': 'Deliver strategy that matters.'
        };
        return quotes[career] || 'Make an impact.';
    };

    return (
        <main className={styles.main}>
            <div className={`${styles.container} ${isAnimated ? styles.animated : ''}`}>
                <div className={styles.avatarSection}>
                    <div
                        className={styles.largeAvatar}
                        style={{ backgroundColor: getColor(selectedCareer) }}
                    >
                        <span className={styles.initials}>{getInitials(selectedCareer)}</span>
                    </div>
                </div>

                <div className={styles.contentSection}>
                    <h1 className={styles.careerName}>{selectedCareer}</h1>
                    <p className={styles.quote}>{getQuote(selectedCareer)}</p>

                    <div className={styles.body}>
                        <p>Let's show you what a real day in this role looks like.</p>
                    </div>

                    <div className={styles.videoSection}>
                        <button
                            className={styles.videoPlaceholder}
                            onClick={() => setShowVideo(!showVideo)}
                        >
                            <div className={styles.playButton}>▶</div>
                            <p className={styles.videoLabel}>Day in the life</p>
                        </button>
                        {showVideo && (
                            <p className={styles.videoNote}>Video placeholder - shows typical day as {selectedCareer}</p>
                        )}
                    </div>

                    <div className={styles.commitSection}>
                        <button
                            className="btn-primary"
                            onClick={() => router.push('/pathfinder/complete')}
                        >
                            Commit and continue
                        </button>
                        <p className={styles.commitNote}>This is a long-term focus.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
