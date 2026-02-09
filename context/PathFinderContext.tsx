'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { analyzeWorkStyle, mapWorkStyleToCareers, QuestionAnswer, WorkStyleTendencies, Question, agent1Questions, hasSufficientSignal } from '@/utils/workStyleReasoning';
import { generateCareerExplanation, CareerExplanation } from '@/utils/careerExplanation';

export type TestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

interface User {
    email: string;
    password?: string;
    sex: string;
    testStatus: TestStatus;
    answers: QuestionAnswer[];
    selectedCareer: string | null;
}

interface PathFinderContextType {
    currentUser: User | null;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, password: string, sex: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => void;
    testStatus: TestStatus;
    setTestStatus: (status: TestStatus) => void;
    answers: QuestionAnswer[];
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
    'Data Science',
    'Business Analyst',
    'Marketing',
    'Sales',
    'Security Engineering / Cyber Security',
    'AI / Machine Learning',
    'UX / UI Design',
    'Product / Project Management'
];

const STORAGE_KEY_USERS = 'zero_users_storage';
const STORAGE_KEY_SESSION = 'zero_session_user';

export function PathFinderProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
    const [workStyleAnalysis, setWorkStyleAnalysis] = useState<WorkStyleTendencies | null>(null);
    const [testStatus, setTestStatus] = useState<TestStatus>('NOT_STARTED');

    // Load session on mount
    useEffect(() => {
        const sessionUser = localStorage.getItem(STORAGE_KEY_SESSION);
        if (sessionUser) {
            const user: User = JSON.parse(sessionUser);
            setCurrentUser(user);
            setAnswers(user.answers || []);
            setSelectedCareer(user.selectedCareer || null);
            setTestStatus(user.testStatus || 'NOT_STARTED');
            if (user.answers && user.answers.length >= 3) {
                setWorkStyleAnalysis(analyzeWorkStyle(user.answers));
            }
        }
    }, []);

    // Persist current state to account storage whenever relevant state changes
    useEffect(() => {
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                answers,
                selectedCareer,
                testStatus
            };

            // Update session
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedUser));

            // Update permanent storage
            const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
            if (usersStr) {
                const users: User[] = JSON.parse(usersStr);
                const userIndex = users.findIndex(u => u.email === currentUser.email);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...updatedUser };
                    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
                }
            }
        }
    }, [answers, selectedCareer, testStatus, currentUser]);

    const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
        if (!usersStr) {
            return { success: false, error: 'USER_NOT_FOUND' };
        }

        const users: User[] = JSON.parse(usersStr);
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, error: 'USER_NOT_FOUND' };
        }

        if (user.password !== password) {
            return { success: false, error: 'INVALID_CREDENTIALS' };
        }

        // Success
        setCurrentUser(user);
        setAnswers(user.answers || []);
        setSelectedCareer(user.selectedCareer || null);
        setTestStatus(user.testStatus || 'NOT_STARTED');
        if (user.answers && user.answers.length >= 3) {
            setWorkStyleAnalysis(analyzeWorkStyle(user.answers));
        }
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
        return { success: true };
    };

    const signUp = async (email: string, password: string, sex: string): Promise<{ success: boolean; error?: string }> => {
        const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        if (users.some(u => u.email === email)) {
            return { success: false, error: 'USER_EXISTS' };
        }

        const newUser: User = {
            email,
            password,
            sex,
            testStatus: 'NOT_STARTED',
            answers: [],
            selectedCareer: null
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));

        // Auto sign in
        setCurrentUser(newUser);
        setAnswers([]);
        setSelectedCareer(null);
        setTestStatus('NOT_STARTED');
        setWorkStyleAnalysis(null);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newUser));

        return { success: true };
    };

    const signOut = () => {
        setCurrentUser(null);
        setAnswers([]);
        setSelectedCareer(null);
        setTestStatus('NOT_STARTED');
        setWorkStyleAnalysis(null);
        localStorage.removeItem(STORAGE_KEY_SESSION);
    };

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

        // Update status if it's the first answer
        if (testStatus === 'NOT_STARTED') {
            setTestStatus('IN_PROGRESS');
        }

        // Analyze work style after each answer
        if (updatedAnswers.length >= 3) {
            const analysis = analyzeWorkStyle(updatedAnswers);
            setWorkStyleAnalysis(analysis);
        }
    };

    const getRecommendedCareer = (): string => {
        if (!workStyleAnalysis || answers.length < 5) {
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

    const resetPathFinder = () => {
        setAnswers([]);
        setSelectedCareer(null);
        setWorkStyleAnalysis(null);
        setTestStatus('NOT_STARTED');
    };

    return (
        <PathFinderContext.Provider
            value={{
                currentUser,
                signIn,
                signUp,
                signOut,
                testStatus,
                setTestStatus,
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
