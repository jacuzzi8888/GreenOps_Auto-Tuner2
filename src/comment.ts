import { AnalysisProposal } from './types';

/**
 * Formats a rich optimization report from an array of analysis proposals.
 */
export function formatProposalComment(proposals: AnalysisProposal[]): string {
    if (proposals.length === 0) {
        return [
            `## 🌿 GreenOps Auto-Tuner — Analysis Complete`,
            ``,
            `✅ Your infrastructure changes are already highly optimized!`,
            `No cost or carbon reduction opportunities were identified in this MR.`,
            ``,
            `---`,
            `*Posted automatically by GreenOps Auto-Tuner*`,
        ].join('\n');
    }

    const totalSavings = proposals.reduce((acc, p) => acc + (p.estimated_savings?.monthly || 0), 0);
    const totalCarbon = proposals.reduce((acc, p) => acc + (p.estimated_carbon_delta?.monthly || 0), 0);

    const proposalSections = proposals.map((p, index) => {
        const savingsText = p.estimated_savings 
            ? `💰 **Estimated Savings:** $${p.estimated_savings.monthly.toFixed(2)}/mo`
            : `⏳ *Pricing verification pending review*`;

        const carbonText = p.estimated_carbon_delta
            ? `🍃 **Carbon Delta:** ${p.estimated_carbon_delta.monthly.toFixed(2)} ${p.estimated_carbon_delta.unit}/mo`
            : '';

        const badge = p.needs_review ? ' ⚠️ *Needs Review*' : '';

        return [
            `### Proposal #${index + 1}: ${p.file_path}${badge}`,
            ``,
            `**Recommendation:** ${p.explanation}`,
            ``,
            `**Evidence:**`,
            `> \`${p.evidence}\``,
            ``,
            savingsText,
            carbonText !== '' ? carbonText : null,
            `**Confidence:** ${(p.confidence * 100).toFixed(0)}%`,
            ``,
        ].filter(line => line !== null).join('\n');
    }).join('\n---\n');

    return [
        `## 🌿 GreenOps Auto-Tuner — Optimization Report`,
        ``,
        `🚀 **Total Estimated Savings:** $${totalSavings.toFixed(2)} / month`,
        totalCarbon !== 0 ? `🍃 **Total Carbon Reduction:** ${totalCarbon.toFixed(2)} kgCO2e / month` : '',
        ``,
        proposalSections,
        ``,
        `---`,
        `*Posted automatically by GreenOps Auto-Tuner*`,
    ].filter(line => line !== '').join('\n');
}

/**
 * Formats the fallback comment if analysis is detection-only or fails.
 */
export function formatBasicAnalysisComment(fileCount: number): string {
    return [
        `## 🌿 GreenOps Auto-Tuner — Detection Complete`,
        ``,
        `**${fileCount} infrastructure file(s)** detected.`,
        ``,
        `⚠️ Detailed analysis skipped due to engine configuration or error.`,
        ``,
        `---`,
        `*Posted automatically by GreenOps Auto-Tuner*`,
    ].join('\n');
}

/**
 * Formats a "no infra files" comment.
 */
export function formatNoInfraComment(): string {
    return [
        `## 🌿 GreenOps Auto-Tuner — Scan Complete`,
        ``,
        `No supported infrastructure files (\`.tf\`, \`.yaml\`, \`.yml\`) were found in this MR.`,
        `No analysis required.`,
        ``,
        `---`,
        `*Posted automatically by GreenOps Auto-Tuner*`,
    ].join('\n');
}
