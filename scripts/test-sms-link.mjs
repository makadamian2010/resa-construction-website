import assert from 'node:assert/strict';
import { buildInquiryMessage, buildSmsLink } from '../public/src/sms.js';

const inquiry = {
  name: 'Taylor Smith',
  phone: '(408) 555-0123',
  email: 'taylor@example.com',
  service: 'Home Addition',
  description: 'Please provide an estimate & timeline.'
};

const expectedMessage = 'New RESA Construction Inquiry\n\nName: Taylor Smith\nPhone: (408) 555-0123\nEmail: taylor@example.com\nProject Type: Home Addition\nMessage: Please provide an estimate & timeline.';
assert.equal(buildInquiryMessage(inquiry), expectedMessage);

const iphone = buildSmsLink(inquiry, { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', platform: 'iPhone' });
assert.ok(iphone.startsWith('sms:+16696490932&body='));
assert.equal(decodeURIComponent(iphone.split('&body=')[1]), expectedMessage);

const ipad = buildSmsLink(inquiry, { userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 5 });
assert.ok(ipad.startsWith('sms:+16696490932&body='));

const android = buildSmsLink(inquiry, { userAgent: 'Mozilla/5.0 (Linux; Android 15)', platform: 'Linux armv8l' });
assert.ok(android.startsWith('sms:+16696490932?body='));
assert.equal(decodeURIComponent(android.split('?body=')[1]), expectedMessage);
assert.ok(android.includes('%26'));

console.log('SMS link tests passed for iPhone, iPadOS, and Android.');
