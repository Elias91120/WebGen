// 17 OCTOBRE — a minimal WebSocket connection (RFC 6455), shared by the duel relay (relay.mjs) and the Manif world
// (monde.mjs): the handshake, masked client frames, text and binary messages, fragments, ping/pong, close. No
// dependency. A subclass gets onText(buffer), onBinary(buffer) and onClosed() (once, however the connection ends).

import { createHash } from 'node:crypto';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

/** Answers a WebSocket upgrade (the 101 handshake); false, after a 400, if the request isn't one. */
export function handshake(req, socket) {
  const key = req.headers['sec-websocket-key'];
  if (!key || String(req.headers.upgrade || '').toLowerCase() !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    return false;
  }
  const accept = createHash('sha1').update(key + GUID).digest('base64');
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  return true;
}

export class WsConn {
  constructor(socket, maxMessage) {
    this.socket = socket;
    this.maxMessage = maxMessage;
    this.buf = Buffer.alloc(0);
    this.frag = [];
    this.fragOp = 0;
    this.alive = Date.now();
    this.closed = false;
    this.ended = false;
    socket.setNoDelay(true);
    socket.on('data', (d) => this.onData(d));
    socket.on('close', () => this.end());
    socket.on('error', () => this.end());
  }

  onData(d) {
    this.alive = Date.now();
    this.buf = this.buf.length ? Buffer.concat([this.buf, d]) : d;
    while (this.buf.length >= 2) {
      const b0 = this.buf[0];
      const b1 = this.buf[1];
      const fin = (b0 & 0x80) !== 0;
      const op = b0 & 0x0f;
      let len = b1 & 0x7f;
      let off = 2;
      if (len === 126) {
        if (this.buf.length < 4) return;
        len = this.buf.readUInt16BE(2);
        off = 4;
      } else if (len === 127) {
        if (this.buf.length < 10) return;
        len = Number(this.buf.readBigUInt64BE(2));
        off = 10;
      }
      if (len > this.maxMessage) return this.close(1009);
      const masked = (b1 & 0x80) !== 0;
      if (!masked) return this.close(1002); // clients must mask
      if (this.buf.length < off + 4 + len) return;
      const mask = this.buf.subarray(off, off + 4);
      const payload = Buffer.from(this.buf.subarray(off + 4, off + 4 + len));
      for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
      this.buf = this.buf.subarray(off + 4 + len);
      if (op === 0x8) return this.close(1000);
      if (op === 0x9) { this.frame(0xa, payload); continue; }
      if (op === 0xa) continue;
      if (op === 0x1 || op === 0x2) { this.fragOp = op; this.frag = [payload]; }
      else if (op === 0x0) this.frag.push(payload);
      else return this.close(1003);
      if (!fin) {
        if (this.frag.reduce((n, p) => n + p.length, 0) > this.maxMessage) return this.close(1009);
        continue;
      }
      const msg = Buffer.concat(this.frag);
      this.frag = [];
      if (this.fragOp === 0x1) this.onText(msg);
      else this.onBinary(msg);
      if (this.closed) return;
    }
  }

  onText() {}

  onBinary() {}

  onClosed() {}

  send(obj) {
    this.frame(0x1, Buffer.from(JSON.stringify(obj)));
  }

  sendBinary(buf) {
    this.frame(0x2, buf);
  }

  frame(op, payload) {
    if (this.closed) return;
    const n = payload.length;
    let head;
    if (n < 126) head = Buffer.from([0x80 | op, n]);
    else if (n < 65536) {
      head = Buffer.alloc(4);
      head[0] = 0x80 | op;
      head[1] = 126;
      head.writeUInt16BE(n, 2);
    } else {
      head = Buffer.alloc(10);
      head[0] = 0x80 | op;
      head[1] = 127;
      head.writeBigUInt64BE(BigInt(n), 2);
    }
    this.socket.write(Buffer.concat([head, payload]));
  }

  close(code) {
    if (this.closed) return;
    const p = Buffer.alloc(2);
    p.writeUInt16BE(code, 0);
    this.frame(0x8, p);
    this.closed = true;
    this.socket.end();
    this.end();
  }

  /** The connection is over (closed by us, by the client, or broken): onClosed, once. */
  end() {
    this.closed = true;
    if (this.ended) return;
    this.ended = true;
    this.onClosed();
  }
}
