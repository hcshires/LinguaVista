// Approach 1: Single Server with Workers
const express = require('express');
const WebSocket = require('ws');
const { Worker } = require('worker_threads');
const app = express();
const server = require('http').createServer(app);

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
