'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

type AssessmentState = 'intro' | 'questions' | 'transition';

export default function AssessmentPage() {
    const router = useRouter();
    const {
        agent1Questions,
        addAnswer,
        answers,
        isSignalSufficient,
        resetPathFinder
    } = usePathFinder();

    const [state, setState] = useState<AssessmentState>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Ensure state is fresh if they hit this page
    useEffect(() => {
        if (answers.length === 0) {
            resetPathFinder();
        }
    }, []);

    const handleBegin = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setState('questions');
            setIsTransitioning(false);
        }, 500);
    };

    const handleOptionSelect = (optionIndex: number) => {
        if (selectedOption !== null) return;

        setSelectedOption(optionIndex);
        const question = agent1Questions[currentQuestionIndex];

        // Send signal to Agent 1
        addAnswer(
            question.id,
            optionIndex,
            question.text,
            question.options[optionIndex]
        );

        // Check for sufficient signal or next question
        setTimeout(() => {
            const isLastQuestion = currentQuestionIndex === agent1Questions.length - 1;

            // We transition if signal is sufficient OR we've reached the end of questions
            if (isSignalSufficient() || isLastQuestion) {
                // Signal is complete, handoff to Recommendation
                setIsTransitioning(true);
                setTimeout(() => {
                    router.push('/pathfinder/recommendation');
                }, 600);
            } else {
                // Not enough signal yet, next question
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setSelectedOption(null);
                    setIsTransitioning(false);
                }, 400);
            }
        }, 500);
    };

    const renderIntro = () => (
        <div className={`${styles.introBlock} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
            <h1 className={styles.title}>Let’s understand how you think.</h1>
            <div className={styles.bodyText}>
                <p>There are no right or wrong answers here.</p>
                <p>
                    This isn’t a test, and nothing you say has consequences.
                    We’re simply here to understand how you approach problems and decisions,
                    so we can guide you toward a path that fits you better.
                </p>
                <p className={styles.lighterLine}>Answer honestly. Don’t overthink it.</p>
            </div>
            <button className="btn-primary" onClick={handleBegin}>
                Let’s begin
            </button>
        </div>
    );

    const renderQuestions = () => {
        const question = agent1Questions[currentQuestionIndex];
        if (!question) return null;

        return (
            <div className={`${styles.questionContainer} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                <div className={styles.progressLabel}>
                    Signal Point {currentQuestionIndex + 1}
                </div>

                <h2 className={styles.questionText}>{question.text}</h2>

                <div className={styles.optionsGrid}>
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className={`${styles.optionCard} ${selectedOption === index ? styles.selected : ''}`}
                            onClick={() => handleOptionSelect(index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {state === 'intro' ? renderIntro() : renderQuestions()}
            </div>
        </main>
    );
}
