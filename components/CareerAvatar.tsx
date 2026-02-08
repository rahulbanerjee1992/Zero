'use client';

import styles from './CareerAvatar.module.css';

interface CareerAvatarProps {
    career: string;
    isRecommended?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
}

export default function CareerAvatar({
    career,
    isRecommended = false,
    isSelected = false,
    onClick
}: CareerAvatarProps) {
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

    return (
        <div className={styles.container} onClick={onClick}>
            {isRecommended && (
                <div className={styles.recommendedBadge}>Recommended for you</div>
            )}
            <div
                className={`${styles.avatar} ${isSelected ? styles.selected : ''}`}
                style={{ backgroundColor: getColor(career) }}
            >
                <span className={styles.initials}>{getInitials(career)}</span>
            </div>
            <p className={styles.careerName}>{career}</p>
        </div>
    );
}
