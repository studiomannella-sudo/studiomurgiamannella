const subentroForm = document.querySelector('.subentro-form');

subentroForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = subentroForm.querySelector('button[type="submit"]');
  const error = subentroForm.querySelector('.subentro-error');
  button.disabled = true;
  error.hidden = true;

  try {
    const response = await fetch(subentroForm.action, {
      method: 'POST',
      body: new URLSearchParams(new FormData(subentroForm)),
      signal: AbortSignal.timeout(15000),
    });
    const confirmation = await response.text();
    if (!response.ok || !confirmation.includes('id="subentro-conferma"')) {
      throw new Error('Conferma di ricezione mancante');
    }
    location.assign(response.url);
  } catch {
    error.hidden = false;
    button.disabled = false;
  }
});

window.addEventListener('pageshow', event => {
  if (event.persisted && subentroForm) {
    subentroForm.querySelector('button[type="submit"]').disabled = false;
  }
});
