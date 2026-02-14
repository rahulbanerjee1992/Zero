'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
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

export default function ConfirmArchetype() {
    const router = useRouter();
    const {
        currentUser,
        selectedCareer,
        getRecommendedCareer,
        getCareerExplanation,
        setSelectedCareer,
        resetPathFinder,
        testStatus
    } = usePathFinder();

    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const recommendedCareer = getRecommendedCareer();

    // Access control
    useEffect(() => {
        if (testStatus !== 'COMPLETED' || !selectedCareer) {
            router.push('/pathfinder/recommendation');
        }
    }, [testStatus, selectedCareer, router]);

    if (!selectedCareer) return null;

    const careerExp = getCareerExplanation(selectedCareer);
    const isActuallyRecommended = selectedCareer === recommendedCareer;

    const handleBack = () => {
        router.push('/pathfinder/recommendation');
    };

    const handleSwitchToRecommended = () => {
        setSelectedCareer(recommendedCareer);
    };

    const handleRetakeTest = () => {
        resetPathFinder();
        router.push('/pathfinder/questions');
    };

    const handleCommit = () => {
        router.push('/pathfinder/complete');
    };

    return (
        <main className={styles.main}>
            {/* Video Player Overlay */}
            {isVideoOpen && (
                <div className={styles.videoOverlay}>
                    <div className={styles.playerContainer}>
                        <button
                            className={styles.closeVideo}
                            onClick={() => setIsVideoOpen(false)}
                        >
                            ✕
                        </button>
                        <div className={styles.videoMock}>
                            <div className={styles.videoInfo}>
                                <p className={styles.videoTitle}>Simulation: A day in the life</p>
                                <p className={styles.videoSubtitle}>{selectedCareer}</p>
                            </div>
                            <div className={styles.videoControls}>
                                <div className={styles.playBtnMini}>▶</div>
                                <div className={styles.progressBarWrapper}>
                                    <div className={styles.progressBarMock} />
                                </div>
                                <div className={styles.timeInfo}>0:45 / 2:30</div>
                                <div className={styles.volumeIcon}>🔊</div>
                                <div className={styles.fullscreenIcon}>⛶</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                <div className={styles.leftCol}>
                    <div className={styles.fullBodyAvatarWrapper}>
                        <ArchetypeAvatar
                            career={selectedCareer}
                            subtitle={careerSubtitles[selectedCareer]}
                            isFullBody={true}
                            isFrameless={false}
                            sex={currentUser?.sex}
                        />
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <h1 className={styles.professionTitle}>{selectedCareer}</h1>

                    {/* Insight Box - Concrete Reasons, no generic praise */}
                    <div className={`${styles.insightBox} ${isActuallyRecommended ? styles.recommendedInsight : styles.warningInsight}`}>
                        {isActuallyRecommended ? (
                            <>
                                <p className={styles.insightText}>Why this matches your profile:</p>
                                <ul className={styles.qualitiesList}>
                                    {careerExp?.why_it_fits?.slice(0, 3).map((q: string, idx: number) => (
                                        <li key={idx} className={styles.traitItem}>{q}</li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <>
                                <p className={styles.insightText}>Points of consideration for this path:</p>
                                <ul className={styles.qualitiesList}>
                                    {/* Career Requirements */}
                                    {careerExp?.why_it_fits?.slice(0, 2).map((q: string, idx: number) => (
                                        <li key={`req-${idx}`} className={styles.traitItem}>
                                            Typically requires: {q}
                                        </li>
                                    ))}
                                    {/* Non-alignment points */}
                                    {careerExp?.why_it_may_not?.slice(0, 2).map((q: string, idx: number) => (
                                        <li key={`gap-${idx}`} className={styles.traitItem}>
                                            Potentially challenging: {q}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>

                    {/* Video Section - Compact label and thumbnail */}
                    <div className={styles.videoSection}>
                        <h3 className={styles.sectionHeader}>
                            See what a day in the life of a {selectedCareer} is like
                        </h3>
                        <div
                            className={styles.videoPlaceholder}
                            onClick={() => setIsVideoOpen(true)}
                        >
                            <div className={styles.playIcon}>▶</div>
                        </div>
                    </div>

                    {/* CTA Stack - Strict ordering and logic */}
                    <div className={styles.finalCtaStack}>
                        {isActuallyRecommended ? (
                            <>
                                <button className="btn-primary" onClick={handleCommit}>
                                    Commit to this path
                                </button>
                                <button className={styles.btnSecondary} onClick={handleBack}>
                                    Back to career selection
                                </button>
                                <button className={styles.btnTertiary} onClick={handleRetakeTest}>
                                    Retake personality test
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary" onClick={handleSwitchToRecommended}>
                                    Switch to recommended career path
                                </button>
                                <button className={styles.btnSecondary} onClick={handleBack}>
                                    Back to career selection
                                </button>
                                <button className={styles.btnTertiary} onClick={handleRetakeTest}>
                                    Retake personality test
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
