'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import { assessmentQuestions } from '@/utils/careerScoring';
import styles from './page.module.css';

export default function Questions() {
    const router = useRouter();
    const { addAnswer, answers, setTestStatus } = usePathFinder();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Resume from last answered question
    useEffect(() => {
        if (answers && answers.length > 0) {
            setCurrentQuestion(answers.length);
        }
    }, []);

    useEffect(() => {
        if (currentQuestion >= assessmentQuestions.length) {
            setTestStatus('COMPLETED');
            router.push('/pathfinder/recommendation');
        }
    }, [currentQuestion, router, setTestStatus]);

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedOption(optionIndex);
        const currentQ = assessmentQuestions[currentQuestion];
        addAnswer(
            currentQ.id,
            optionIndex,
            currentQ.text,
            currentQ.options[optionIndex]
        );

        // Auto-advance after a brief delay
        setTimeout(() => {
            setSelectedOption(null);
            setCurrentQuestion(prev => prev + 1);
        }, 400);
    };

    if (currentQuestion >= assessmentQuestions.length) {
        return null;
    }

    const question = assessmentQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

    // Map option letters
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
                            onClick={() => handleOptionSelect(index)}
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
