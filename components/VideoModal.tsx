'use client';

import { useEffect } from 'react';
import styles from './VideoModal.module.css';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close video">
                    ✕
                </button>
                <div className={styles.videoContainer}>
                    <div className={styles.placeholder}>
                        <div className={styles.playIcon}>▶</div>
                        <p className={styles.placeholderText}>Platform Overview Video</p>
                        <p className={styles.placeholderSubtext}>This is a placeholder for the Zero platform trailer</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
