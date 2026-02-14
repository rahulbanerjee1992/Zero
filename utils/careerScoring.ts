/**
 * CareerAssessmentAgent
 * 
 * RESPONSIBILITIES:
 * - Run personality-based career assessment
 * - Measure Cognitive tendencies, Work style, Grit, Reality-alignment
 * - Output strict JSON format with normalized scores (0-100)
 */

export type CareerName =
    | "Software Engineering"
    | "Data Science"
    | "Business Analyst"
    | "Marketing"
    | "Sales"
    | "Security Engineering / Cyber Security"
    | "AI / Machine Learning"
    | "UX / UI Design"
    | "Product / Project Management";

export interface Question {
    id: number;
    text: string;
    options: string[];
    phase: "Cognitive" | "Reality" | "Grit";
}

export const assessmentQuestions: Question[] = [
    // PHASE 1: COGNITIVE FIT (Q1-6)
    {
        id: 1,
        phase: "Cognitive",
        text: "You're assembling furniture using unclear instructions. You:",
        options: [
            "Carefully break it into steps and follow diagrams precisely",
            "Look up videos or examples online to see the finished product",
            "Try to figure it out intuitively by fitting pieces together",
            "Get frustrated and consider giving up or asking for help"
        ]
    },
    {
        id: 2,
        phase: "Cognitive",
        text: "When you see a large spreadsheet of data, your first reaction is:",
        options: [
            "Curiosity - I want to find patterns and insights",
            "Overwhelm - I prefer words or visuals over numbers",
            "Utility - I see it as a tool to organize information",
            "Indifference - I don't care unless it affects me"
        ]
    },
    {
        id: 3,
        phase: "Cognitive",
        text: "In a group project, you naturally gravitate towards:",
        options: [
            "Structuring the work, setting deadlines, and tracking progress",
            "Doing the technical or detailed execution work alone",
            "Presenting the final result and convincing others",
            "Designing how the final result looks and feels"
        ]
    },
    {
        id: 4,
        phase: "Cognitive",
        text: "When solving a problem, do you prefer:",
        options: [
            "A clear, logical path with a defined right answer",
            "An open-ended creative challenge with many solutions",
            "A fast-paced situation where you react to people",
            "A strategic puzzle where you plan the best approach"
        ]
    },
    {
        id: 5,
        phase: "Cognitive",
        text: "How do you handle repetitive, detailed tasks?",
        options: [
            "I enjoy the rhythm and getting the details perfect",
            "I tolerate them if they lead to a bigger insight or result",
            "I automate or delegate them because I get bored easily",
            "I struggle to stay focused and make mistakes"
        ]
    },
    {
        id: 6,
        phase: "Cognitive",
        text: "If you had to spend a day doing one of these, you'd choose:",
        options: [
            "Solving logic puzzles or coding challenges",
            "Writing a persuasive article or speech",
            "Designing a poster or website layout",
            "Interviewing people to understand their needs"
        ]
    },

    // PHASE 2: REALITY CHECK (Q7-10)
    {
        id: 7,
        phase: "Reality",
        text: "Software Engineering & Data Science require spending 90% of your time alone with a computer, often frustrated by broken code. How does this sound?",
        options: [
            "That sounds ideal - I love deep focus",
            "I can handle it if the work is interesting",
            "I'd get lonely and need more human interaction",
            "That sounds like a nightmare"
        ]
    },
    {
        id: 8,
        phase: "Reality",
        text: "Sales & Marketing roles often involve high pressure, rejection, and constantly changing targets. How do you feel about this?",
        options: [
            "I thrive on competition and hitting targets",
            "It's stressful but I can manage it for the reward",
            "I prefer stability and predictable work",
            "I would be very anxious and unhappy"
        ]
    },
    {
        id: 9,
        phase: "Reality",
        text: "UX Design & Product Management involve constant criticism and defending your decisions to stakeholders. Your reaction:",
        options: [
            "I see feedback as a way to improve the work",
            "I can defend my choices if I have data",
            "I take criticism personally and find it draining",
            "I just want to be told what to do"
        ]
    },
    {
        id: 10,
        phase: "Reality",
        text: "Cyber Security requires constant vigilance, paranoia about risks, and often working odd hours during incidents. Thoughts?",
        options: [
            "I love the idea of being a protector/defender",
            "I can be disciplined if the mission is important",
            "I prefer a creative and relaxed environment",
            "Too much stress and responsibility for me"
        ]
    },

    // PHASE 3: GRIT & COMPLETION (Q11-13)
    {
        id: 11,
        phase: "Grit",
        text: "Think about the last difficult skill you tried to learn (instrument, language, etc.). What happened?",
        options: [
            "I stuck with it for months/years and got good",
            "I learned the basics but stopped when it got hard",
            "I dabbled for a few weeks then lost interest",
            "I rarely try to learn difficult new skills"
        ]
    },
    {
        id: 12,
        phase: "Grit",
        text: "When you encounter a wall in your work or studies, you typically:",
        options: [
            "Obsessively research and try solutions until it's fixed",
            "Ask for help after trying for a bit",
            "Switch to an easier task to feel productive",
            "Get discouraged and stop working"
        ]
    },
    {
        id: 13,
        phase: "Grit",
        text: "How many hours of focused, deep work can you do in a day without getting distracted?",
        options: [
            "6+ hours easy",
            "3-4 hours is my limit",
            "1-2 hours max",
            "I struggle to focus for more than 30 minutes"
        ]
    }
];

// STRICT OUTPUT FORMAT
export interface SignalBreakdown {
    cognitive_style: string;
    work_preferences: string;
    learning_stamina: string;
    decision_style: string;
}

export interface AssessmentResult {
    recommended_career: CareerName;
    confidence: "high" | "medium";
    scores: Record<CareerName, number>;
    signal_breakdown: SignalBreakdown;
    // Legacy fields for compatibility (mapped from new logic)
    positive_traits: string[];
    risk_flags: string[];
    runner_up: CareerName;
    breakdown?: any;
    tie_breaker_used: boolean;
}

const initialScores: Record<CareerName, number> = {
    "Software Engineering": 0,
    "Data Science": 0,
    "Business Analyst": 0,
    "Marketing": 0,
    "Sales": 0,
    "Security Engineering / Cyber Security": 0,
    "AI / Machine Learning": 0,
    "UX / UI Design": 0,
    "Product / Project Management": 0
};

export function calculateAssessment(answers: number[], tieBreakerAnswer?: { career: CareerName; selected: number }): AssessmentResult {
    // Deep copy initial scores
    const currentScores: Record<CareerName, number> = { ...initialScores };
    const positiveTraits: string[] = [];
    const riskFlags: string[] = [];

    // Track signal breakdown for narrative
    let cognitiveSignal = "Balanced";
    let workPrefSignal = "Flexible";
    let staminaSignal = "Moderate";
    let decisionSignal = "Mixed";

    // --- PHASE 1: COGNITIVE SCORING (Max ~50 pts) ---

    // Q1: Instructions
    if (answers[0] === 0) { // Systematic
        ["Software Engineering", "Security Engineering / Cyber Security", "Data Science", "AI / Machine Learning"].forEach(c => currentScores[c as CareerName] += 10);
        positiveTraits.push("Systematic Thinking");
        cognitiveSignal = "Systematic & Structured";
    } else if (answers[0] === 1) { // Visual/Example
        ["UX / UI Design", "Marketing", "Product / Project Management"].forEach(c => currentScores[c as CareerName] += 10);
        positiveTraits.push("Visual Learning");
        cognitiveSignal = "Visual & Applied";
    } else if (answers[0] === 2) { // Intuitive
        ["Sales", "Product / Project Management", "Marketing", "Business Analyst"].forEach(c => currentScores[c as CareerName] += 10);
        positiveTraits.push("Intuitive Solver");
        cognitiveSignal = "Intuitive & Organic";
    }

    // Q2: Data Reaction
    if (answers[1] === 0) { // Curiosity -> Data/AI
        ["Data Science", "AI / Machine Learning", "Business Analyst"].forEach(c => currentScores[c as CareerName] += 10);
        positiveTraits.push("Data Curiosity");
    } else if (answers[1] === 1) { // Overwhelm -> Creative/People
        ["UX / UI Design", "Sales", "Marketing"].forEach(c => currentScores[c as CareerName] += 8);
    } else if (answers[1] === 2) { // Utility -> PM/BA
        ["Product / Project Management", "Business Analyst", "Marketing"].forEach(c => currentScores[c as CareerName] += 8);
    }

    // Q3: Group Role
    if (answers[2] === 0) { // Structuring -> PM/BA
        ["Product / Project Management", "Business Analyst"].forEach(c => currentScores[c as CareerName] += 10);
        decisionSignal = "Organizer / Director";
    } else if (answers[2] === 1) { // Execution -> SWE/Data
        ["Software Engineering", "Data Science", "AI / Machine Learning"].forEach(c => currentScores[c as CareerName] += 10);
        decisionSignal = "Executor / Builder";
    } else if (answers[2] === 2) { // Presenting -> Sales/Marketing
        ["Sales", "Marketing"].forEach(c => currentScores[c as CareerName] += 10);
        decisionSignal = "Presenter / Persuader";
    } else if (answers[2] === 3) { // Designing -> UX
        ["UX / UI Design", "Marketing"].forEach(c => currentScores[c as CareerName] += 12); // Specialist boost
    }

    // Q4: Problem Solving
    if (answers[3] === 0) { // Logical Path
        ["Software Engineering", "Security Engineering / Cyber Security"].forEach(c => currentScores[c as CareerName] += 8);
    } else if (answers[3] === 1) { // Open-Ended
        ["UX / UI Design", "Marketing", "Product / Project Management"].forEach(c => currentScores[c as CareerName] += 8);
    } else if (answers[3] === 2) { // Fast Reaction
        ["Sales", "Product / Project Management", "Security Engineering / Cyber Security"].forEach(c => currentScores[c as CareerName] += 8);
    } else if (answers[3] === 3) { // Strategic
        ["Product / Project Management", "Business Analyst", "Data Science"].forEach(c => currentScores[c as CareerName] += 8);
    }

    // Q5: Repetitive Tasks
    if (answers[4] === 0) {
        ["Data Science", "Security Engineering / Cyber Security", "Software Engineering"].forEach(c => currentScores[c as CareerName] += 5);
        workPrefSignal = "Detail-Oriented";
    } else if (answers[4] === 2) { // Automate
        ["Software Engineering", "AI / Machine Learning"].forEach(c => currentScores[c as CareerName] += 8);
        workPrefSignal = "Efficiency-Focused";
    }

    // Q6: Day Choice
    if (answers[5] === 0) ["Software Engineering", "Data Science", "AI / Machine Learning"].forEach(c => currentScores[c as CareerName] += 10);
    if (answers[5] === 1) ["Marketing", "Sales", "Product / Project Management"].forEach(c => currentScores[c as CareerName] += 10);
    if (answers[5] === 2) ["UX / UI Design", "Marketing"].forEach(c => currentScores[c as CareerName] += 10);
    if (answers[5] === 3) ["Product / Project Management", "Sales", "Business Analyst"].forEach(c => currentScores[c as CareerName] += 10);


    // --- PHASE 2: REALITY CHECK SCORING (Penalties / Boosts) ---
    const techCareers = ["Software Engineering", "Data Science", "AI / Machine Learning", "Security Engineering / Cyber Security"];
    const salesCareers = ["Sales", "Marketing"];
    const productCareers = ["UX / UI Design", "Product / Project Management", "Business Analyst"];

    // Q7: Tech Isolation
    if (answers[6] === 0) techCareers.forEach(c => currentScores[c as CareerName] += 10);
    if (answers[6] === 2) techCareers.forEach(c => currentScores[c as CareerName] -= 15);
    if (answers[6] === 3) {
        techCareers.forEach(c => currentScores[c as CareerName] -= 30);
        riskFlags.push("Aversion to Isolation");
    }

    // Q8: Sales Pressure
    if (answers[7] === 0) salesCareers.forEach(c => currentScores[c as CareerName] += 10);
    if (answers[7] === 2) salesCareers.forEach(c => currentScores[c as CareerName] -= 10);
    if (answers[7] === 3) {
        salesCareers.forEach(c => currentScores[c as CareerName] -= 30);
        riskFlags.push("Aversion to Pressure");
    }

    // Q9: Criticism
    if (answers[8] === 2) productCareers.forEach(c => currentScores[c as CareerName] -= 10);
    if (answers[8] === 3) {
        productCareers.forEach(c => currentScores[c as CareerName] -= 25);
        riskFlags.push("Sensitivity to Feedback");
    }

    // Q10: Security
    if (answers[9] === 0) currentScores["Security Engineering / Cyber Security"] += 15;
    if (answers[9] === 3) currentScores["Security Engineering / Cyber Security"] -= 25;


    // --- PHASE 3: GRIT SCORING (Global + Specific) ---
    let gritMultiplier = 1.0;

    // Q11: Learning History
    if (answers[10] === 0) { gritMultiplier += 0.1; staminaSignal = "High Stamina"; }
    if (answers[10] === 3) { gritMultiplier -= 0.1; staminaSignal = "Low Stamina"; }

    // Q12: Hitting Wall
    if (answers[11] === 0) gritMultiplier += 0.1; // Resourceful
    if (answers[11] === 3) gritMultiplier -= 0.15; // Quit

    // Q13: Focus Time
    if (answers[12] === 0) { // 6+ hours
        techCareers.forEach(c => currentScores[c as CareerName] += 10);
        staminaSignal = "Deep Focus Expert";
    }
    if (answers[12] === 3) { // <30 mins
        techCareers.forEach(c => currentScores[c as CareerName] -= 20); // Massive penalty for tech
        staminaSignal = "Short Focus Bursts";
    }


    // --- FINAL NORMALIZATION (0-100) ---
    let maxScore = 0;
    Object.keys(currentScores).forEach(key => {
        const c = key as CareerName;
        currentScores[c] = Math.max(0, Math.round(currentScores[c] * gritMultiplier));
        if (currentScores[c] > maxScore) maxScore = currentScores[c];
    });

    // Ensure at least one score is >= 70 (as requested)
    if (maxScore < 70 && maxScore > 0) {
        const scaleFactor = 75 / maxScore; // Boost winner to 75
        Object.keys(currentScores).forEach(key => {
            const c = key as CareerName;
            currentScores[c] = Math.round(currentScores[c] * scaleFactor);
        });
    }

    // Sort to find winner
    const sortedCareers = Object.entries(currentScores)
        .sort(([, a], [, b]) => b - a)
        .map(([name, score]) => ({ name: name as CareerName, score }));

    const winner = sortedCareers[0];
    const runnerApps = sortedCareers.length > 1 ? sortedCareers[1].name : "Sales";

    // Confidence
    const confidence = (sortedCareers.length > 1 && (winner.score - sortedCareers[1].score > 10)) ? "high" : "medium";

    return {
        recommended_career: winner.name,
        confidence,
        scores: currentScores,
        signal_breakdown: {
            cognitive_style: cognitiveSignal,
            work_preferences: workPrefSignal,
            learning_stamina: staminaSignal,
            decision_style: decisionSignal
        },
        // Mapped legacy fields
        positive_traits: positiveTraits,
        risk_flags: riskFlags,
        runner_up: runnerApps,
        tie_breaker_used: !!tieBreakerAnswer
    };
}

export function needsTieBreaker(scores: any): { needed: boolean; career1?: CareerName; career2?: CareerName } {
    return { needed: false };
}
