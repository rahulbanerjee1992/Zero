'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathFinder, careers } from '@/context/PathFinderContext';
import ArchetypeAvatar from '@/components/ArchetypeAvatar';
import styles from './page.module.css';

type SelectionState = 'selection' | 'commitment';

export default function Recommendation() {
    const {
        getRecommendedCareer,
        selectedCareer,
        setSelectedCareer,
        getCareerExplanation
    } = usePathFinder();

    const [view, setView] = useState<SelectionState>('selection');
    const [recommendedCareer, setRecommendedCareer] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const recommended = getRecommendedCareer();
        setRecommendedCareer(recommended);
        if (!selectedCareer) {
            setSelectedCareer(recommended);
        }
    }, [getRecommendedCareer, selectedCareer, setSelectedCareer]);

    const handleCareerSelect = (career: string) => {
        if (view === 'commitment') return;
        setSelectedCareer(career);
        setShowInfo(false);
    };

    const handleContinue = () => {
        if (view === 'selection') {
            setView('commitment');
        } else {
            // Final commitment - logic for what happens after can be added here
            console.log("Committed to:", selectedCareer);
        }
    };

    const handleGoBack = () => {
        setSelectedCareer(recommendedCareer);
    };

    const careerExp = selectedCareer ? getCareerExplanation(selectedCareer) : null;
    const isActuallyRecommended = selectedCareer === recommendedCareer;

    return (
        <main className={`${styles.main} ${view === 'commitment' ? styles.commitmentView : ''}`}>
            <div className={styles.container}>
                {/* Spotlight Background Effect */}
                <div className={styles.spotlightOverlay} />

                {/* SCREEN 1: SELECTION */}
                <div className={`${styles.selectionScreen} ${view === 'commitment' ? styles.fadeScaleOut : ''}`}>
                    <h1 className={styles.heading}>
                        {isActuallyRecommended
                            ? "Our recommendation for you"
                            : "Exploring a different path"}
                    </h1>

                    <div className={styles.avatarRowContainer} ref={scrollRef}>
                        <div className={styles.avatarRow}>
                            {careers.map((career) => (
                                <ArchetypeAvatar
                                    key={career}
                                    career={career}
                                    isRecommended={career === recommendedCareer}
                                    isSelected={career === selectedCareer}
                                    isDimmed={selectedCareer !== null && career !== selectedCareer}
                                    onClick={() => handleCareerSelect(career)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.statusTag}>
                            <span>
                                {isActuallyRecommended
                                    ? "Recommended"
                                    : "Not recommended based on your responses"}
                            </span>
                            <button
                                className={styles.infoButton}
                                onClick={() => setShowInfo(!showInfo)}
                            >
                                ⓘ
                            </button>
                        </div>

                        {showInfo && (
                            <div className={styles.infoPanel}>
                                <p className={styles.infoText}>
                                    {careerExp?.alignmentDetail}
                                </p>
                            </div>
                        )}

                        {!isActuallyRecommended && (
                            <button className={styles.revertButton} onClick={handleGoBack}>
                                Go back to recommended path
                            </button>
                        )}
                    </div>

                    <div className={styles.ctaContainer}>
                        <button className="btn-primary" onClick={handleContinue}>
                            Continue with this path
                        </button>
                    </div>
                </div>

                {/* SCREEN 2: COMMITMENT */}
                {view === 'commitment' && (
                    <div className={styles.commitmentScreen}>
                        <div className={styles.leftCol}>
                            <div className={styles.largeAvatarContainer}>
                                <ArchetypeAvatar
                                    career={selectedCareer || ''}
                                    isSelected={true}
                                />
                            </div>
                        </div>

                        <div className={styles.rightCol}>
                            <h1 className={styles.title}>{selectedCareer}</h1>

                            <div className={styles.section}>
                                <p className={styles.qualities}>
                                    {careerExp?.qualities}
                                </p>
                            </div>

                            <div className={styles.section}>
                                <h3 className={styles.sectionHeader}>A day in the life</h3>
                                <p className={styles.description}>
                                    {careerExp?.dayInTheLife}
                                </p>
                            </div>

                            <div className={styles.videoSection}>
                                <div
                                    className={styles.videoPlaceholder}
                                    onClick={() => setIsVideoModalOpen(true)}
                                >
                                    <div className={styles.playIcon}>▶</div>
                                    <span className={styles.videoLabel}>{careerExp?.videoLabel}</span>
                                </div>
                            </div>

                            <div className={styles.finalCta}>
                                <button className="btn-primary" onClick={() => window.location.href = '/'}>
                                    Commit to this path
                                </button>
                                <button className={styles.backLink} onClick={() => setView('selection')}>
                                    Go back to selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* VIDEO MODAL */}
            {isVideoModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsVideoModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeModal} onClick={() => setIsVideoModalOpen(false)}>✕</button>
                        <div className={styles.videoPlayer}>
                            <div className={styles.placeholderVideo}>
                                <p>Previewing <strong>{selectedCareer}</strong></p>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>[Video Content Placeholder]</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
