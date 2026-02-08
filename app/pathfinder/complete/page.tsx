'use client';

import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

export default function Complete() {
    const router = useRouter();
    const { selectedCareer } = usePathFinder();

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.heading}>PathFinder complete</h1>

                    <div className={styles.body}>
                        <p>You've chosen your focus.</p>
                        <p>
                            Next, you'll begin training through real work simulations.
                        </p>
                    </div>

                    {selectedCareer && (
                        <div className={styles.selectedCareer}>
                            <p className={styles.careerLabel}>Your career path:</p>
                            <p className={styles.careerName}>{selectedCareer}</p>
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        onClick={() => alert('This would navigate to the training platform')}
                    >
                        Start your first day
                    </button>
                </div>
            </div>
        </main>
    );
}
