'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

export default function TrainingRoom() {
    const router = useRouter();
    const { testStatus } = usePathFinder();

    // Access control
    useEffect(() => {
        if (testStatus !== 'COMPLETED') {
            router.push('/pathfinder/intro');
        }
    }, [testStatus, router]);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.logo}>Zero</h1>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>Z</div>
                        <span>Welcome back</span>
                    </div>
                </header>

                <div className={styles.dashboard}>
                    <section className={styles.welcomeSection}>
                        <h2>Training Room</h2>
                        <p>Welcome to your professional HQ. Ready for your next simulation?</p>
                    </section>

                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>Active Simulations</h3>
                            <p className={styles.statNumber}>2</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Skills Certified</h3>
                            <p className={styles.statNumber}>14</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Streak</h3>
                            <p className={styles.statNumber}>5 days</p>
                        </div>
                    </div>

                    <section className={styles.assignments}>
                        <h3>Recent Assignments</h3>
                        <div className={styles.assignmentList}>
                            <div className={styles.assignmentItem}>
                                <div className={styles.assignmentInfo}>
                                    <h4>System Architecture Review</h4>
                                    <p>Software Engineering • Module 4</p>
                                </div>
                                <button className={styles.continueBtn}>Resume</button>
                            </div>
                            <div className={styles.assignmentItem}>
                                <div className={styles.assignmentInfo}>
                                    <h4>User Interview Synthesis</h4>
                                    <p>Product Management • Module 2</p>
                                </div>
                                <button className={styles.continueBtn}>Resume</button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
