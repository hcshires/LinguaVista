const express = require('express');
const WebSocket = require('ws');
const { Worker } = require('worker_threads');
const app = express();
const server = require('http').createServer(app);

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }
  
// Create separate WebSocket clients for each stream
class StreamProcessor {
    constructor(streamType, processingWorker) {
        this.streamType = streamType;
        this.worker = processingWorker;
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(`ws://localhost:8081/${this.streamType}`);
        
        this.ws.on('message', async (data) => {
            // Send data to worker for processing
            this.worker.postMessage({ type: this.streamType, data });
        });

        this.ws.on('close', () => {
            console.log(`${this.streamType} connection closed, reconnecting...`);
            setTimeout(() => this.connect(), 5000);
        });
    }
}

// Initialize workers and processors
const videoWorker = new Worker('./workers/videoProcessor.js');
const audioWorker = new Worker('./workers/audioProcessor.js');
const transcriptWorker = new Worker('./workers/transcriptProcessor.js');

const processors = {
    video: new StreamProcessor('video', videoWorker),
    audio: new StreamProcessor('audio', audioWorker),
    transcript: new StreamProcessor('transcript', transcriptWorker)
};

// Handle worker messages
videoWorker.on('message', (result) => {
});

audioWorker.on('message', (result) => {
});

transcriptWorker.on('message', (result) => {
});

// Start server
server.listen(3010, () => {
    console.log('Server running on port 3010');
});
app.use(express.json());
// app.use(cors());
// app.use("/api/user", user);
// app.use("/api/image", image);
