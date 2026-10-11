const WebSocket = require('ws');
const crypto = require('crypto');
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });
const clients = new Map();
function send(ws, obj) { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj)); }
function broadcast(obj, except) {
  const data = JSON.stringify(obj);
  for (const ws of wss.clients) if (ws !== except && ws.readyState === WebSocket.OPEN) ws.send(data);
}
wss.on('connection', ws => {
  const id = crypto.randomUUID();
  ws.playerId = id;
  ws.playerState = { id, x: 0, z: 0, dir: 1, t: 1, ph: 0, rot: 0 };
  clients.set(id, ws);
  ws.on('message', raw => {
    if (raw.length > 4096) return;
    let m; try { m = JSON.parse(raw.toString()); } catch { return; }
    if (!m || typeof m.type !== 'string') return;
    if (m.type === 'join') {
      send(ws, { type: 'welcome', id, players: [...clients.values()].filter(c => c !== ws).map(c => ({ id: c.playerId, ...(c.playerState || {}) })) });
      broadcast({ type: 'state', player: { id, ...ws.playerState } }, ws);
    } else if (m.type === 'state' && m.player && typeof m.player.x === 'number' && typeof m.player.z === 'number') {
      // Accept only the small, expected state fields.
      const p = m.player;
      ws.playerState = {
        id, x: clamp(p.x, -100000, 100000), z: clamp(p.z, -100000, 100000),
        dir: p.dir < 0 ? -1 : 1, t: clamp(p.t || 0, -2, 2),
        ph: clamp(p.ph || 0, -1e6, 1e6), rot: clamp(p.rot || 0, -10, 10),
        rl: clamp(p.rl || 0, -1, 100), ammo: clamp(p.ammo || 0, 0, 1000)
      };
      broadcast({ type: 'state', player: ws.playerState }, ws);
    } else if (m.type === 'shot') {
      const shot = { type: 'shot', id };
      for (const k of ['x', 'y', 'vx', 'vy']) if (typeof m[k] === 'number' && Number.isFinite(m[k])) shot[k] = clamp(m[k], -100000, 100000);
      broadcast(shot, ws);
    }
  });
  ws.on('close', () => { clients.delete(id); broadcast({ type: 'leave', id }); });
  ws.on('error', () => {});
});
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
console.log(`Ragdoll multiplayer WebSocket server listening on ${PORT}`);
