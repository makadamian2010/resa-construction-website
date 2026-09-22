import { React, ReactDOM, html } from './lib/deps.js';
import { App } from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(html`<${React.StrictMode}><${App} /><//>`);

const confirmation = 'Thank you! Your request has been submitted successfully. RESA Construction will contact you soon.';
new MutationObserver(() => {
  const successText = document.querySelector('.form-success p');
  if (successText) successText.textContent = confirmation;
}).observe(document.getElementById('root'), { childList: true, subtree: true });
