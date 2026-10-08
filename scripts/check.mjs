import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs duplicados');
for (const [, attribute, value] of html.matchAll(/\b(src|href)="([^"]+)"/g)) {
  if (value.startsWith('#')) assert(ids.includes(value.slice(1)), `Âncora inexistente: ${value}`);
  if (value.startsWith('./')) await access(path.join(root, value));
  if (attribute === 'src' && value.startsWith('http')) {
    assert(
      value.startsWith('https://lh3.googleusercontent.com/') || value.startsWith('https://www.googletagmanager.com/'),
      `Imagem remota não permitida: ${value}`,
    );
  }
}
assert(!html.includes('cdn.tailwindcss.com'), 'Tailwind de desenvolvimento presente');
assert(!html.includes('fonts.googleapis.com'), 'Fonte externa desnecessária presente');
assert(!html.includes('AQ.Ab'), 'Credencial não deve estar no site');
assert(html.includes('id="contact-form"'), 'Formulário ausente');
assert(!html.includes('data-acidente') && !html.includes('Houve feridos') && !html.includes('Veículos envolvidos'), 'Campos de acidente não devem constar na tela do Stitch');
assert(html.includes('Descreva seu caso ou problema (opcional)') && html.includes('Conte brevemente sobre sua situação ou dúvida jurídica...'), 'Texto do formulário do Stitch ausente');
assert.equal((html.match(/data-service-card/g) || []).length, 8, 'Os cards restantes devem abrir o modal inteiro');
assert(html.includes('href="acidentes-transito.html"'), 'Card de acidentes de trânsito deve direcionar à página dedicada');
await access(path.join(root, 'acidentes-transito.html'));
assert((html.match(/data-form-cta/g) || []).length >= 6, 'CTAs devem levar ao formulário');
assert(html.includes('id="lgpd-consent"') && html.includes('privacidade.html'), 'Consentimento LGPD ausente');
await access(path.join(root, 'privacidade.html'));
const contactConfig = await readFile(path.join(root, 'assets/site-config.js'), 'utf8');
const appScript = await readFile(path.join(root, 'assets/app.js'), 'utf8');
assert(contactConfig.includes("whatsapp: '5541992031547'"), 'Número de WhatsApp ausente');
assert(appScript.includes("window.open(makeWhatsAppUrl(message), '_blank'"), 'Envio em nova aba ausente');
assert(appScript.includes("trackOnce('filtro_concluido')"), 'Evento de conclusão do filtro ausente');
assert(appScript.includes("trackOnce('whatsapp_pos_filtro')"), 'Evento de acesso ao WhatsApp ausente');
assert(appScript.indexOf("trackOnce('filtro_concluido')") < appScript.indexOf("trackOnce('whatsapp_pos_filtro')"), 'Eventos fora da sequência esperada');
assert(appScript.indexOf("trackOnce('whatsapp_pos_filtro')") < appScript.indexOf('window.open(makeWhatsAppUrl(message)'), 'Evento do WhatsApp deve ocorrer antes da navegação');

let submitHandler;
let formIsValid = false;
const openedUrls = [];
const status = { hidden: true, textContent: '' };
const form = {
  addEventListener: (eventName, handler) => {
    if (eventName === 'submit') submitHandler = handler;
  },
  reportValidity: () => formIsValid,
};
const browserWindow = {
  RHM_CONFIG: { whatsapp: '5541992031547' },
  open: (...args) => openedUrls.push(args),
};
vm.runInNewContext(appScript, {
  window: browserWindow,
  document: {
    querySelector: (selector) => ({ '#contact-form': form, '#contact-status': status })[selector] || null,
    querySelectorAll: () => [],
  },
  FormData: class {
    entries() { return [['Nome', 'Teste GTM']][Symbol.iterator](); }
  },
  Set,
  encodeURIComponent,
});
assert.equal(typeof submitHandler, 'function', 'Handler de envio do formulário ausente');
const submit = () => submitHandler({ preventDefault() {} });
submit();
assert.deepEqual(browserWindow.dataLayer, undefined, 'Formulário incompleto não deve gerar eventos');
assert.equal(openedUrls.length, 0, 'Formulário incompleto não deve abrir o WhatsApp');
formIsValid = true;
submit();
assert.equal(JSON.stringify(browserWindow.dataLayer.map(({ event }) => event)), JSON.stringify(['filtro_concluido', 'whatsapp_pos_filtro']), 'Eventos de conversão incorretos');
assert.equal(openedUrls.length, 1, 'Envio válido deve abrir o WhatsApp uma vez');
submit();
assert.equal(JSON.stringify(browserWindow.dataLayer.map(({ event }) => event)), JSON.stringify(['filtro_concluido', 'whatsapp_pos_filtro']), 'Eventos de conversão não devem duplicar');
const built = await readFile(path.join(root, 'dist/index.html'), 'utf8');
assert(built.includes('RHM Advogados') && built.includes('contact-form'), 'Build incompleto');
await access(path.join(root, 'dist', 'privacidade.html'));
const builtTrafficPage = await readFile(path.join(root, 'dist/acidentes-transito.html'), 'utf8');
assert(builtTrafficPage.includes('Seguro e negativa de cobertura') && builtTrafficPage.includes('Indenizações após um acidente') && builtTrafficPage.includes('O que fazer depois de um acidente?') && !builtTrafficPage.includes('id="video-seguro"'), 'Página de acidentes de trânsito incompleta');
assert((builtTrafficPage.match(/data-form-cta/g) || []).length >= 7 && !builtTrafficPage.includes('data-whatsapp-cta'), 'CTAs da página de acidentes devem levar ao formulário');
console.log(`OK: ${ids.length} IDs, design Stitch, formulário e WhatsApp verificados.`);
