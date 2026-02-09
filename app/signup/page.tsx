'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

export default function Signup() {
    const router = useRouter();
    const { signUp } = usePathFinder();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedSex, setSelectedSex] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signUp(email, password, selectedSex);

        if (result.success) {
            router.push('/pathfinder/intro');
        } else {
            if (result.error === 'USER_EXISTS') {
                setError('An account with this email already exists.');
            } else {
                setError('Signup failed. Please try again.');
            }
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.signupCard}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Create your account</h1>
                        <p className={styles.subtext}>
                            Your journey starts here. This is free and takes less than a minute.
                        </p>
                    </div>

                    <form className={styles.form} onSubmit={handleSignup}>
                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Sex</label>
                            <div className={styles.sexToggleGroup}>
                                {['Male', 'Female'].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        className={`${styles.sexOption} ${selectedSex === option ? styles.active : ''}`}
                                        onClick={() => setSelectedSex(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={!selectedSex}>
                            Create account
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <span>Already have an account?</span>
                        <Link href="/" className={styles.link}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
