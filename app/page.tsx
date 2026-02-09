'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

export default function Home() {
    const router = useRouter();
    const { signIn } = usePathFinder();
    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showAccountNotFoundModal, setShowAccountNotFoundModal] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn(emailInput, password);

        if (result.success) {
            // Check test state in context (will be updated after signIn success)
            // But context update might be async, so we might need another way or rely on useEffect in context
            // Actually, context signIn updates state immediately.
            // Let's rely on a manual check of localStorage or just trust it.
            const sessionUser = localStorage.getItem('zero_session_user');
            if (sessionUser) {
                const user = JSON.parse(sessionUser);
                if (user.testStatus === 'COMPLETED') {
                    router.push('/pathfinder/recommendation');
                } else {
                    router.push('/pathfinder/intro');
                }
            }
        } else {
            if (result.error === 'USER_NOT_FOUND') {
                setShowAccountNotFoundModal(true);
            } else if (result.error === 'INVALID_CREDENTIALS') {
                setError('Incorrect email or password. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <main className={styles.main}>
            {showAccountNotFoundModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <p className={styles.modalText}>
                            This account does not exist. Please check your email or sign up.
                        </p>
                        <button
                            className={styles.modalOkBtn}
                            onClick={() => setShowAccountNotFoundModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.splitLayout}>
                <section className={styles.leftSection}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.brand}>
                            <h2 className={styles.logo}>Zero</h2>
                        </div>
                        <div className={styles.messaging}>
                            <h1 className={styles.headline}>Ready to discover yourself?</h1>
                            <p className={styles.description}>
                                Begin your real-world career journey through hands-on, simulated job experiences.
                            </p>
                            <button
                                className={styles.primaryCta}
                                onClick={() => router.push('/signup')}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </section>

                <section className={styles.rightSection}>
                    <div className={styles.authCard}>
                        <div className={styles.authHeader}>
                            <h2 className={styles.authTitle}>Sign in to Zero</h2>
                            <p className={styles.authSubtext}>Continue your journey where you left off.</p>
                        </div>
                        <form className={styles.form} onSubmit={handleSignIn}>
                            {error && <div className={styles.errorMessage}>{error}</div>}

                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <button className={styles.signInBtn} type="submit">Sign In</button>
                        </form>
                        <div className={styles.authFooter}>
                            <span>Don’t have an account?</span>
                            <button
                                className={styles.signUpLink}
                                onClick={() => router.push('/signup')}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
