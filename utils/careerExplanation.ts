/**
 * Career Explanation Generator
 * 
 * Generates calm, professional explanations for career recommendations
 * based on observed work-style behaviors.
 * 
 * RULES:
 * - Recommend ONLY the provided career
 * - Do NOT mention personality types
 * - Do NOT guarantee success
 * - Do NOT compare against other careers
 * - Do NOT mention internal scoring or models
 */

import { WorkStyleTendencies } from './workStyleReasoning';

export interface CareerExplanation {
    qualities: string[];
    dayInTheLife: string;
    videoLabel: string;
    alignmentDetail: string;
    qualitiesIntro: string;
}

/**
 * Generate a complete career explanation based on work-style analysis
 */
export function generateCareerExplanation(
    career: string,
    recommendedCareer: string,
    workStyle: WorkStyleTendencies
): CareerExplanation {
    const isRecommended = career === recommendedCareer;
    const qualities = generateQualitiesList(career, workStyle, isRecommended);
    const dayInTheLife = generateDayInTheLife(career);
    const alignmentDetail = generateAlignmentDetail(career, recommendedCareer, workStyle);
    const qualitiesIntro = isRecommended
        ? "This path fits you because you demonstrated:"
        : "People who succeed in this role typically show:";

    return {
        qualities,
        dayInTheLife,
        alignmentDetail,
        qualitiesIntro,
        videoLabel: "Watch a short preview"
    };
}

/**
 * Generate detailed alignment narrative for the info tooltip
 */
function generateAlignmentDetail(
    career: string,
    recommendedCareer: string,
    workStyle: WorkStyleTendencies
): string {
    const isRecommended = career === recommendedCareer;
    const { dominantTraits } = workStyle;

    if (isRecommended) {
        return generateFitNarrative(career, dominantTraits);
    } else {
        return generateMisalignmentNarrative(career, recommendedCareer, dominantTraits);
    }
}

function generateFitNarrative(career: string, traits: WorkStyleTendencies['dominantTraits']): string {
    const fitParts = [];

    // Fit Reason
    fitParts.push(`Your natural approach to work makes you an exceptional fit for ${career}.`);

    // Traits Alignment
    const alignments = [];
    if (traits.actionBias === 'action-first') alignments.push("your bias for immediate action");
    if (traits.detailOrientation === 'detail-focused') alignments.push("your focus on precision");
    if (traits.collaborationPreference === 'collaborative') alignments.push("your collaborative instinct");
    if (traits.ambiguityComfort === 'high') alignments.push("your comfort with ambiguity");

    if (alignments.length > 0) {
        fitParts.push(`Specifically, ${alignments.slice(0, 2).join(' and ')} align perfectly with the core demands of this role.`);
    }

    return fitParts.join(' ');
}

function generateMisalignmentNarrative(
    career: string,
    recommendedCareer: string,
    traits: WorkStyleTendencies['dominantTraits']
): string {
    const parts = [];

    // Misalignment Reason
    parts.push(`While you have many strengths, ${career} may feel misaligned with your preferred way of working.`);

    // Conflict Traits
    const conflicts = [];
    if (traits.actionBias === 'understanding-first' && career === 'Software Engineering') {
        conflicts.push("your preference for thorough upfront analysis");
    }
    if (traits.collaborationPreference === 'independent' && career === 'Product Management') {
        conflicts.push("your preference for independent deep work");
    }
    if (traits.detailOrientation === 'big-picture' && career === 'Finance') {
        conflicts.push("your big-picture strategic focus");
    }

    if (conflicts.length > 0) {
        parts.push(`In particular, ${conflicts[0]} might conflict with the ${career} environment.`);
    }

    // Gentle Recommendation
    parts.push(`Based on your responses, we recommend ${recommendedCareer} instead.`);

    return parts.join(' ');
}

/**
 * Generate specific qualities/behaviors observed or required for the role
 */
function generateQualitiesList(career: string, workStyle: WorkStyleTendencies, isRecommended: boolean): string[] {
    const { dominantTraits } = workStyle;

    if (isRecommended) {
        // Return observed qualities
        const qualities = [];
        if (traitsMapping.actionBias[dominantTraits.actionBias]) qualities.push(traitsMapping.actionBias[dominantTraits.actionBias]);
        if (traitsMapping.detailOrientation[dominantTraits.detailOrientation]) qualities.push(traitsMapping.detailOrientation[dominantTraits.detailOrientation]);
        if (traitsMapping.collaborationPreference[dominantTraits.collaborationPreference]) qualities.push(traitsMapping.collaborationPreference[dominantTraits.collaborationPreference]);
        if (traitsMapping.ambiguityComfort[dominantTraits.ambiguityComfort]) qualities.push(traitsMapping.ambiguityComfort[dominantTraits.ambiguityComfort]);

        return qualities.length > 0 ? qualities : ["Adaptable problem solving", "Collaborative mindset"];
    } else {
        // Return qualities typically required for this non-recommended career
        // that the user might have shown the opposite of
        const requirements: Record<string, string[]> = {
            'Software Engineering': ["Focus on deep technical precision", "Systematic debugging mindset", "Patient iterative building"],
            'Data Science': ["Rigorous statistical validation", "Complex data pattern recognition", "Evidence-based decision making"],
            'Business Analyst': ["Bridging data with business context", "Stakeholder requirement gathering", "Organizational process mapping"],
            'Marketing': ["Dynamic growth experimentation", "Strategic brand storytelling", "Audience-centric messaging"],
            'Sales': ["High resilience and persistence", "Relationship-driven persuasion", "Observed focus on client needs"],
            'Security Engineering / Cyber Security': ["Rigorous system monitoring", "Threat landscape analysis", "Proactive vulnerability mitigation"],
            'AI / Machine Learning': ["Advanced algorithmic design", "Neural network optimization", "Large-data pattern inference"],
            'UX / UI Design': ["Deep user empathy", "Iterative human-centered prototyping", "Visual and structural precision"],
            'Product / Project Management': ["High comfort with radical ambiguity", "Cross-functional strategic alignment", "Long-term roadmap thinking"]
        };
        return requirements[career] || ["Specific specialized skills", "Targeted domain expertise"];
    }
}

const traitsMapping = {
    actionBias: {
        'action-first': "A strong bias for immediate action",
        'understanding-first': "Structured problem solving and analysis",
        'balanced': "A balanced approach to action and understanding"
    },
    detailOrientation: {
        'detail-focused': "Meticulous focus on technical precision",
        'big-picture': "Broad strategic thinking and vision",
        'balanced': "Balanced focus on detail and high-level strategy"
    },
    collaborationPreference: {
        'collaborative': "Natural instinct for team collaboration",
        'independent': "Ability to perform deep independent work",
        'balanced': "Comfortable with both collaborative and independent work"
    },
    ambiguityComfort: {
        'high': "High comfort with radical ambiguity",
        'moderate': "Balanced approach to certainty and exploration",
        'medium': "Balanced approach to certainty and exploration",
        'low': "Preference for clear, structured paths"
    }
};

/**
 * Generate "Day in the Life" paragraph
 */
function generateDayInTheLife(career: string): string {
    const descriptions: Record<string, string> = {
        'Software Engineering': "A typical day involves understanding requirements, writing and reviewing code, debugging issues, collaborating with teammates, and gradually improving systems.",
        'Data Science': "A typical day involves extracting and cleaning data, building statistical models, analyzing results, and communicating insights to help guide business decisions.",
        'Business Analyst': "A typical day involves meeting with stakeholders to gather requirements, analyzing data to find business opportunities, and building documentation that bridges the gap between teams.",
        'Marketing': "A typical day involves planning campaigns, creating content, analyzing audience engagement, and refining messaging to drive awareness and growth.",
        'Sales': "A typical day involves identifying prospects, building relationships, understanding customer needs, and navigating conversations to help clients find the right solutions.",
        'Security Engineering / Cyber Security': "A typical day involves monitoring network traffic, analyzing potential vulnerabilities, responding to incidents, and building robust defenses for organizational data.",
        'AI / Machine Learning': "A typical day involves designing experimental models, training algorithms on large datasets, optimizing performance metrics, and deploying intelligent systems.",
        'UX / UI Design': "A typical day involves researching user needs, creating wireframes and prototypes, conducting usability tests, and iterating on designs based on feedback.",
        'Product / Project Management': "A typical day involves meeting with stakeholders, defining requirements, prioritizing the roadmap, and ensuring the team is aligned on the core vision."
    };

    return descriptions[career] || "A typical day involves applying your specific skills to solve challenges, collaborating with your team, and contributing to the overall mission of the organization.";
}

// Career-specific paragraph generators
// These could be further expanded for all 9 roles, but for now we'll ensure they don't reference old roles.

function generateSoftwareEngineeringQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Software engineers are focused and analytical. They enjoy building reliable systems and solving technical challenges through iteration and attention to detail.";
}

function generateDataScienceQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Data scientists tend to be curious, analytical, and highly precise. They enjoy digging into complex data sets, finding hidden patterns, and using evidence to drive strategic decisions.";
}

function generateUXUIDesignQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "UX/UI designers tend to be empathetic, creative, and detail-oriented. They enjoy understanding human behavior, prototyping solutions, and creating experiences that are both beautiful and functional.";
}

function generateProductProjectManagementQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Product and project managers tend to be collaborative, vision-oriented, and comfortable with ambiguity. They enjoy aligning teams, defining goals, and ensuring that products solve real user problems.";
}

function generateBusinessAnalystQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Business analysts tend to be observant, structured, and communicative. They enjoy finding clarity in organizational needs and translating data into actionable business requirements.";
}

function generateSecurityEngineeringQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Security professionals tend to be vigilant, cautious, and detail-oriented. They enjoy protecting complex systems and staying ahead of potential threats through rigorous analysis.";
}

function generateAIQuality(traits: WorkStyleTendencies['dominantTraits']): string {
    return "AI and Machine Learning specialists tend to be experimental and mathematically precise. They enjoy solving high-complexity problems through algorithmic innovation and data-driven learning.";
}
