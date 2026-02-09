'use client';

import React from 'react';
import styles from './ArchetypeAvatar.module.css';

interface ArchetypeAvatarProps {
    career: string;
    subtitle?: string;
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
        isRecommended ? styles.recommended : ''
    ].join(' ');

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
                        <h3 className={styles.careerTitle}>{career}</h3>
                        {subtitle && <p className={styles.careerSubtitle}>{subtitle}</p>}
                    </div>
                )}
            </div>

            {isFrameless && subtitle && (
                <div className={styles.framelessLabel}>
                    <p className={styles.careerSubtitle}>{subtitle}</p>
                </div>
            )}

            {!isFrameless && isRecommended && (
                <div className={styles.recommendedTagOuter}>
                    <div className={styles.recommendedTag}>RECOMMENDED</div>
                </div>
            )}
        </div>
    );
}
