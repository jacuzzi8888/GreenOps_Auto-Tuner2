import axios from 'axios';
import { spawn } from 'child_process';
import * as path from 'path';

async function runSmokeTest() {
    console.log('Starting GreenOps Auto-Tuner server for smoke test...');
    
    const serverProcess = spawn('npm', ['run', 'dev'], {
        cwd: path.resolve(__dirname, '..'),
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true
    });

    let isUp = false;

    await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Server start timed out')), 15000);
        
        serverProcess.stdout.on('data', (data) => {
            const out = data.toString();
            // Assuming standard start logging
            if (out.toLowerCase().includes('running') || out.toLowerCase().includes('listen') || out.toLowerCase().includes('port')) {
                clearTimeout(timeout);
                isUp = true;
                resolve();
            }
        });
        
        serverProcess.stderr.on('data', (data) => {
            const out = data.toString();
            // tsx might output warnings, don't fail immediately unless it exits
            if (out.toLowerCase().includes('error')) {
               console.error(`[Server Error/Warning] ${out}`);
            }
        });

        serverProcess.on('close', (code) => {
            if (!isUp) reject(new Error(`Server exited early with code ${code}`));
        });
    });

    console.log('Server is up. Pinging /health...');
    
    try {
        const PORT = process.env.PORT || 3000;
        const res = await axios.get(`http://localhost:${PORT}/health`);
        
        if (res.status === 200 && res.data.status === 'ok') {
            console.log('✅ Smoke test passed! /health responded successfully.');
        } else {
            throw new Error(`Unexpected response: ${JSON.stringify(res.data)}`);
        }
    } catch (e: any) {
        console.error('❌ Smoke test failed:', e.message);
        process.exitCode = 1;
    } finally {
        console.log('Shutting down server...');
        serverProcess.kill();
    }
}

runSmokeTest();
