'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import { assessmentQuestions } from '@/utils/careerScoring';
import styles from './page.module.css';

export default function Questions() {
    const router = useRouter();
    const {
        addAnswer,
        answers,
        testStatus
    } = usePathFinder();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Resume from last answered question
    useEffect(() => {
        if (answers && answers.length > 0) {
            setCurrentQuestion(answers.length);
        }

        // Hard redirect if we are beyond questions and completed
        if (answers.length >= 13 && testStatus === 'COMPLETED') {
            router.push('/pathfinder/recommendation');
        }
    }, [answers, testStatus, router]);

    // Handle Redirect after completion
    useEffect(() => {
        if (testStatus === 'COMPLETED') {
            router.push('/pathfinder/recommendation');
        }
    }, [testStatus, router]);

    const handleAnswerSelect = (optionIndex: number) => {
        const question = assessmentQuestions[currentQuestion];
        addAnswer(question.id, optionIndex, question.text, question.options[optionIndex]);

        if (currentQuestion < assessmentQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    if (currentQuestion >= assessmentQuestions.length) {
        return null; // Transitioning directly via useEffect
    }

    const question = assessmentQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
    const optionLetters = ['A', 'B', 'C', 'D'];

    return (
        <main className={styles.main}>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <div className={styles.container}>
                <div className={styles.questionNumber}>
                    Question {currentQuestion + 1} of {assessmentQuestions.length}
                </div>

                <h1 className={styles.questionText}>{question.text}</h1>

                <div className={styles.optionsGrid}>
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className={`${styles.optionCard} ${selectedOption === index ? styles.selected : ''}`}
                            onClick={() => handleAnswerSelect(index)}
                        >
                            <span className={styles.optionLetter}>{optionLetters[index]}</span>
                            <span className={styles.optionText}>{option}</span>
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}
