'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathFinder } from '@/context/PathFinderContext';
import styles from './page.module.css';

const questions = [
    {
        id: 1,
        text: "You're given a vague problem with a tight deadline. What do you do first?",
        options: [
            "Clarify the problem by talking to people",
            "Look at data or past examples",
            "Build something quickly to test ideas",
            "Organize tasks and define a plan"
        ]
    },
    {
        id: 2,
        text: "When receiving feedback, you usually prefer to:",
        options: [
            "Ask questions to understand it deeply",
            "Apply it immediately and iterate",
            "Compare it against your own judgment",
            "Discuss it with others first"
        ]
    },
    {
        id: 3,
        text: "In a team meeting, you're most likely to:",
        options: [
            "Facilitate discussion and gather input",
            "Present data and insights",
            "Propose solutions and prototypes",
            "Create structure and next steps"
        ]
    },
    {
        id: 4,
        text: "When learning something new, you prefer to:",
        options: [
            "Learn from others through conversation",
            "Study documentation and research",
            "Experiment hands-on immediately",
            "Follow a structured curriculum"
        ]
    },
    {
        id: 5,
        text: "Your ideal work environment involves:",
        options: [
            "Frequent collaboration and communication",
            "Deep analysis and pattern recognition",
            "Creating and building things",
            "Systems thinking and optimization"
        ]
    },
    {
        id: 6,
        text: "When facing uncertainty, you tend to:",
        options: [
            "Seek diverse perspectives",
            "Gather more information",
            "Test assumptions quickly",
            "Create frameworks to reduce ambiguity"
        ]
    },
    {
        id: 7,
        text: "You feel most accomplished when you:",
        options: [
            "Help others succeed",
            "Discover meaningful insights",
            "Ship something that works",
            "Improve a complex system"
        ]
    }
];

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
        if (currentQuestion >= questions.length) {
            setTestStatus('COMPLETED');
            router.push('/pathfinder/recommendation');
        }
    }, [currentQuestion, router, setTestStatus]);

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedOption(optionIndex);
        const currentQ = questions[currentQuestion];
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

    if (currentQuestion >= questions.length) {
        return null;
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <main className={styles.main}>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <div className={styles.container}>
                <div className={styles.questionNumber}>
                    Question {currentQuestion + 1} of {questions.length}
                </div>

                <h1 className={styles.questionText}>{question.text}</h1>

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
        </main>
    );
}
