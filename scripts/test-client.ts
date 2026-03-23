import { analyzeInfraChanges } from '../src/analyzer';
import dotenv from 'dotenv';

dotenv.config();

console.log("🌿 Starting GreenOps Auto-Tuner Local Test...");

const mockGitLabChanges = [
    {
        old_path: "main.tf",
        new_path: "main.tf",
        diff: `
- resource "google_compute_instance" "default" {
-   name         = "my-instance"
-   machine_type = "e2-micro"
-   zone         = "us-central1-a"
- }
+ resource "google_compute_instance" "default" {
+   name         = "my-instance"
+   machine_type = "n2-standard-4"
+   zone         = "us-central1-a"
+ }
        `
    }
];

async function run() {
    try {
        console.log("Analyzing simulated infrastructure change (e2-micro -> n2-standard-4)...\n");
        const proposals = await analyzeInfraChanges(mockGitLabChanges);
        
        console.log("✅ Analysis Complete! Proposals:");
        console.log(JSON.stringify(proposals, null, 2));
    } catch (e: any) {
        console.error("❌ Error during analysis:", e.message);
    }
}

run();
