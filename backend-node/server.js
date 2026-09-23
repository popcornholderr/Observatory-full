const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use('/data', express.static(path.join(__dirname, '../data')));

const uploadsDir = path.join(__dirname, '../data/uploads');
const resultsDir = path.join(__dirname, '../data/results');
const pythonScriptDir = path.join(__dirname, '../python-analysis');
const pythonEnvBin = path.join(pythonScriptDir, 'venv', 'Scripts', 'python.exe'); 

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const jobId = uuidv4();
        req.jobId = jobId;
        const ext = path.extname(file.originalname);
        cb(null, `${jobId}${ext}`);
    }
});
const upload = multer({ storage });

const jobs = {};

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/analysis/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const jobId = req.jobId;
    const filepath = req.file.path;
    
    jobs[jobId] = {
        id: jobId,
        status: 'QUEUED',
        filename: req.file.originalname,
        result: null,
        error: null
    };

    res.status(202).json({ id: jobId, message: 'Analysis started' });

    runAnalysis(jobId, filepath);
});

async function runAnalysis(jobId, filepath) {
    const job = jobs[jobId];
    
    const updateStatus = async (status, delayMs) => {
        job.status = status;
        return new Promise(resolve => setTimeout(resolve, delayMs));
    };

    try {
        await updateStatus('PARSING', 500);
        await updateStatus('PREPROCESSING', 500);
        await updateStatus('DETECTING', 500);
        await updateStatus('ANALYZING', 500);
        await updateStatus('EXTRACTING', 500);
        await updateStatus('CLASSIFYING', 500);
        await updateStatus('GENERATING_REPORT', 500);

        let pythonExecutable = fs.existsSync(pythonEnvBin) ? pythonEnvBin : 'python';

        const pythonProcess = spawn(pythonExecutable, [
            'app.py',
            '--input', filepath,
            '--output-dir', resultsDir,
            '--job-id', jobId
        ], { cwd: pythonScriptDir });

        let stdoutData = '';
        let stderrData = '';

        pythonProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                job.status = 'FAILED';
                job.error = `Python execution failed: ${stderrData}`;
                return;
            }

            try {
                const lines = stdoutData.split('\n');
                let lastJson = null;
                for (const line of lines) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed) lastJson = parsed;
                    } catch(e) {}
                }

                if (lastJson && lastJson.result_file) {
                    const resultContent = fs.readFileSync(lastJson.result_file, 'utf8');
                    job.result = JSON.parse(resultContent);
                    job.status = 'COMPLETED';
                } else if (lastJson && lastJson.error) {
                    job.status = 'FAILED';
                    job.error = lastJson.error;
                } else {
                    job.status = 'FAILED';
                    job.error = 'No valid result returned from Python script';
                }
            } catch (err) {
                job.status = 'FAILED';
                job.error = `Failed to parse Python output: ${err.message}`;
            }
        });

    } catch (error) {
        job.status = 'FAILED';
        job.error = error.message;
    }
}

app.get('/api/analysis/:id/status', (req, res) => {
    const job = jobs[req.params.id];
    if (job) {
        res.json({ id: job.id, status: job.status, error: job.error });
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

app.get('/api/analysis/:id/results', (req, res) => {
    const job = jobs[req.params.id];
    if (job) {
        if (job.result) {
            res.json(job.result);
        } else {
            res.status(202).json({ message: 'Result not ready', status: job.status });
        }
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

app.get('/api/analysis/:id/export/json', (req, res) => {
    const job = jobs[req.params.id];
    if (job && job.result) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${job.id}_analysis.json"`);
        res.send(JSON.stringify(job.result, null, 2));
    } else {
        res.status(400).json({ error: 'Result not ready or not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Node backend listening on http://localhost:${PORT}`);
});
