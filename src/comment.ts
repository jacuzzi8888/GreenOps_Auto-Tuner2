import { GitLabChange } from './types';

/**
 * Formats the initial "Proof of Life" MR comment posted by GreenOps Auto-Tuner.
 * This will evolve into a full optimization report once LLM analysis is integrated (Task G5).
 */
export function formatAnalysisComment(infraFiles: GitLabChange[]): string {
    const fileList = infraFiles
        .map(f => `- \`${f.new_path || f.old_path}\``)
        .join('\n');

    return [
        `## 🌿 GreenOps Auto-Tuner — Analysis Complete`,
        ``,
        `**${infraFiles.length} infrastructure file(s)** detected in this MR:`,
        ``,
        fileList,
        ``,
        `> ⏳ Detailed optimization proposals with verified pricing and carbon estimates will appear here once the analysis engine is integrated.`,
        ``,
        `---`,
        `*Posted automatically by GreenOps Auto-Tuner*`,
    ].join('\n');
}

/**
 * Formats a "no infra files" comment indicating the MR was scanned but had nothing to analyze.
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
