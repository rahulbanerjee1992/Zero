'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PathFinderIntro() {
    const router = useRouter();

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.heading}>Let's figure this out together.</h1>

                    <div className={styles.body}>
                        <p>PathFinder works like a career counselor.</p>
                        <p>
                            You'll answer a series of short questions designed to understand
                            how you think, work, and make decisions.
                        </p>
                        <p>There are no right or wrong answers.</p>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => router.push('/pathfinder/questions')}
                    >
                        Begin
                    </button>
                </div>
            </div>
        </main>
    );
}
