/**
 * Signal Interpreter (Agent 1)
 * 
 * Internal reasoning system that interprets how a user approaches work
 * based on their answers to realistic workplace questions.
 * 
 * ROLE:
 * - Supplies dynamic questions
 * - Collects signal (question-answer pairs)
 * - Determines when "sufficient signal" has been collected
 * 
 * This module does NOT recommend careers directly.
 */

export const SIGNAL_THRESHOLD = 7; // Minimum questions for stable signal

export interface Question {
    id: number;
    text: string;
    options: string[];
}

export const agent1Questions: Question[] = [
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

export interface QuestionAnswer {
    questionId: number;
    questionText: string;
    selectedOption: number;
    optionText: string;
}

export interface WorkStyleTendencies {
    insights: string[];
    dominantTraits: {
        ambiguityComfort: 'low' | 'medium' | 'high';
        actionBias: 'understanding-first' | 'balanced' | 'action-first';
        collaborationPreference: 'independent' | 'balanced' | 'collaborative';
        feedbackTolerance: 'reflective' | 'balanced' | 'immediate';
        riskTolerance: 'cautious' | 'balanced' | 'experimental';
        detailOrientation: 'big-picture' | 'balanced' | 'detail-focused';
        communicationInstinct: 'internal' | 'balanced' | 'external';
    };
}

/**
 * Analyzes question-answer pairs to infer work-style tendencies
 */
export function analyzeWorkStyle(answers: QuestionAnswer[]): WorkStyleTendencies {
    const traits = inferTraits(answers);
    const insights = generateInsights(answers, traits);

    return {
        insights,
        dominantTraits: traits
    };
}

/**
 * Determines if Agent 1 has collected enough signal to stop the assessment.
 */
export function hasSufficientSignal(answers: QuestionAnswer[]): boolean {
    if (answers.length < SIGNAL_THRESHOLD) return false;

    // Additional logic: Check if traits have stabilized
    // For now, we use a simple count threshold as per Agent 1 requirements.
    return true;
}

/**
 * Infer dominant work-style traits from answers
 */
function inferTraits(answers: QuestionAnswer[]): WorkStyleTendencies['dominantTraits'] {
    // Track patterns across all answers
    const patterns = {
        seeksClarification: 0,
        usesData: 0,
        buildsQuickly: 0,
        organizesFirst: 0,
        collaborates: 0,
        analyzesIndependently: 0,
        iteratesRapidly: 0,
        plansStructured: 0
    };

    answers.forEach(answer => {
        const option = answer.selectedOption;

        // Map options to behavioral patterns
        switch (option) {
            case 0: // Talk to people / Clarify / Collaborate
                patterns.seeksClarification++;
                patterns.collaborates++;
                break;
            case 1: // Look at data / Study / Analyze
                patterns.usesData++;
                patterns.analyzesIndependently++;
                break;
            case 2: // Build / Experiment / Iterate
                patterns.buildsQuickly++;
                patterns.iteratesRapidly++;
                break;
            case 3: // Organize / Plan / Structure
                patterns.organizesFirst++;
                patterns.plansStructured++;
                break;
        }
    });

    // Determine dominant traits
    const total = answers.length;

    return {
        ambiguityComfort:
            patterns.buildsQuickly > total * 0.4 ? 'high' :
                patterns.organizesFirst > total * 0.4 ? 'low' : 'medium',

        actionBias:
            patterns.buildsQuickly + patterns.iteratesRapidly > total * 0.6 ? 'action-first' :
                patterns.usesData + patterns.analyzesIndependently > total * 0.6 ? 'understanding-first' : 'balanced',

        collaborationPreference:
            patterns.collaborates + patterns.seeksClarification > total * 0.6 ? 'collaborative' :
                patterns.analyzesIndependently > total * 0.5 ? 'independent' : 'balanced',

        feedbackTolerance:
            patterns.iteratesRapidly > total * 0.4 ? 'immediate' :
                patterns.analyzesIndependently > total * 0.4 ? 'reflective' : 'balanced',

        riskTolerance:
            patterns.buildsQuickly > total * 0.4 ? 'experimental' :
                patterns.organizesFirst > total * 0.4 ? 'cautious' : 'balanced',

        detailOrientation:
            patterns.plansStructured > total * 0.4 ? 'detail-focused' :
                patterns.buildsQuickly > total * 0.4 ? 'big-picture' : 'balanced',

        communicationInstinct:
            patterns.collaborates + patterns.seeksClarification > total * 0.6 ? 'external' :
                patterns.analyzesIndependently > total * 0.5 ? 'internal' : 'balanced'
    };
}

/**
 * Generate 3-5 factual bullet points describing work approach
 */
function generateInsights(
    answers: QuestionAnswer[],
    traits: WorkStyleTendencies['dominantTraits']
): string[] {
    const insights: string[] = [];

    // Ambiguity comfort
    if (traits.ambiguityComfort === 'high') {
        insights.push('Comfortable navigating ambiguous situations through rapid experimentation');
    } else if (traits.ambiguityComfort === 'low') {
        insights.push('Prefers structured environments with clear frameworks and defined processes');
    }

    // Action vs understanding bias
    if (traits.actionBias === 'action-first') {
        insights.push('Tends to learn through doing rather than extended upfront analysis');
    } else if (traits.actionBias === 'understanding-first') {
        insights.push('Values thorough research and data analysis before taking action');
    }

    // Collaboration preference
    if (traits.collaborationPreference === 'collaborative') {
        insights.push('Naturally seeks input and clarification through dialogue with others');
    } else if (traits.collaborationPreference === 'independent') {
        insights.push('Comfortable working independently with deep focus and self-direction');
    }

    // Feedback tolerance
    if (traits.feedbackTolerance === 'immediate') {
        insights.push('Thrives on rapid feedback loops and iterative refinement');
    } else if (traits.feedbackTolerance === 'reflective') {
        insights.push('Processes feedback thoughtfully, comparing against internal judgment');
    }

    // Risk tolerance
    if (traits.riskTolerance === 'experimental') {
        insights.push('Willing to test assumptions quickly even with incomplete information');
    } else if (traits.riskTolerance === 'cautious') {
        insights.push('Mitigates risk through careful planning and systematic organization');
    }

    // Detail orientation
    if (traits.detailOrientation === 'detail-focused') {
        insights.push('Focuses on precision, structure, and systematic optimization');
    } else if (traits.detailOrientation === 'big-picture') {
        insights.push('Prioritizes momentum and overall direction over granular details');
    }

    // Communication instinct
    if (traits.communicationInstinct === 'external') {
        insights.push('Processes ideas through external communication and collaborative discussion');
    } else if (traits.communicationInstinct === 'internal') {
        insights.push('Develops understanding through independent analysis and reflection');
    }

    // Return 3-5 most relevant insights
    return insights.slice(0, 5);
}

/**
 * Map work-style tendencies to career alignment
 * Returns career recommendations based on work-style fit
 */
export function mapWorkStyleToCareers(
    workStyle: WorkStyleTendencies
): { career: string; alignmentReason: string }[] {
    const { dominantTraits } = workStyle;
    const alignments: { career: string; score: number; alignmentReason: string }[] = [];

    // Software Engineering
    alignments.push({
        career: 'Software Engineering',
        score: calculateScore(dominantTraits, {
            actionBias: 'action-first',
            ambiguityComfort: 'high',
            feedbackTolerance: 'immediate',
            detailOrientation: 'detail-focused'
        }),
        alignmentReason: 'Strong fit for iterative building with technical precision'
    });

    // Product Management
    alignments.push({
        career: 'Product Management',
        score: calculateScore(dominantTraits, {
            collaborationPreference: 'collaborative',
            communicationInstinct: 'external',
            ambiguityComfort: 'high',
            detailOrientation: 'big-picture'
        }),
        alignmentReason: 'Aligns with collaborative decision-making and strategic thinking'
    });

    // Data Science
    alignments.push({
        career: 'Data Science',
        score: calculateScore(dominantTraits, {
            actionBias: 'understanding-first',
            collaborationPreference: 'independent',
            detailOrientation: 'detail-focused',
            communicationInstinct: 'internal'
        }),
        alignmentReason: 'Matches analytical depth and independent problem-solving approach'
    });

    // UX Design
    alignments.push({
        career: 'UX Design',
        score: calculateScore(dominantTraits, {
            collaborationPreference: 'collaborative',
            feedbackTolerance: 'immediate',
            ambiguityComfort: 'high',
            actionBias: 'action-first'
        }),
        alignmentReason: 'Fits iterative design process with user feedback integration'
    });

    // Operations
    alignments.push({
        career: 'Operations',
        score: calculateScore(dominantTraits, {
            detailOrientation: 'detail-focused',
            riskTolerance: 'cautious',
            ambiguityComfort: 'low',
            actionBias: 'understanding-first'
        }),
        alignmentReason: 'Suits systematic optimization and process-driven work'
    });

    // Marketing
    alignments.push({
        career: 'Marketing',
        score: calculateScore(dominantTraits, {
            collaborationPreference: 'collaborative',
            communicationInstinct: 'external',
            actionBias: 'action-first',
            ambiguityComfort: 'high'
        }),
        alignmentReason: 'Aligns with creative experimentation and audience engagement'
    });

    // Sales
    alignments.push({
        career: 'Sales',
        score: calculateScore(dominantTraits, {
            communicationInstinct: 'external',
            collaborationPreference: 'collaborative',
            feedbackTolerance: 'immediate',
            riskTolerance: 'experimental'
        }),
        alignmentReason: 'Matches relationship-building and adaptive communication style'
    });

    // Finance
    alignments.push({
        career: 'Finance',
        score: calculateScore(dominantTraits, {
            detailOrientation: 'detail-focused',
            actionBias: 'understanding-first',
            riskTolerance: 'cautious',
            collaborationPreference: 'independent'
        }),
        alignmentReason: 'Fits analytical rigor and risk-aware decision making'
    });

    // Customer Success
    alignments.push({
        career: 'Customer Success',
        score: calculateScore(dominantTraits, {
            collaborationPreference: 'collaborative',
            communicationInstinct: 'external',
            feedbackTolerance: 'immediate',
            ambiguityComfort: 'medium'
        }),
        alignmentReason: 'Suits empathetic problem-solving and relationship management'
    });

    // Sort by alignment score
    return alignments
        .sort((a, b) => b.score - a.score)
        .map(({ career, alignmentReason }) => ({ career, alignmentReason }));
}

/**
 * Calculate alignment score between user traits and ideal career traits
 */
function calculateScore(
    userTraits: WorkStyleTendencies['dominantTraits'],
    idealTraits: Partial<WorkStyleTendencies['dominantTraits']>
): number {
    let score = 0;
    let totalChecks = 0;

    for (const [key, idealValue] of Object.entries(idealTraits)) {
        totalChecks++;
        const userValue = userTraits[key as keyof typeof userTraits];

        if (userValue === idealValue) {
            score += 2; // Perfect match
        } else if (userValue === 'balanced') {
            score += 1; // Neutral/adaptable
        }
    }

    return totalChecks > 0 ? score / totalChecks : 0;
}
