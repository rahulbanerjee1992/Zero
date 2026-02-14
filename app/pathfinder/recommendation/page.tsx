'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder, careers } from '@/context/PathFinderContext';
import ArchetypeAvatar from '@/components/ArchetypeAvatar';
import { CareerName } from '@/utils/careerScoring';
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
        assessmentResult,
        getRecommendedCareer,
        selectedCareer,
        setSelectedCareer,
        getCareerExplanation,
        resetPathFinder,
        testStatus
    } = usePathFinder();

    const [recommendedCareer, setRecommendedCareer] = useState('');

    // View State: 'selection' (Carousel) | 'detail' (Full Page)
    const [viewState, setViewState] = useState<'selection' | 'detail'>('selection');

    // Info Toggle State for Selection Screen
    const [showInfo, setShowInfo] = useState(false);

    // Video Modal State for Detail Screen
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
            const idx = careers.indexOf(recommended as CareerName);
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
            const idx = careers.indexOf(selectedCareer as CareerName);
            if (idx !== -1 && idx !== activeIndex) {
                setActiveIndex(idx);
                // Reset info toggle when switching careers
                setShowInfo(false);
            }
        }
    }, [selectedCareer, activeIndex]);

    const handleCareerSelect = (career: string) => {
        // Selection State Logic
        setSelectedCareer(career);
        // We do strictly what the carousel needs.
    };

    const handleSwitchToRecommended = () => {
        setSelectedCareer(recommendedCareer);
        const idx = careers.indexOf(recommendedCareer as CareerName);
        if (idx >= 0) setActiveIndex(idx);
    };

    const handleContinueToDetail = () => {
        setViewState('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToRecommended = () => {
        setSelectedCareer(recommendedCareer);
    };

    const handleCommit = () => {
        router.push('/signup?career=' + encodeURIComponent(selectedCareer || ''));
    };

    const handleBackToSelection = () => {
        setViewState('selection');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRetakeTest = () => {
        if (window.confirm("Are you sure you want to retake the test? All progress will be lost.")) {
            resetPathFinder();
            router.push('/pathfinder/intro');
        }
    };

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    // The Trio: Exact 3 items (Left, Center, Right)
    const trio = useMemo(() => {
        const len = careers.length;
        const leftIndex = (activeIndex - 1 + len) % len;
        const rightIndex = (activeIndex + 1) % len;
        return [
            { position: 'left', career: careers[leftIndex] },
            { position: 'center', career: careers[activeIndex] },
            { position: 'right', career: careers[rightIndex] }
        ];
    }, [activeIndex]);

    // Get Explanation for SELECTED career (Detailed View)
    const explanation = selectedCareer ? getCareerExplanation(selectedCareer) : null;
    const isRecommendedSelected = selectedCareer === recommendedCareer;

    // Helper to get data for CAROUSEL cards
    const getCardProps = (career: CareerName) => {
        const exp = getCareerExplanation(career);
        return {
            career,
            fitLabel: exp?.status,
            shortReason: exp?.shortReason,
            isRecommended: career === recommendedCareer
        };
    };

    return (
        <main className={styles.main}>

            <div className={styles.container}>
                <div
                    className={styles.spotlightOverlay}
                    style={{
                        '--spotlight-x': '50%',
                    } as React.CSSProperties}
                />

                {/* STEP 1: SELECTION (Carousel) - Only visible in 'selection' state */}
                {viewState === 'selection' && (
                    <div className={styles.selectionScreen}>
                        <div className={styles.header}>
                            <p className={styles.statusLabel}>CAREER EXPLORER</p>
                            <h1 className={styles.heading}>
                                Select a Path
                            </h1>
                        </div>

                        {/* CAROUSEL */}
                        <div className={styles.trioViewport}>
                            <div className={styles.trioRow}>
                                {trio.map((item) => {
                                    const props = getCardProps(item.career as CareerName);
                                    return (
                                        <div
                                            key={`${item.career}-${item.position}`}
                                            className={`${styles.avatarWrapper} ${styles[item.position]}`}
                                        >
                                            <ArchetypeAvatar
                                                career={props.career}
                                                matchStrength={props.fitLabel}
                                                shortInsight={props.shortReason}
                                                isRecommended={props.isRecommended}
                                                isSelected={item.position === 'center'}
                                                isDimmed={item.position !== 'center'}
                                                sex={currentUser?.sex}
                                                onClick={() => handleCareerSelect(item.career)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. LINK + INFO ROW (STRICT TEXT LINK) */}
                        <div className={styles.linkInfoRow}>
                            <div className={styles.linkWithIcon}>
                                <span className={isRecommendedSelected ? styles.checkIcon : styles.warningIcon}>
                                    {isRecommendedSelected ? '✓' : '⚠️'}
                                </span>
                                <span
                                    className={`${styles.clickableLinkText} ${!isRecommendedSelected ? styles.warning : ''}`}
                                    onClick={handleContinueToDetail}
                                >
                                    {isRecommendedSelected
                                        ? "See why this career suits you"
                                        : "See why this career doesn't suit you"
                                    }
                                </span>
                                <button
                                    className={styles.infoIconButton}
                                    onClick={toggleInfo}
                                    aria-label="Toggle Info"
                                >
                                    ℹ️
                                </button>
                            </div>
                        </div>

                        {/* 3. COLLAPSIBLE INSIGHT PANEL (BULLETED TRAITS) */}
                        {showInfo && explanation && (
                            <div className={styles.inlineInfoPanel}>
                                <div className={styles.infoContent}>
                                    <ul className={styles.traitList}>
                                        {explanation.insightBullets.map((bullet, idx) => (
                                            <li key={idx} className={`${styles.traitItem} ${!isRecommendedSelected ? styles.warning : ''}`}>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* 4. CTA STACK (STRICT ORDER) */}
                        <div className={styles.detailCtaStack} style={{ marginTop: '32px', width: '100%', maxWidth: '480px' }}>
                            {isRecommendedSelected ? (
                                // RECOMMENDED: Continue, Retake
                                <>
                                    <button className={styles.primaryButton} onClick={handleContinueToDetail}>
                                        Continue
                                    </button>
                                    <button className={styles.tertiaryButton} onClick={handleRetakeTest}>
                                        Retake personality test
                                    </button>
                                </>
                            ) : (
                                // NON-RECOMMENDED: Switch (Wide), Continue, Retake
                                <>
                                    <button className={styles.primaryButton} onClick={handleSwitchToRecommended} style={{ width: '100%' }}>
                                        Switch to recommended path
                                    </button>
                                    <button className={styles.secondaryButton} onClick={handleContinueToDetail}>
                                        Continue
                                    </button>
                                    <button className={styles.tertiaryButton} onClick={handleRetakeTest}>
                                        Retake personality test
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 2: DETAIL PAGE - Only visible in 'detail' state */}
                {viewState === 'detail' && selectedCareer && explanation && (
                    <div className={styles.detailContainer}>

                        {/* LEFT: FULL BODY AVATAR */}
                        <div className={styles.detailLeft}>
                            <ArchetypeAvatar
                                career={selectedCareer}
                                subtitle={careerSubtitles[selectedCareer]}
                                isFullBody={true}
                                isFrameless={true}
                                hideTitle={true}
                                sex={currentUser?.sex}
                            />
                        </div>

                        {/* RIGHT: NARRATIVE CONTENT */}
                        <div className={styles.detailRight}>

                            {/* 1. LARGE CAREER TITLE (H1 ONLY) */}
                            <h1 className={styles.detailTitleOnly}>
                                {selectedCareer}
                            </h1>

                            {/* 2. SHORT ALIGNMENT SUMMARY (1 SENTENCE) */}
                            <p className={styles.shortSummary}>
                                {explanation.headline}
                            </p>

                            {/* 2. DAY-TO-DAY REALITY */}
                            <div className={styles.narrativeSection}>
                                <h3 className={styles.narrativeTitle}>Day-to-day reality</h3>
                                <p className={styles.narrativeText}>
                                    {explanation.daily_reality.charAt(0).toUpperCase() + explanation.daily_reality.slice(1)}
                                </p>
                            </div>

                            {/* 5. WHAT SURPRISES BEGINNERS */}
                            <div className={styles.narrativeSection}>
                                <h3 className={styles.narrativeTitle}>What surprises beginners</h3>
                                <p className={styles.narrativeText}>
                                    {explanation.surprises}
                                </p>
                            </div>

                            {/* 6. DAY IN THE LIFE INTERACTION */}
                            <div className={styles.videoInteractionContainer}>
                                <div
                                    className={styles.videoThumbnailPlaceholder}
                                    onClick={() => setIsVideoModalOpen(true)}
                                >
                                    <div className={styles.playIcon}>▶</div>
                                </div>
                                <button
                                    className={styles.videoLink}
                                    onClick={() => setIsVideoModalOpen(true)}
                                >
                                    → See what a day in the life of a {selectedCareer} is like
                                </button>
                            </div>

                            {/* STEP 2 ACTIONS: STRICT QUADRANT LOGIC */}
                            <div className={styles.detailCtaStack} style={{ marginTop: '32px' }}>
                                {isRecommendedSelected ? (
                                    // RECOMMENDED: Commit, Back, Retake
                                    <>
                                        <button className={styles.primaryButton} onClick={handleCommit}>
                                            Commit to this path
                                        </button>
                                        <button className={styles.secondaryButton} onClick={handleBackToSelection}>
                                            Back to career selection
                                        </button>
                                        <button className={styles.tertiaryButton} onClick={handleRetakeTest}>
                                            Retake personality test
                                        </button>
                                    </>
                                ) : (
                                    // NON-RECOMMENDED: Switch, Back, Commit (Continue), Retake
                                    <>
                                        <button className={styles.primaryButton} onClick={handleSwitchToRecommended}>
                                            Switch to recommended path
                                        </button>
                                        <button className={styles.secondaryButton} onClick={handleBackToSelection}>
                                            Back to career selection
                                        </button>
                                        <button
                                            className={styles.tertiaryButton}
                                            onClick={handleCommit}
                                        >
                                            Continue (commit anyway)
                                        </button>
                                        <button className={styles.tertiaryButton} onClick={handleRetakeTest}>
                                            Retake personality test
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                )}

            </div>

            {/* VIDEO MODAL / MINI-PLAYER */}
            {isVideoModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsVideoModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button
                            className={styles.closeModal}
                            onClick={() => setIsVideoModalOpen(false)}
                        >
                            ✕
                        </button>
                        <div className={styles.videoPlayerMock}>
                            <div className={styles.mockPlayLarge}>▶</div>
                            <p>Video Playing: {selectedCareer} Experience</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
