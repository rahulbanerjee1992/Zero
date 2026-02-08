'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { analyzeWorkStyle, mapWorkStyleToCareers, QuestionAnswer, WorkStyleTendencies, Question, agent1Questions, hasSufficientSignal } from '@/utils/workStyleReasoning';
import { generateCareerExplanation, CareerExplanation } from '@/utils/careerExplanation';

interface Answer {
    questionId: number;
    selectedOption: number;
}

interface PathFinderContextType {
    email: string;
    setEmail: (email: string) => void;
    sex: string;
    setSex: (sex: string) => void;
    hasCompletedPathFinder: boolean;
    setHasCompletedPathFinder: (status: boolean) => void;
    answers: Answer[];
    addAnswer: (questionId: number, selectedOption: number, questionText: string, optionText: string) => void;
    selectedCareer: string | null;
    setSelectedCareer: (career: string) => void;
    getRecommendedCareer: () => string;
    getWorkStyleInsights: () => string[];
    getCareerExplanation: (career: string) => CareerExplanation | null;
    workStyleAnalysis: WorkStyleTendencies | null;
    resetPathFinder: () => void;
    agent1Questions: Question[];
    isSignalSufficient: () => boolean;
}

const PathFinderContext = createContext<PathFinderContextType | undefined>(undefined);

const careers = [
    'Software Engineering',
    'Product Management',
    'Data Science',
    'UX Design',
    'Marketing',
    'Sales',
    'Operations',
    'Finance',
    'Customer Success'
];

export function PathFinderProvider({ children }: { children: ReactNode }) {
    const [email, setEmail] = useState('');
    const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
    const [workStyleAnalysis, setWorkStyleAnalysis] = useState<WorkStyleTendencies | null>(null);

    const addAnswer = (
        questionId: number,
        selectedOption: number,
        questionText: string,
        optionText: string
    ) => {
        const newAnswer: QuestionAnswer = {
            questionId,
            selectedOption,
            questionText,
            optionText
        };

        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);

        // Analyze work style after each answer
        if (updatedAnswers.length >= 3) {
            const analysis = analyzeWorkStyle(updatedAnswers);
            setWorkStyleAnalysis(analysis);
        }
    };

    const getRecommendedCareer = (): string => {
        if (!workStyleAnalysis || answers.length < 5) {
            // Fallback to simple logic if not enough data
            const optionCounts = [0, 0, 0, 0];
            answers.forEach(answer => {
                if (answer.selectedOption < 4) {
                    optionCounts[answer.selectedOption]++;
                }
            });
            const maxIndex = optionCounts.indexOf(Math.max(...optionCounts));
            const careerMap = ['Product Management', 'Data Science', 'Software Engineering', 'Operations'];
            return careerMap[maxIndex] || 'Software Engineering';
        }

        // Use sophisticated work-style analysis
        const careerAlignments = mapWorkStyleToCareers(workStyleAnalysis);
        return careerAlignments[0]?.career || 'Software Engineering';
    };

    const getWorkStyleInsights = (): string[] => {
        if (!workStyleAnalysis) {
            return [
                'Complete more questions to generate personalized insights',
                'Your work-style profile is being analyzed',
                'Answer patterns will reveal your natural approach to work'
            ];
        }
        return workStyleAnalysis.insights;
    };


    const getCareerExplanation = (career: string): CareerExplanation | null => {
        if (!workStyleAnalysis) {
            return null;
        }
        const recommended = getRecommendedCareer();
        return generateCareerExplanation(career, recommended, workStyleAnalysis);
    };

    const [sex, setSex] = useState('');
    const [hasCompletedPathFinder, setHasCompletedPathFinder] = useState(false);

    const resetPathFinder = () => {
        setAnswers([]);
        setSelectedCareer(null);
        setWorkStyleAnalysis(null);
    };

    return (
        <PathFinderContext.Provider
            value={{
                email,
                setEmail,
                sex,
                setSex,
                hasCompletedPathFinder,
                setHasCompletedPathFinder,
                answers,
                addAnswer,
                selectedCareer,
                setSelectedCareer,
                getRecommendedCareer,
                getWorkStyleInsights,
                getCareerExplanation,
                workStyleAnalysis,
                resetPathFinder,
                agent1Questions,
                isSignalSufficient: () => hasSufficientSignal(answers)
            }}
        >
            {children}
        </PathFinderContext.Provider>
    );
}

export function usePathFinder() {
    const context = useContext(PathFinderContext);
    if (context === undefined) {
        throw new Error('usePathFinder must be used within a PathFinderProvider');
    }
    return context;
}

export { careers };
