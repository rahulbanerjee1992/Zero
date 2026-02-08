'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

export default function VerifyOTP() {
    const router = useRouter();
    const { hasCompletedPathFinder, resetPathFinder } = usePathFinder();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        if (!/^[a-zA-Z0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.toUpperCase();
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');

        if (code.length !== 6) return;

        // Mock verification - let's say '123456' is the "new user" code and anything else is success for existing (for testing)
        // Or just random for now. Let's implement the routing logic.

        if (code === '000000') {
            setError('This code has expired. Please request a new one.');
            return;
        }

        if (code.toLowerCase() === 'wrong') {
            setError('That code doesn’t look right. Please try again.');
            return;
        }

        // Success logic
        if (hasCompletedPathFinder) {
            router.push('/training-room');
        } else {
            resetPathFinder(); // Ensure fresh start
            router.push('/pathfinder/assessment');
        }
    };

    const handleResend = () => {
        if (!canResend) return;
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setError('');
        inputRefs.current[0]?.focus();
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.verifyCard}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Verify your email</h1>
                        <p className={styles.subtext}>
                            We’ve sent a 6-character verification code to your email address.
                        </p>
                    </div>

                    <form className={styles.form} onSubmit={handleVerify}>
                        <div className={styles.otpContainer}>
                            {otp.map((char, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    maxLength={1}
                                    value={char}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`${styles.otpInput} ${error ? styles.error : ''}`}
                                    placeholder="○"
                                />
                            ))}
                        </div>

                        {error && <p className={styles.errorMessage}>{error}</p>}

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={otp.join('').length < 6}
                        >
                            Verify code
                        </button>
                    </form>

                    <div className={styles.resendSection}>
                        <span className={styles.resendText}>Didn’t receive a code?</span>
                        <button
                            onClick={handleResend}
                            className={styles.resendBtn}
                            disabled={!canResend}
                        >
                            {canResend ? 'Resend code' : `Resend available in ${timer}s`}
                        </button>
                    </div>

                    <div className={styles.footer}>
                        <Link href="/" className={styles.link}>
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
