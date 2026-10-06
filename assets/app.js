(() => {
  'use strict';

  const config = window.RHM_CONFIG || {};
  const whatsapp = String(config.whatsapp || '').replace(/\D/g, '');
  const validWhatsApp = /^\d{10,15}$/.test(whatsapp);
  const greeting = 'Olá! Vim pelo site da RHM Advogados e gostaria de falar com a equipe sobre uma possível assessoria jurídica.';
  const makeWhatsAppUrl = (message) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('[data-form-cta]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = link.dataset.formTarget || '#contato';
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-whatsapp-cta]').forEach((link) => {
    if (!validWhatsApp) return;
    link.href = makeWhatsAppUrl(greeting);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  document.querySelectorAll('[data-service-card]').forEach((card) => {
    const open = () => window.openModal?.(card.dataset.serviceCard);
    card.addEventListener('click', (event) => {
      if (!event.target.closest('button')) open();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!validWhatsApp) {
      status.hidden = false;
      status.textContent = 'O atendimento por WhatsApp ainda não está disponível.';
      return;
    }

    const details = [];
    for (const [name, value] of new FormData(form).entries()) {
      if (value) details.push(`${name}: ${value}`);
    }
    const message = [greeting, '', 'Dados informados:', ...details].join('\n');
    status.hidden = false;
    status.textContent = 'Uma nova aba do WhatsApp foi aberta para você confirmar o envio.';
    window.open(makeWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  });
})();
