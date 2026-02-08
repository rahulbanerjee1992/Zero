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
    qualities: string;
    dayInTheLife: string;
    videoLabel: string;
    alignmentDetail: string;
}

/**
 * Generate a complete career explanation based on work-style analysis
 */
export function generateCareerExplanation(
    career: string,
    recommendedCareer: string,
    workStyle: WorkStyleTendencies
): CareerExplanation {
    const qualities = generateQualities(career, workStyle);
    const dayInTheLife = generateDayInTheLife(career);
    const alignmentDetail = generateAlignmentDetail(career, recommendedCareer, workStyle);

    return {
        qualities,
        dayInTheLife,
        alignmentDetail,
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
 * Generate the qualities paragraph
 */
function generateQualities(career: string, workStyle: WorkStyleTendencies): string {
    const { dominantTraits } = workStyle;

    // Career-specific qualities templates
    const paragraphs: Record<string, string> = {
        'Software Engineering': generateSoftwareEngineeringQualities(dominantTraits),
        'Product Management': generateProductManagementQualities(dominantTraits),
        'Data Science': generateDataScienceQualities(dominantTraits),
        'UX Design': generateUXDesignQualities(dominantTraits),
        'Operations': generateOperationsQualities(dominantTraits),
        'Marketing': generateMarketingQualities(dominantTraits),
        'Sales': generateSalesQualities(dominantTraits),
        'Finance': generateFinanceQualities(dominantTraits),
        'Customer Success': generateCustomerSuccessQualities(dominantTraits)
    };

    return paragraphs[career] || `${career} professionals tend to be adaptable and focused. They enjoy solving problems and contributing to their team's success through consistent effort and clear communication.`;
}

/**
 * Generate "Day in the Life" paragraph
 */
function generateDayInTheLife(career: string): string {
    const descriptions: Record<string, string> = {
        'Software Engineering': "A typical day involves understanding requirements, writing and reviewing code, debugging issues, collaborating with teammates, and gradually improving systems.",
        'Product Management': "A typical day involves meeting with stakeholders, defining product requirements, prioritizing the roadmap, and ensuring the team is aligned on the core vision.",
        'Data Science': "A typical day involves extracting and cleaning data, building statistical models, analyzing results, and communicating insights to help guide business decisions.",
        'UX Design': "A typical day involves researching user needs, creating wireframes and prototypes, conducting usability tests, and iterating on designs based on feedback.",
        'Operations': "A typical day involves monitoring system performance, optimizing workflows, managing resources, and ensuring the organization's infrastructure runs smoothly.",
        'Marketing': "A typical day involves planning campaigns, creating content, analyzing audience engagement, and refining messaging to drive awareness and growth.",
        'Sales': "A typical day involves identifying prospects, building relationships, understanding customer needs, and navigating conversations to help clients find the right solutions.",
        'Finance': "A typical day involves analyzing financial data, building projection models, evaluating risks, and providing insights to support strategic investment decisions.",
        'Customer Success': "A typical day involves onboarding new users, solving customer problems, gathering product feedback, and ensuring clients achieve their long-term goals."
    };

    return descriptions[career] || "A typical day involves applying your specific skills to solve challenges, collaborating with your team, and contributing to the overall mission of the organization.";
}

// Career-specific paragraph generators

function generateSoftwareEngineeringQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    if (traits.actionBias === 'action-first' && traits.feedbackTolerance === 'immediate') {
        return "Software engineers tend to be patient, detail-oriented, and comfortable working through complex problems. They enjoy building systems step by step, debugging thoughtfully, and improving things over time.";
    }
    return "Software engineers are focused and analytical. They enjoy building reliable systems and solving technical challenges through iteration and attention to detail.";
}

function generateProductManagementQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Product managers tend to be collaborative, vision-oriented, and comfortable with ambiguity. They enjoy aligning teams, defining goals, and ensuring that products solve real user problems.";
}

function generateDataScienceQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Data scientists tend to be curious, analytical, and highly precise. They enjoy digging into complex data sets, finding hidden patterns, and using evidence to drive strategic decisions.";
}

function generateUXDesignQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "UX designers tend to be empathetic, creative, and detail-oriented. They enjoy understanding human behavior, prototyping solutions, and creating experiences that are both beautiful and functional.";
}

function generateOperationsQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Operations professionals tend to be systematic, organized, and focused on efficiency. They enjoy optimizing workflows, solving logistical puzzles, and building reliable foundations for growth.";
}

function generateMarketingQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Marketing professionals tend to be creative, strategic, and data-aware. They enjoy crafting compelling stories, experimenting with messaging, and reaching audiences through meaningful connection.";
}

function generateSalesQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Sales professionals tend to be resilient, communicative, and relationship-focused. They enjoy understanding customer needs, building trust, and helping others find value in new solutions.";
}

function generateFinanceQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Finance professionals tend to be rigorous, risk-aware, and detail-focused. They enjoy modeling scenarios, analyzing financial health, and providing the clarity needed for sound investment.";
}

function generateCustomerSuccessQualities(traits: WorkStyleTendencies['dominantTraits']): string {
    return "Customer success professionals tend to be empathetic, proactive, and problem-solvers. They enjoy building long-term relationships, helping users overcome hurdles, and advocating for the customer's voice.";
}
