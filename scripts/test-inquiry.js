const assert = require('node:assert/strict');
const inquiry = require('../api/inquiry.js');

function responseMock() {
  return {
    headers: {},
    statusCode: 200,
    body: '',
    setHeader(name, value) { this.headers[name] = value; },
    end(body = '') { this.body = body; }
  };
}

async function call(method, body, origin = 'https://www.resaconstruction.online') {
  const response = responseMock();
  await inquiry({ method, body, headers: { origin } }, response);
  return { ...response, json: response.body ? JSON.parse(response.body) : null };
}

(async () => {
  let response = await call('GET');
  assert.equal(response.statusCode, 405);

  response = await call('OPTIONS');
  assert.equal(response.statusCode, 204);
  assert.equal(response.headers['Access-Control-Allow-Origin'], 'https://www.resaconstruction.online');

  response = await call('POST', {});
  assert.equal(response.statusCode, 400);

  process.env.RESEND_API_KEY = 'test-key';
  process.env.RESEND_FROM_EMAIL = 'RESA Construction <estimates@resaconstruction.online>';
  process.env.TWILIO_ACCOUNT_SID = 'AC00000000000000000000000000000000';
  process.env.TWILIO_AUTH_TOKEN = 'test-auth-token';
  process.env.TWILIO_FROM_NUMBER = '+14085550100';
  process.env.INQUIRY_SMS_TO = '6696490932';
  const originalFetch = global.fetch;
  const outboundRequests = [];
  global.fetch = async (url, options) => {
    outboundRequests.push({ url, options });
    if (url.includes('resend.com')) return { ok: true, json: async () => ({ id: 'test-email-id' }) };
    return { ok: true, json: async () => ({ sid: 'SM-test-message-id' }) };
  };

  response = await call('POST', {
    name: 'Test Customer',
    phone: '669-555-0100',
    email: 'customer@example.com',
    location: 'Full project address',
    service: 'Home Addition',
    description: 'Test submission for the isolated API handler.',
    contactMethod: 'Email'
  });

  global.fetch = originalFetch;
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM_EMAIL;
  delete process.env.TWILIO_ACCOUNT_SID;
  delete process.env.TWILIO_AUTH_TOKEN;
  delete process.env.TWILIO_FROM_NUMBER;
  delete process.env.INQUIRY_SMS_TO;

  assert.equal(response.statusCode, 200);
  assert.equal(response.json.ok, true);
  assert.equal(outboundRequests.length, 2);
  const resendRequest = outboundRequests.find(request => request.url.includes('resend.com'));
  const resendPayload = JSON.parse(resendRequest.options.body);
  assert.equal(resendRequest.url, 'https://api.resend.com/emails');
  assert.deepEqual(resendPayload.to, ['mousavimh@yahoo.com']);
  assert.equal(resendPayload.reply_to, 'customer@example.com');
  assert.equal(resendPayload.subject, 'New RESA Construction Website Inquiry');
  const twilioRequest = outboundRequests.find(request => request.url.includes('twilio.com'));
  const twilioPayload = new URLSearchParams(twilioRequest.options.body);
  assert.equal(twilioPayload.get('To'), '+16696490932');
  assert.equal(twilioPayload.get('From'), '+14085550100');
  assert.match(twilioPayload.get('Body'), /Test Customer/);
  assert.match(twilioPayload.get('Body'), /669-555-0100/);
  assert.match(twilioPayload.get('Body'), /customer@example.com/);
  assert.match(twilioPayload.get('Body'), /Home Addition/);
  console.log('Inquiry API tests passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
