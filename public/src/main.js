import { React, ReactDOM, html } from './lib/deps.js';
import { App } from './App.js';

const mount = document.getElementById('root');
const root = ReactDOM.createRoot(mount);
root.render(html`<${React.StrictMode}><${App} /><//>`);

function addWorkGallery() {
  const cta = document.querySelector('.cta');
  if (!cta || document.getElementById('our-work')) return;
  const gallery = document.createElement('section');
  gallery.className = 'client-gallery';
  gallery.id = 'our-work';
  gallery.setAttribute('aria-labelledby', 'our-work-heading');
  gallery.innerHTML = `
    <div class="client-gallery__head">
      <div><p class="client-gallery__kicker">RECENT PROJECT WORK</p><h2 id="our-work-heading">Our Work</h2></div>
      <p class="client-gallery__intro">A selection of hands-on residential construction and electrical work completed for homeowners.</p>
    </div>
    <div class="client-gallery__grid">
      <figure>
        <img src="/assets/projects/custom-pergola.png" alt="Finished wooden backyard pergola over a stone patio, with open slats casting shade" loading="lazy">
        <figcaption>Custom backyard pergola<span>Residential outdoor construction</span></figcaption>
      </figure>
      <figure>
        <img src="/assets/projects/electrical-panel.png" alt="Open residential electrical service panel with breakers and conduit visible" loading="lazy">
        <figcaption>Residential electrical panel work<span>Electrical service and safety improvements</span></figcaption>
      </figure>
    </div>`;
  cta.before(gallery);
  const navigation = document.querySelector('.main-nav');
  const footerLinks = document.querySelector('.footer-links');
  const makeLink = () => { const link = document.createElement('a'); link.href = '#our-work'; link.textContent = 'Our Work'; return link; };
  navigation?.append(makeLink());
  footerLinks?.append(makeLink());
}

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
  addWorkGallery();
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
  if ((document.getElementById('our-work') && document.querySelector('.form-consent')) || enhancementAttempts === 20) clearInterval(enhancementRetry);
}, 50);
