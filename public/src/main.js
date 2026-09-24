import { React, ReactDOM, html } from './lib/deps.js';
import { App } from './App.js';

const mount = document.getElementById('root');
const root = ReactDOM.createRoot(mount);
root.render(html`<${React.StrictMode}><${App} /><//>`);

function addConsentCheckbox() {
  const form = document.querySelector('.estimate-form');
  const submit = form?.querySelector('.submit');
  if (!form || !submit || form.querySelector('.form-consent')) return;
  const consent = document.createElement('label');
  consent.className = 'form-consent';
  consent.innerHTML = '<input type="checkbox" name="termsConsent" required> <span>I agree to RESA Construction’s Terms of Service and Privacy Policy.</span>';
  submit.before(consent);
  form.addEventListener('submit', event => {
    const checkbox = form.querySelector('input[name="termsConsent"]');
    if (!checkbox?.checked) {
      event.preventDefault();
      event.stopImmediatePropagation();
      checkbox.setCustomValidity('Please agree to the Terms of Service and Privacy Policy before submitting.');
      checkbox.reportValidity();
    } else checkbox.setCustomValidity('');
  }, true);
}

function applyEnhancements() {
  addConsentCheckbox();
  const successText = document.querySelector('.form-success p');
  if (successText) successText.textContent = 'Thank you! Your request has been submitted successfully. RESA Construction will contact you soon.';
}

new MutationObserver(applyEnhancements).observe(mount, { childList: true, subtree: true });
applyEnhancements();

let enhancementAttempts = 0;
const enhancementRetry = setInterval(() => {
  applyEnhancements();
  enhancementAttempts += 1;
  if (document.querySelector('.form-consent') || enhancementAttempts === 20) clearInterval(enhancementRetry);
}, 50);
