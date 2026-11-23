(() => {
  const form = document.querySelector('.subentro-form');
  if (!form) return;

  const sendButton = form.querySelector('button[type="submit"]');
  const emailLink = form.querySelector('.subentro-email');
  const emailNote = form.querySelector('.subentro-email-note');
  const error = form.querySelector('.subentro-error');
  // Netlify strips this attribute from deployed HTML when it registers a form.
  const directSubmission = !form.hasAttribute('data-netlify');

  function prepareEmail() {
    const fields = new FormData(form);
    const body = [
      'Buongiorno, vorrei un preventivo per la mia attività.',
      '',
      'Tipo di attività: ' + fields.get('attivita'),
      'Servizio richiesto: ' + fields.get('servizio'),
      'Recapito: ' + fields.get('recapito').trim(),
      'Scadenze o dettagli: ' + (fields.get('dettagli').trim() || 'Nessuno'),
    ].join('\r\n');
    return emailLink.href.split('&body=')[0] + '&body=' + encodeURIComponent(body);
  }

  emailLink.addEventListener('click', event => {
    if (!form.reportValidity() || !form.elements.recapito.value.trim()) {
      event.preventDefault();
      form.elements.recapito.value = form.elements.recapito.value.trim();
      form.reportValidity();
      return;
    }
    emailLink.href = prepareEmail();
  });

  if (directSubmission) {
    sendButton.hidden = false;
    emailLink.hidden = true;
    emailNote.hidden = true;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    form.elements.recapito.value = form.elements.recapito.value.trim();
    if (!form.reportValidity()) return;
    if (!directSubmission) {
      location.href = prepareEmail();
      return;
    }

    sendButton.disabled = true;
    error.hidden = true;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form)),
        signal: AbortSignal.timeout(15000),
      });
      const confirmation = await response.text();
      if (!response.ok || !confirmation.includes('id="subentro-conferma"')) {
        throw new Error('Conferma di ricezione mancante');
      }
      location.assign(response.url);
    } catch {
      error.hidden = false;
      emailLink.hidden = false;
      emailNote.hidden = false;
      sendButton.disabled = false;
    }
  });

  window.addEventListener('pageshow', event => {
    if (event.persisted) sendButton.disabled = false;
  });
})();
