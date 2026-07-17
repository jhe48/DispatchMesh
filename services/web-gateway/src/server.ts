import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { handleWebSocketConnection } from './handlers/websocket-handler.js';

const app = express();

app.use(cors());
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ── HTTP + WebSocket server ─────────────────────────────────────────────
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('[ws] new connection');
  handleWebSocketConnection(ws);
});

// ── Start ───────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, () => {
  console.log(`[web-gateway] listening on port ${PORT}`);
});
