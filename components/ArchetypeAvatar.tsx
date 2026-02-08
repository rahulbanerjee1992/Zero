'use client';

import React from 'react';
import styles from './ArchetypeAvatar.module.css';

interface ArchetypeAvatarProps {
    career: string;
    isRecommended?: boolean;
    isSelected?: boolean;
    isDimmed?: boolean;
    onClick?: () => void;
}

const getCareerIcon = (career: string) => {
    switch (career) {
        case 'Software Engineering': return '⟨/⟩';
        case 'Product Management': return '⬚';
        case 'Data Science': return '⌬';
        case 'UX Design': return '◎';
        case 'Marketing': return '✦';
        case 'Sales': return '↗';
        case 'Operations': return '⚙︎';
        case 'Finance': return '$';
        case 'Customer Success': return '♥';
        default: return '?';
    }
};

const getCareerGradient = (career: string) => {
    const gradients: Record<string, string> = {
        'Software Engineering': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        'Product Management': 'linear-gradient(135deg, #8b5cf6, #5b21b6)',
        'Data Science': 'linear-gradient(135deg, #06b6d4, #0891b2)',
        'UX Design': 'linear-gradient(135deg, #ec4899, #be185d)',
        'Marketing': 'linear-gradient(135deg, #f59e0b, #d97706)',
        'Sales': 'linear-gradient(135deg, #10b981, #047857)',
        'Operations': 'linear-gradient(135deg, #64748b, #334155)',
        'Finance': 'linear-gradient(135deg, #facc15, #ca8a04)',
        'Customer Success': 'linear-gradient(135deg, #f43f5e, #e11d48)'
    };
    return gradients[career] || 'linear-gradient(135deg, #94a3b8, #475569)';
};

export default function ArchetypeAvatar({
    career,
    isRecommended = false,
    isSelected = false,
    isDimmed = false,
    onClick
}: ArchetypeAvatarProps) {
    const containerClasses = [
        styles.container,
        isSelected ? styles.selected : '',
        isDimmed ? styles.dimmed : ''
    ].join(' ');

    return (
        <div className={containerClasses} onClick={onClick}>
            <div
                className={styles.avatarCircle}
                style={{ background: getCareerGradient(career) }}
            >
                <div className={styles.reflection} />
                <span className={styles.icon}>{getCareerIcon(career)}</span>
            </div>
            <div className={styles.labelContainer}>
                {isRecommended && isSelected && (
                    <div className={styles.recommendedBadge}>
                        Recommended
                    </div>
                )}
                {isSelected && !isRecommended && (
                    <div className={styles.warningBadge}>
                        Not recommended
                    </div>
                )}
            </div>
        </div>
    );
}
