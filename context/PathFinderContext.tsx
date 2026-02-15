'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
    calculateAssessment,
    CareerName,
    AssessmentResult,
    assessmentQuestions,
    Question
} from '@/utils/careerScoring';
import {
    CareerExplanationResult,
    generateCareerExplanation
} from '@/utils/careerExplanation';

export type TestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

interface QuestionAnswer {
    questionId: number;
    selectedOption: number;
    questionText: string;
    optionText: string;
}

interface User {
    email: string;
    password?: string;
    sex: string;
    testStatus: TestStatus;
    answers: QuestionAnswer[];
    selectedCareer: string | null;
    assessmentResult: AssessmentResult | null;
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
    getCareerExplanation: (career: string) => CareerExplanationResult | null;
    resetPathFinder: () => void;
    assessmentResult: AssessmentResult | null;
    agent1Questions: Question[];
    isSignalSufficient: () => boolean;
    hasCompletedPathFinder: boolean;
}

const PathFinderContext = createContext<PathFinderContextType | undefined>(undefined);

// STRICT CAREER LIST from Agent Spec
const careers: CareerName[] = [
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
    const [testStatus, setTestStatus] = useState<TestStatus>('NOT_STARTED');
    const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

    // Load session on mount
    useEffect(() => {
        const sessionUser = localStorage.getItem(STORAGE_KEY_SESSION);
        if (sessionUser) {
            const user: User = JSON.parse(sessionUser);
            setCurrentUser(user);
            setAnswers(user.answers || []);
            setSelectedCareer(user.selectedCareer || null);
            setTestStatus(user.testStatus || 'NOT_STARTED');
            if (user.assessmentResult) {
                setAssessmentResult(user.assessmentResult);
            }
        }
    }, []);

    // Safety check: Calculate assessment if answers are complete but status is stuck
    useEffect(() => {
        if (answers.length === 13 && (testStatus === 'IN_PROGRESS' || testStatus === 'NOT_STARTED') && currentUser) {
            handleAssessmentCompletion(answers);
        }
    }, [answers, testStatus, currentUser]);

    const handleAssessmentCompletion = (currentAnswers: QuestionAnswer[]) => {
        console.log("[DEBUG] Entered handleAssessmentCompletion", {
            answersCount: currentAnswers.length,
            hasUser: !!currentUser
        });

        if (currentAnswers.length < 13 || !currentUser) {
            console.log("[DEBUG] Early exit: condition not met.");
            return;
        }

        const answerIndices = currentAnswers.map(a => a.selectedOption);
        console.log("[DEBUG] Answer Indices:", answerIndices);

        try {
            const result = calculateAssessment(answerIndices);
            console.log("[DEBUG] Result generated:", result.recommended_career);
            setAssessmentResult(result);
            setTestStatus('COMPLETED');

            const updatedUser: User = {
                ...currentUser,
                answers: currentAnswers,
                testStatus: 'COMPLETED',
                assessmentResult: result
            };

            setCurrentUser(updatedUser);
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedUser));
            console.log("[DEBUG] State and LocalStorage updated.");
        } catch (err) {
            console.error("[DEBUG] Error in completion logic:", err);
        }
    };

    // Persist current state
    useEffect(() => {
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                answers,
                selectedCareer,
                testStatus,
                assessmentResult: assessmentResult
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
    }, [answers, selectedCareer, testStatus, currentUser, assessmentResult]);

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
        if (user.assessmentResult) {
            setAssessmentResult(user.assessmentResult);
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
            selectedCareer: null,
            assessmentResult: null
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));

        // Auto sign in
        setCurrentUser(newUser);
        setAnswers([]);
        setSelectedCareer(null);
        setTestStatus('NOT_STARTED');
        setAssessmentResult(null);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newUser));

        return { success: true };
    };

    const signOut = () => {
        setCurrentUser(null);
        setAnswers([]);
        setSelectedCareer(null);
        setTestStatus('NOT_STARTED');
        setAssessmentResult(null);
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

        // Trigger completion if this was the last question
        if (updatedAnswers.length === 13) {
            handleAssessmentCompletion(updatedAnswers);
        }
    };

    const getRecommendedCareer = (): string => {
        if (assessmentResult) {
            return assessmentResult.recommended_career;
        }
        return 'Software Engineering';
    };

    const getCareerExplanation = (career: string): CareerExplanationResult | null => {
        if (!assessmentResult) {
            return null;
        }

        return generateCareerExplanation(career as CareerName, assessmentResult);
    };

    const resetPathFinder = () => {
        setAnswers([]);
        setSelectedCareer(null);
        setTestStatus('NOT_STARTED');
        setAssessmentResult(null);
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                answers: [],
                selectedCareer: null,
                testStatus: 'NOT_STARTED' as TestStatus,
                assessmentResult: null
            };
            setCurrentUser(updatedUser);
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedUser));
        }
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
                getCareerExplanation,
                resetPathFinder,
                assessmentResult,
                agent1Questions: assessmentQuestions,
                isSignalSufficient: () => answers.length >= 13,
                hasCompletedPathFinder: testStatus === 'COMPLETED'
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
