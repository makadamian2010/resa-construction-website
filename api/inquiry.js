const INQUIRY_RECIPIENT = 'mousavimh@yahoo.com';
const ALLOWED_ORIGINS = new Set([
  'https://www.resaconstruction.online',
  'https://resaconstruction.online',
  'http://127.0.0.1:3000',
  'http://localhost:3000'
]);

function setCors(request, response) {
  const origin = request.headers?.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'object' && !Buffer.isBuffer(body)) return body;
  return JSON.parse(Buffer.isBuffer(body) ? body.toString('utf8') : body);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function normalizeUsPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return String(value || '').trim();
}

module.exports = async function inquiry(request, response) {
  setCors(request, response);

  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS');
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const data = parseBody(request.body);
    const requiredFields = ['name', 'phone', 'email', 'location', 'service', 'description', 'contactMethod'];
    const missingField = requiredFields.some(field => typeof data[field] !== 'string' || !data[field].trim());

    if (missingField) {
      sendJson(response, 400, { error: 'Please complete all required fields.' });
      return;
    }

    const clean = Object.fromEntries(requiredFields.map(field => [field, data[field].trim()]));
    if (!/^\S+@\S+\.\S+$/.test(clean.email)) {
      sendJson(response, 400, { error: 'Please enter a valid email address.' });
      return;
    }

    if (clean.description.length > 5000 || Object.values(clean).some(value => value.length > 6000)) {
      sendJson(response, 413, { error: 'The inquiry is too long. Please shorten it and try again.' });
      return;
    }

    const requiredEnvironment = [
      'RESEND_API_KEY',
      'RESEND_FROM_EMAIL',
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'TWILIO_FROM_NUMBER',
      'INQUIRY_SMS_TO'
    ];
    const missingEnvironment = requiredEnvironment.filter(name => !process.env[name]);
    if (missingEnvironment.length) {
      console.error('RESA inquiry notifications are not configured:', missingEnvironment.join(', '));
      sendJson(response, 503, { error: 'Inquiry delivery is temporarily unavailable. Please call 669-649-0932.' });
      return;
    }

    const value = key => escapeHtml(clean[key]).replace(/\n/g, '<br>');
    const smsBody = [
      'New RESA website inquiry',
      `Name: ${clean.name}`,
      `Phone: ${clean.phone}`,
      `Email: ${clean.email}`,
      `Project: ${clean.service}`,
      `Message: ${clean.description.slice(0, 700)}`
    ].join('\n');
    const twilioBody = new URLSearchParams({
      To: normalizeUsPhone(process.env.INQUIRY_SMS_TO),
      From: normalizeUsPhone(process.env.TWILIO_FROM_NUMBER),
      Body: smsBody
    });
    const twilioCredentials = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');

    const [emailResponse, smsResponse] = await Promise.all([
      fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [INQUIRY_RECIPIENT],
        reply_to: clean.email,
        subject: 'New RESA Construction Website Inquiry',
        text: `New customer request received from RESA Construction website.\n\nCustomer Name: ${clean.name}\nPhone: ${clean.phone}\nEmail: ${clean.email}\nProject Location: ${clean.location}\nService Requested: ${clean.service}\nProject Description: ${clean.description}\nPreferred Contact Method: ${clean.contactMethod}`,
        html: `<p>New customer request received from RESA Construction website.</p><p><b>Customer Name:</b><br>${value('name')}</p><p><b>Phone:</b><br>${value('phone')}</p><p><b>Email:</b><br>${value('email')}</p><p><b>Project Location:</b><br>${value('location')}</p><p><b>Service Requested:</b><br>${value('service')}</p><p><b>Project Description:</b><br>${value('description')}</p><p><b>Preferred Contact Method:</b><br>${value('contactMethod')}</p>`
      })
      }),
      fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(process.env.TWILIO_ACCOUNT_SID)}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${twilioCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: twilioBody.toString()
      })
    ]);

    if (!emailResponse.ok) {
      console.error('Resend inquiry delivery failed:', emailResponse.status, await emailResponse.text());
      sendJson(response, 502, { error: 'We could not send your request. Please try again or call 669-649-0932.' });
      return;
    }

    if (!smsResponse.ok) {
      console.error('Twilio inquiry notification failed:', smsResponse.status, await smsResponse.text());
      sendJson(response, 502, { error: 'We received your inquiry, but could not complete the notification. Please call 669-649-0932.' });
      return;
    }

    const delivery = await emailResponse.json().catch(() => ({}));
    const smsDelivery = await smsResponse.json().catch(() => ({}));
    sendJson(response, 200, { ok: true, emailId: delivery.id || null, smsSid: smsDelivery.sid || null });
  } catch (error) {
    console.error('Inquiry function error:', error.message);
    sendJson(response, 400, { error: 'We could not process your request. Please check the form and try again.' });
  }
};
