import { parseProposalJson, enforceGuards, MAX_INFRA_FILES, MAX_DIFF_LENGTH } from '../src/analyzer';
import { GitLabChange } from '../src/types';

describe('Analyzer Hardening and Guards', () => {

    describe('JSON Validation (G9)', () => {
        it('should pass valid proposal schema', () => {
            const raw = `\`\`\`json
[
    {
        "file_path": "main.tf",
        "explanation": "Test",
        "evidence": "line",
        "confidence": 0.9,
        "estimated_carbon_delta": { "unit": "kgCO2e", "monthly": -10 }
    }
]
\`\`\``;
            const parsed = parseProposalJson(raw);
            expect(parsed).toHaveLength(1);
        });

        it('should reject non-array payload', () => {
            expect(() => parseProposalJson('{"file_path": "a"}')).toThrow();
        });

        it('should reject missing required fields', () => {
            const invalid = `[{"file_path": "main.tf"}]`;
            expect(() => parseProposalJson(invalid)).toThrow();
        });

        it('should strip markdown fences and parse json', () => {
            const raw = `\`\`\`json
[
    { "file_path": "a.tf", "explanation": "e", "evidence": "ev", "confidence": 0.5 }
]
\`\`\``;
            const parsed = parseProposalJson(raw);
            expect(parsed).toHaveLength(1);
            expect(parsed[0].file_path).toBe('a.tf');
        });

        it('should throw on parse error', () => {
            expect(() => parseProposalJson('not json')).toThrow('Unexpected token');
        });
    });

    describe('Diff and File Guards (G11)', () => {
        it('should truncate files exceeding MAX_INFRA_FILES', () => {
            const files = Array.from({ length: MAX_INFRA_FILES + 5 }, (_, i) => ({
                new_path: `file${i}.tf`,
                diff: 'diff'
            } as GitLabChange));

            const { files: guarded, truncated } = enforceGuards(files);
            expect(guarded.length).toBe(MAX_INFRA_FILES);
            expect(truncated).toBe(true);
        });

        it('should truncate diffs exceeding MAX_DIFF_LENGTH', () => {
            const oversizedDiff = 'a'.repeat(MAX_DIFF_LENGTH + 100);
            const files: GitLabChange[] = [{ new_path: 'main.tf', diff: oversizedDiff } as GitLabChange];

            const { files: guarded, truncated } = enforceGuards(files);
            expect(truncated).toBe(true);
            expect(guarded[0].diff.length).toBeLessThan(MAX_DIFF_LENGTH + 100);
            expect(guarded[0].diff).toContain('[truncated by GreenOps]');
        });

        it('should not alter files within limits', () => {
            const files: GitLabChange[] = [{ new_path: 'main.tf', diff: 'hello' } as GitLabChange];
            const { files: guarded, truncated } = enforceGuards(files);
            expect(truncated).toBe(false);
            expect(guarded).toEqual(files);
        });
    });

});
