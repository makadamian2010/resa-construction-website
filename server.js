const http = require('http');
const fs = require('fs');
const path = require('path');

// Load local secrets for development. In production, configure these same
// values in the host's encrypted environment-variable settings.
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_DIR = path.join(__dirname, 'public');
const INQUIRY_RECIPIENT = 'mousavimh@yahoo.com';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function sendFile(filePath, response) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        sendFile(path.join(PUBLIC_DIR, 'index.html'), response);
        return;
      }
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Unable to load RESA Construction.');
      return;
    }
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=3600'
    });
    response.end(data);
  });
}

function json(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
    if (Buffer.concat(chunks).length > 100_000) throw new Error('Request too large.');
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function handleInquiry(request, response) {
  try {
    const data = await readJson(request);
    const fields = ['name', 'phone', 'email', 'location', 'service', 'description', 'contactMethod'];
    if (!fields.every(field => typeof data[field] === 'string' && data[field].trim())) return json(response, 400, { error: 'Please complete all required fields.' });
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) return json(response, 400, { error: 'Please enter a valid email address.' });
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      console.error('Inquiry email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.');
      return json(response, 503, { error: 'We’re unable to submit your request right now. Please try again shortly or call 669-649-0932.' });
    }
    const value = key => escapeHtml(data[key].trim()).replace(/\n/g, '<br>');
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [INQUIRY_RECIPIENT], reply_to: data.email.trim(), subject: 'New RESA Construction Website Inquiry', text: `New customer inquiry received from the website.\n\nCustomer Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nProject Location: ${data.location}\nService Requested: ${data.service}\nProject Description: ${data.description}\nPreferred Contact Method: ${data.contactMethod}`, html: `<p>New customer inquiry received from the website.</p><p><b>Customer Name:</b><br>${value('name')}</p><p><b>Phone:</b><br>${value('phone')}</p><p><b>Email:</b><br>${value('email')}</p><p><b>Project Location:</b><br>${value('location')}</p><p><b>Service Requested:</b><br>${value('service')}</p><p><b>Project Description:</b><br>${value('description')}</p><p><b>Preferred Contact Method:</b><br>${value('contactMethod')}</p>` })
    });
    if (!emailResponse.ok) { console.error('Resend failed:', await emailResponse.text()); return json(response, 502, { error: 'We could not send your request. Please call us at 669-649-0932.' }); }
    return json(response, 200, { ok: true });
  } catch (error) { console.error('Inquiry error:', error.message); return json(response, 400, { error: 'We could not process your request. Please try again.' }); }
}

const server = http.createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/api/inquiry') { handleInquiry(request, response); return; }
  const urlPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const normalized = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, normalized === '/' ? 'index.html' : normalized);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }
  sendFile(filePath, response);
});

server.listen(PORT, HOST, () => {
  console.log(`RESA Construction running at http://${HOST}:${PORT}`);
});
