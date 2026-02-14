'use client';

import React from 'react';
import styles from './ArchetypeAvatar.module.css';

interface ArchetypeAvatarProps {
    career: string;
    subtitle?: string;
    matchStrength?: string;
    shortInsight?: string;
    hideTitle?: boolean;
    isRecommended?: boolean;
    isSelected?: boolean;
    isDimmed?: boolean;
    isFullBody?: boolean;
    isFrameless?: boolean;
    sex?: string;
    onClick?: () => void;
}

export default function ArchetypeAvatar({
    career,
    subtitle,
    matchStrength,
    shortInsight,
    hideTitle = false,
    isRecommended = false,
    isSelected = false,
    isDimmed = false,
    isFullBody = false,
    isFrameless = false,
    sex,
    onClick
}: ArchetypeAvatarProps) {
    const [imgError, setImgError] = React.useState(false);

    // Reset error when career changes
    React.useEffect(() => {
        setImgError(false);
    }, [career, sex]);

    const getAvatarFilename = (career: string, sex?: string) => {
        if (!sex) return '';
        const normalizedCareer = career.toLowerCase()
            .replace(/[^a-z0-9]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return `/avatars/${normalizedCareer} ${sex.toLowerCase()}.png`;
    };

    const containerClasses = [
        styles.container,
        isSelected ? styles.selected : '',
        isDimmed ? styles.dimmed : '',
        isFullBody ? styles.fullBody : '',
        isFrameless ? styles.frameless : '',
        isRecommended ? styles.recommended : styles.nonRecommended // Add class for yellow tint
    ].join(' ');

    const badgeClass = {
        "Excellent Match": styles.strengthExcellent,
        "Strong Match": styles.strengthStrong,
        "Moderate Match": styles.strengthModerate,
        "Weak Match": styles.strengthWeak,
        // New Insight Agent Statuses
        "Recommended": styles.strengthExcellent,
        "Good Match": styles.strengthStrong,
        "Explore": styles.strengthModerate,
        "Not Ideal": styles.strengthWeak
    }[matchStrength || ""] || styles.strengthModerate;

    return (
        <div className={containerClasses} onClick={onClick}>
            <div className={isFrameless ? styles.framelessContainer : styles.card}>
                <div className={styles.imageWrapper}>
                    <div className={styles.imagePlaceholder}>
                        {!imgError ? (
                            <img
                                src={getAvatarFilename(career, sex)}
                                alt={`${career} Avatar`}
                                className={styles.avatarImage}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className={styles.avatarSilhoutte} />
                        )}
                    </div>
                </div>


                {!isFrameless && (
                    <div className={styles.content}>
                        {!hideTitle && <h3 className={styles.careerTitle}>{career}</h3>}

                        {/* VISUAL SIGNAL: ONLY SHOW TAG IF RECOMMENDED */}
                        {isRecommended ? (
                            <div className={`${styles.strengthBadge} ${styles.strengthExcellent}`}>
                                Recommended
                            </div>
                        ) : (
                            /* Subtitle/Short Insight only for non-recommended (since they have no tag) */
                            <div className={styles.spacer} style={{ height: '24px' }}></div>
                        )}

                        {/* SHORT INSIGHT / TAGLINE */}
                        {shortInsight ? (
                            <p className={styles.shortInsight}>{shortInsight}</p>
                        ) : (
                            subtitle && <p className={styles.careerSubtitle}>{subtitle}</p>
                        )}
                    </div>
                )}
            </div>

            {isFrameless && subtitle && (
                <div className={styles.framelessLabel}>
                    <p className={styles.careerSubtitle}>{subtitle}</p>
                </div>
            )}

            {/* Remove old RECOMMENDED tag if matchStrength is present, or keep as fallback */}
            {!isFrameless && isRecommended && !matchStrength && (
                <div className={styles.recommendedTagOuter}>
                    <div className={styles.recommendedTag}>Recommended</div>
                </div>
            )}
        </div>
    );
}
