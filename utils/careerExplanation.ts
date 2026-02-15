import { AssessmentResult, CareerName } from './careerScoring';

export type InsightStatus = "Recommended" | "Good Match" | "Explore" | "Not Ideal";
export type ConfidenceTone = "calm" | "encouraging" | "neutral";

// Legacy types for compatibility
export type FitLabel = "Strong Fit" | "Possible Fit" | "Poor Fit";

export interface CareerExplanationResult {
    // New Insight Agent Fields
    status: InsightStatus;
    headline: string;
    daily_reality: string; // "daily_reality_preview"
    why_it_fits: string[];
    why_it_may_not: string[];
    insightBullets: string[];
    confidence_tone: ConfidenceTone;

    // Legacy/Schema Compatibility
    verdict: "recommended" | "not_recommended";
    fitLabel: FitLabel; // Mapped from status
    shortReason: string;
    insightStrip: string;
    dayToDay: string; // Alias for daily_reality
    thrivesHere: string[]; // Alias for why_it_fits
    strugglesHere: string; // Joined why_it_may_not
    surprises: string;
}

// Map traits to the careers they support
const TRAIT_CAREER_MAP: Record<string, CareerName[]> = {
    "Systematic, step-by-step thinking": ["Software Engineering", "Security Engineering / Cyber Security", "Data Science", "AI / Machine Learning"],
    "Visual and example-based learning": ["UX / UI Design", "Marketing", "Product / Project Management"],
    "Intuitive problem solving": ["Sales", "Product / Project Management", "Marketing", "Business Analyst"],
    "Natural curiosity for data and patterns": ["Data Science", "AI / Machine Learning", "Business Analyst", "Security Engineering / Cyber Security"],
    "Pragmatic approach to information": ["Product / Project Management", "Business Analyst"],
    "Strong organizational leadership": ["Product / Project Management", "Business Analyst", "Security Engineering / Cyber Security"],
    "Focus on detailed execution": ["Software Engineering", "Data Science", "AI / Machine Learning"],
    "Persuasive communication skills": ["Sales", "Marketing", "Product / Project Management"],
    "Creative design instincts": ["UX / UI Design", "Marketing"],
    "Drive to automate efficiency": ["Software Engineering", "AI / Machine Learning", "Data Science"],
    "Resourceful independent problem solving": ["Software Engineering", "Data Science", "AI / Machine Learning", "Security Engineering / Cyber Security"],
    "Exceptional deep work stamina": ["Software Engineering", "Data Science", "AI / Machine Learning", "Security Engineering / Cyber Security"]
};

// Map careers to their "Anti-Traits" (Risks)
const CAREER_RISK_MAP: Record<CareerName, string[]> = {
    "Software Engineering": ["Strong aversion to isolated technical work", "Struggle with sustained attention", "Visual and example-based learning", "Persuasive communication skills"],
    "Data Science": ["Strong aversion to isolated technical work", "Visual and example-based learning", "Intuitive problem solving"],
    "Security Engineering / Cyber Security": ["Strong aversion to isolated technical work", "Creative design instincts"],
    "AI / Machine Learning": ["Strong aversion to isolated technical work", "Visual and example-based learning"],
    "Sales": ["Strong aversion to high-pressure sales environments", "Systematic, step-by-step thinking", "Focus on detailed execution"],
    "Marketing": ["Strong aversion to high-pressure sales environments", "Focus on detailed execution"],
    "UX / UI Design": ["Sensitivity to constant criticism/feedback", "Systematic, step-by-step thinking", "Natural curiosity for data and patterns"],
    "Product / Project Management": ["Sensitivity to constant criticism/feedback", "Focus on detailed execution"],
    "Business Analyst": ["Creative design instincts", "Intuitive problem solving"]
};

// Required Traits for each role (The "Role Side" of comparison)
const REQUIRED_TRAITS: Record<CareerName, string[]> = {
    "Software Engineering": ["Logical Problem Solving", "Deep Focus", "Systematic Thinking"],
    "Data Science": ["Pattern Recognition", "Analytical Rigor", "Deep Focus"],
    "AI / Machine Learning": ["Abstract Logic", "Automation Mindset", "Deep Focus"],
    "Security Engineering / Cyber Security": ["Vigilance", "Systematic Thinking", "Deep Focus"],
    "UX / UI Design": ["Visual Creativity", "Empathy", "Iterative Design"],
    "Product / Project Management": ["Strategic Vision", "Leadership", "Decision Making"],
    "Business Analyst": ["Data Interpretation", "Communication", "Structure"],
    "Marketing": ["Creative Strategy", "Persuasion", "Visual Eye"],
    "Sales": ["Resilience", "Persuasion", "Relationship Building"]
};

// HUMAN-CENTRIC CONTENT MAP
const CAREER_NARRATIVES: Record<CareerName, {
    shortReason: string;
    insightStrip: string;
    dailyReality: string;
    fits: string[]; // "why_it_fits"
    misfits: string[]; // "why_it_may_not"
    surprises: string;
}> = {
    "Software Engineering": {
        shortReason: "Systems Architecture",
        insightStrip: "building things that run on their own.",
        dailyReality: "You'll spend most of your day writing code, debugging complex errors, and designing systems that need to handle millions of requests without breaking.",
        fits: [
            "You enjoy deep, solitary focus and losing track of time.",
            "You prefer systematic, step-by-step problem solving.",
            "You want to build tools that others rely on."
        ],
        misfits: [
            "You dislike working in isolation for long periods.",
            "You prefer rapid, visual feedback over abstract logic.",
            "You find constant debugging frustrating rather than rewarding."
        ],
        surprises: "It's more about reading other people's code than writing new code from scratch."
    },
    "Data Science": {
        shortReason: "Applied Analytics",
        insightStrip: "discovering hidden truths in messy numbers.",
        dailyReality: "You'll be cleaning messy data, building statistical models, and translating complex numbers into clear stories for business leaders.",
        fits: [
            "You are naturally curious and ask 'why' constantly.",
            "You see patterns where others see noise.",
            "You enjoy backing up your opinions with hard proof."
        ],
        misfits: [
            "You prefer gut-feeling decisions over data-driven ones.",
            "You get bored by the tedious process of cleaning data.",
            "You dislike explaining technical concepts to non-technical people."
        ],
        surprises: "80% of the work is just finding and fixing the data, not running cool AI models."
    },
    "Business Analyst": {
        shortReason: "Enterprise Insights",
        insightStrip: "translating messy needs into clear plans.",
        dailyReality: "You'll interview stakeholders to find out what they really need, then write clear documents that help developers build it right.",
        fits: [
            "You can explain complex things simply.",
            "You like bringing order to chaotic projects.",
            "You enjoy being the bridge between teams."
        ],
        misfits: [
            "You dislike meetings or constant coordination.",
            "You get frustrated when requirements change frequently.",
            "You want to be the one building, not just planning."
        ],
        surprises: "You spend more time listening and documenting than actually telling people what to do."
    },
    "Marketing": {
        shortReason: "Brand Growth",
        insightStrip: "analyzing audience behavior and creating campaigns.",
        dailyReality: "You'll analyze audience behavior, create campaigns that grab attention, and measure what actually drives sales and engagement.",
        fits: [
            "You love figuring out what makes people tick.",
            "You enjoy mixing creativity with data analysis.",
            "You want your work to be seen by a large audience."
        ],
        misfits: [
            "You prefer stable, predictable results over experimentation.",
            "You dislike the pressure of constant performance metrics.",
            "You prefer working on a single deep problem for months."
        ],
        surprises: "It's less about 'being creative' and more about testing what works and repeating it."
    },
    "Sales": {
        shortReason: "Client Advocacy",
        insightStrip: "winning people over and closing deals.",
        dailyReality: "You'll reach out to potential clients, understand their pain points, and convince them that your solution is worth their investment.",
        fits: [
            "You get energy from talking to new people.",
            "You are competitive and love hitting targets.",
            "You don't take rejection personally."
        ],
        misfits: [
            "You find it exhausting to constantly push for the next win.",
            "You take 'no' to heart or fear rejection.",
            "You prefer deep analytical work over social interaction."
        ],
        surprises: "The best salespeople listen more than they talk—it's about helpfulness, not aggressive pitching."
    },
    "Security Engineering / Cyber Security": {
        shortReason: "Digital Defense",
        insightStrip: "outsmarting threats before they happen.",
        dailyReality: "You'll monitor systems for attacks, test defenses by trying to break them, and respond instantly when a breach occurs.",
        fits: [
            "You like thinking like a detective or adversary.",
            "You want to be the protector of critical systems.",
            "You stay calm and focused during high-stress incidents."
        ],
        misfits: [
            "You prefer a relaxed, low-stress work environment.",
            "You dislike being the 'blocker' who says no to new features.",
            "You struggle with the paranoia of constant risks."
        ],
        surprises: "You're often the 'fun police' telling other developers they can't launch a feature yet because it's unsafe."
    },
    "AI / Machine Learning": {
        shortReason: "Neural Systems",
        insightStrip: "teaching computers to learn on their own.",
        dailyReality: "You'll design algorithms that improve over time, feed them massive datasets, and tune them to make accurate predictions.",
        fits: [
            "You are fascinated by how intelligence works.",
            "You love experimenting with cutting-edge technology.",
            "You are comfortable with heavy mathematics and abstraction."
        ],
        misfits: [
            "You want to build finished products quickly.",
            "You find the 'black box' nature of AI frustrating.",
            "You prefer human-centric design over abstract data logic."
        ],
        surprises: "Models are often a 'black box'—sometimes even you won't know exactly why the AI made a specific decision."
    },
    "UX / UI Design": {
        shortReason: "Human Experience",
        insightStrip: "making complex tools feel intuitive.",
        dailyReality: "You'll sketch interfaces, test them with real users to see where they get stuck, and refine pixel-perfect designs.",
        fits: [
            "You notice bad design everywhere and want to fix it.",
            "You care deeply about how a product 'feels' to use.",
            "You can take criticism on my work well."
        ],
        misfits: [
            "You fall in love with your first idea easily.",
            "You dislike the iterative process of throwing away designs.",
            "You prefer coding logic over visual nuances."
        ],
        surprises: "It's not just making it pretty; it's about making it work for the user's brain."
    },
    "Product / Project Management": {
        shortReason: "Strategic Delivery",
        insightStrip: "rallying teams to ship great products.",
        dailyReality: "You'll prioritize what features to build next, unblock your team when they get stuck, and keep stakeholders happy.",
        fits: [
            "You are a natural organizer and leader.",
            "You enjoy making decisions with imperfect information.",
            "You like seeing the big picture come to life."
        ],
        misfits: [
            "You want to be the one 'doing' the hands-on work.",
            "You dislike conflict resolution and politics.",
            "You prefer a single clear task over multitasking."
        ],
        surprises: "You have all the responsibility but often zero direct authority—you have to lead by influence, not command."
    }
};

function getRoleTraits(career: CareerName): string[] {
    return REQUIRED_TRAITS[career] || ["Core Skill 1", "Core Skill 2", "Core Skill 3"];
}

export function generateCareerExplanation(
    selectedCareer: CareerName,
    assessmentResult: AssessmentResult
): CareerExplanationResult {
    const { scores, recommended_career } = assessmentResult;
    // Current scores are normalized 0-100
    const currentScore = scores[selectedCareer] || 0;

    // Find Winner Score for relative comparison
    const winnerScore = Math.max(...Object.values(scores));

    // --- INSIGHT AGENT LOGIC (Status Determination) ---
    let status: InsightStatus = "Explore";
    let fitLabel: FitLabel = "Poor Fit";
    let tone: ConfidenceTone = "neutral";

    const isWinner = selectedCareer === recommended_career;
    const diff = winnerScore - currentScore;

    if (isWinner) {
        status = "Recommended";
        fitLabel = "Strong Fit";
        tone = "calm"; // High confidence
    } else if (diff <= 8) {
        status = "Good Match";
        fitLabel = "Strong Fit";
        tone = "encouraging";
    } else if (currentScore > 40) {
        status = "Explore";
        fitLabel = "Possible Fit";
        tone = "neutral";
    } else {
        status = "Not Ideal";
        fitLabel = "Poor Fit";
        tone = "neutral"; // Or caution
    }

    // --- NARRATIVE GENERATION ---
    const content = CAREER_NARRATIVES[selectedCareer] || CAREER_NARRATIVES["Software Engineering"];

    // Headline Logic
    let headline = "";
    if (status === "Recommended") {
        headline = "This career aligns naturally with your strengths.";
    } else if (status === "Good Match") {
        headline = "This is a strong alternative path for you.";
    } else if (status === "Explore") {
        headline = "You have some traits for this, but adapt as needed.";
    } else {
        headline = "This path might require working against your natural grain.";
    }

    // --- TRAIT CLUSTERING (STRICT RESET) ---
    const insightBullets: string[] = [];
    const signals = assessmentResult.signal_breakdown;

    // Translation Logic: Technical Signal -> Student-Friendly Experience
    // VARY PHRASING: Avoid repeating "Because" too many times.

    if (status === "Recommended" || status === "Good Match") {
        // POSITIVE ALIGNMENT
        if (signals.cognitive_style.includes("Systematic")) {
            insightBullets.push("Your preference for following clear steps aligns perfectly with the logical, structured thinking this career requires daily.");
        } else if (signals.cognitive_style.includes("Visual")) {
            insightBullets.push("Since you enjoy seeing how things look, you'll thrive in this role by creating and testing visual ideas.");
        } else if (signals.cognitive_style.includes("Intuitive")) {
            insightBullets.push("This career rewards your organic decision-making style, allowing you to solve problems using your natural intuition.");
        }

        if (signals.decision_style.includes("Organizer")) {
            insightBullets.push("Your talent for managing plans makes you a great fit for keeping teams on track and organized.");
        } else if (signals.decision_style.includes("Executor")) {
            insightBullets.push("You'll find it rewarding to build real products from scratch, matching your preference for hands-on execution.");
        } else if (signals.decision_style.includes("Presenter")) {
            insightBullets.push("This role fits your love for winning people over, as you'll be communicating with and convincing others daily.");
        }

        if (signals.learning_stamina.includes("Deep Focus")) {
            insightBullets.push("The space for deep, uninterrupted work in this career is ideal for someone who enjoys getting lost in a task for hours.");
        }
    } else {
        // CAUTIONARY / MISALIGNMENT
        if (signals.cognitive_style.includes("Intuitive") &&
            ["Software Engineering", "Data Science", "AI / Machine Learning", "Security Engineering / Cyber Security"].includes(selectedCareer)) {
            insightBullets.push("While you prefer organic problem solving, this path relies on strict, rigid logic which may feel restrictive.");
        }

        if (signals.work_preferences.includes("Aversion to Pressure") &&
            ["Sales", "Marketing"].includes(selectedCareer)) {
            insightBullets.push("Your preference for a low-stress environment might clash with the high-pressure targets often found in this field.");
        }

        if (signals.learning_stamina.includes("Short Focus") &&
            ["Software Engineering", "AI / Machine Learning", "Data Science"].includes(selectedCareer)) {
            insightBullets.push("This career requires sitting with one problem for a long time, which could be challenging if you prefer quick task switching.");
        }

        if (signals.decision_style.includes("Executor") &&
            ["Product / Project Management", "Business Analyst"].includes(selectedCareer)) {
            insightBullets.push("You might find yourself spending more time planning than doing, which can be tough if you prefer building things yourself.");
        }
    }

    // Default Fallback (Ensuring 3-4 bullets)
    if (insightBullets.length < 3) {
        if (status === "Recommended" || status === "Good Match") {
            insightBullets.push("The constantly evolving technology in this field matches your ability to learn new skills quickly.");
            insightBullets.push("You'll see the direct impact of your work as your decisions affect real-world users.");
        } else {
            insightBullets.push("The amount of trial and error involved might be frustrating if you prefer more predictable outcomes.");
            insightBullets.push("This role focuses heavily on one specialized area, which may feel narrow if you enjoy a more varied day.");
        }
    }

    // Trim to 4 max
    const finalBullets = insightBullets.slice(0, 4);

    return {
        // New Agent Fields
        status,
        headline,
        daily_reality: content.dailyReality,
        why_it_fits: content.fits,
        why_it_may_not: content.misfits,
        insightBullets: finalBullets,
        confidence_tone: tone,

        // Legacy/Schema Compatibility
        verdict: isWinner ? "recommended" : "not_recommended",
        fitLabel,
        shortReason: content.shortReason,
        insightStrip: content.insightStrip,
        dayToDay: content.dailyReality, // Alias
        thrivesHere: content.fits, // Alias
        strugglesHere: content.misfits.join(" "), // Flatten for legacy string field
        surprises: content.surprises
    };
}
