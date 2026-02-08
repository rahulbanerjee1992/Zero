'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

export default function Home() {
    const router = useRouter();
    const { setEmail } = usePathFinder();
    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');

    return (
        <main className={styles.main}>
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
                        <form className={styles.form} onSubmit={(e) => {
                            e.preventDefault();
                            setEmail(emailInput);
                            router.push('/verify-otp');
                        }}>
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
