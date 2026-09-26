export const RESA_SMS_NUMBER = '+16696490932';

export function buildInquiryMessage({ name, phone, email, service, description }) {
  return [
    'New RESA Construction Inquiry',
    '',
    `Name: ${name.trim()}`,
    `Phone: ${phone.trim()}`,
    `Email: ${email.trim()}`,
    `Project Type: ${service.trim()}`,
    `Message: ${description.trim()}`
  ].join('\n');
}

export function buildSmsLink(values, device = {}) {
  const userAgent = device.userAgent || '';
  const platform = device.platform || '';
  const maxTouchPoints = device.maxTouchPoints || 0;
  const isAppleMobile = /iPad|iPhone|iPod/i.test(userAgent)
    || (platform === 'MacIntel' && maxTouchPoints > 1);
  const separator = isAppleMobile ? '&' : '?';
  return `sms:${RESA_SMS_NUMBER}${separator}body=${encodeURIComponent(buildInquiryMessage(values))}`;
}
