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
  const originalFetch = global.fetch;
  let resendRequest;
  global.fetch = async (url, options) => {
    resendRequest = { url, options, payload: JSON.parse(options.body) };
    return { ok: true, json: async () => ({ id: 'test-email-id' }) };
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

  assert.equal(response.statusCode, 200);
  assert.equal(response.json.ok, true);
  assert.equal(resendRequest.url, 'https://api.resend.com/emails');
  assert.deepEqual(resendRequest.payload.to, ['mousavimh@yahoo.com']);
  assert.equal(resendRequest.payload.reply_to, 'customer@example.com');
  assert.equal(resendRequest.payload.subject, 'New RESA Construction Website Inquiry');
  console.log('Inquiry API tests passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
