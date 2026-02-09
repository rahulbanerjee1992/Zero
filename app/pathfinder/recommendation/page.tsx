'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder, careers } from '@/context/PathFinderContext';
import ArchetypeAvatar from '@/components/ArchetypeAvatar';
import styles from './page.module.css';


const careerSubtitles: Record<string, string> = {
    'Software Engineering': 'Systems Architecture',
    'Data Science': 'Applied Analytics',
    'Business Analyst': 'Enterprise Insights',
    'Marketing': 'Brand Growth',
    'Sales': 'Client Advocacy',
    'Security Engineering / Cyber Security': 'Digital Defense',
    'AI / Machine Learning': 'Neural Systems',
    'UX / UI Design': 'Human Experience',
    'Product / Project Management': 'Strategic Delivery'
};

export default function Recommendation() {
    const router = useRouter();
    const {
        currentUser,
        getRecommendedCareer,
        selectedCareer,
        setSelectedCareer,
        getCareerExplanation,
        resetPathFinder,
        testStatus
    } = usePathFinder();

    const [recommendedCareer, setRecommendedCareer] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    // Use a simple index for the selected career (0-8)
    const [activeIndex, setActiveIndex] = useState(0);
    const hasInitialSet = useRef(false);

    // Access control
    useEffect(() => {
        if (testStatus !== 'COMPLETED') {
            router.push('/pathfinder/intro');
        }
    }, [testStatus, router]);

    useEffect(() => {
        if (testStatus === 'COMPLETED' && !hasInitialSet.current) {
            const recommended = getRecommendedCareer();
            setRecommendedCareer(recommended);
            setSelectedCareer(recommended);
            const idx = careers.indexOf(recommended);
            setActiveIndex(idx >= 0 ? idx : 0);
            hasInitialSet.current = true;
        }
    }, [getRecommendedCareer, setSelectedCareer, testStatus]);

    // Also update recommendedCareer if it changes even after initial set
    useEffect(() => {
        if (testStatus === 'COMPLETED') {
            setRecommendedCareer(getRecommendedCareer());
        }
    }, [getRecommendedCareer, testStatus]);

    useEffect(() => {
        if (selectedCareer) {
            const idx = careers.indexOf(selectedCareer);
            if (idx !== -1 && idx !== activeIndex) {
                setActiveIndex(idx);
            }
        }
    }, [selectedCareer, activeIndex]);

    const handleCareerSelect = (career: string) => {
        setSelectedCareer(career);
        setShowInfo(false);
    };

    const handleContinue = () => {
        router.push('/pathfinder/confirm');
    };

    const handleGoBackToRecommended = () => {
        setSelectedCareer(recommendedCareer);
    };

    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const handleRetakeTest = () => {
        resetPathFinder();
        router.push('/pathfinder/questions');
    };

    const careerExp = selectedCareer ? getCareerExplanation(selectedCareer) : null;
    const isActuallyRecommended = selectedCareer === recommendedCareer;

    // The Trio: Exact 3 items (Left, Center, Right)
    const trio = useMemo(() => {
        const len = careers.length;
        const leftIdx = (activeIndex - 1 + len) % len;
        const rightIdx = (activeIndex + 1) % len;

        return [
            { career: careers[leftIdx], index: leftIdx, position: 'left' },
            { career: careers[activeIndex], index: activeIndex, position: 'center' },
            { career: careers[rightIdx], index: rightIdx, position: 'right' }
        ];
    }, [activeIndex]);

    return (
        <main className={styles.main}>

            <div className={styles.container}>
                {/* Spotlight Background Effect - Locked to center */}
                <div
                    className={styles.spotlightOverlay}
                    style={{
                        '--spotlight-x': '50%',
                    } as React.CSSProperties}
                />

                {/* SCREEN 1: SELECTION */}
                <div className={styles.selectionScreen}>
                    <div className={styles.header}>
                        <p className={styles.statusLabel}>ANALYSIS COMPLETE</p>
                        <h1 className={styles.heading}>
                            {isActuallyRecommended ? "Your Recommended Path" : "Career Comparison"}
                        </h1>
                    </div>

                    {/* TRIO VIEWPORT */}
                    <div className={styles.trioViewport}>
                        <div className={styles.trioRow}>
                            {trio.map((item) => (
                                <div
                                    key={`${item.career}-${item.position}`}
                                    className={`${styles.avatarWrapper} ${styles[item.position]}`}
                                >
                                    <ArchetypeAvatar
                                        career={item.career}
                                        subtitle={careerSubtitles[item.career]}
                                        isRecommended={item.career === recommendedCareer}
                                        isSelected={item.position === 'center'}
                                        isDimmed={item.position !== 'center'}
                                        sex={currentUser?.sex}
                                        onClick={() => handleCareerSelect(item.career)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.interactionArea}>
                            <div className={`${styles.statusTag} ${isActuallyRecommended ? styles.recommendedColor : styles.warningColor}`}>
                                <span className={styles.statusIcon}>
                                    {isActuallyRecommended ? 'ⓘ' : '⚠️'}
                                </span>
                                <span>
                                    {isActuallyRecommended
                                        ? "See why this is the recommended fit for you"
                                        : "See why this career is not recommended for you"}
                                </span>
                                <button
                                    className={styles.infoButton}
                                    onClick={() => setShowInfo(!showInfo)}
                                    aria-label="Toggle info"
                                >
                                    {showInfo ? '✕' : 'ⓘ'}
                                </button>
                            </div>

                            {showInfo && careerExp && (
                                <div className={styles.infoPanel}>
                                    <div className={styles.infoPanelContent}>
                                        <p className={styles.infoPanelIntro}>
                                            {careerExp.qualitiesIntro}
                                        </p>
                                        <ul className={styles.qualitiesList}>
                                            {careerExp.qualities?.map((q, idx) => (
                                                <li key={idx} className={styles.qualityItem}>{q}</li>
                                            ))}
                                        </ul>

                                        {!isActuallyRecommended && (
                                            <p className={styles.fallbackRecommendation}>
                                                Based on your responses, this role may feel misaligned. We recommend <strong>{recommendedCareer}</strong> instead.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.ctaStack}>
                            {isActuallyRecommended ? (
                                <>
                                    <button className="btn-primary" onClick={handleContinue}>
                                        Continue
                                    </button>
                                    <button className={styles.btnTertiary} onClick={handleRetakeTest}>
                                        Retake personality test
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="btn-primary" onClick={handleGoBackToRecommended}>
                                        Switch to recommended path
                                    </button>
                                    <button className={styles.btnSecondary} onClick={handleContinue}>
                                        Continue with this path
                                    </button>
                                    <button className={styles.btnTertiary} onClick={handleRetakeTest}>
                                        Retake personality test
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
