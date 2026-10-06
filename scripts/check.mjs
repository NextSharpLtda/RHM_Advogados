import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs duplicados');
for (const [, attribute, value] of html.matchAll(/\b(src|href)="([^"]+)"/g)) {
  if (value.startsWith('#')) assert(ids.includes(value.slice(1)), `Âncora inexistente: ${value}`);
  if (value.startsWith('./')) await access(path.join(root, value));
  if (attribute === 'src' && value.startsWith('http')) assert(value.startsWith('https://lh3.googleusercontent.com/'), `Imagem remota não permitida: ${value}`);
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
const built = await readFile(path.join(root, 'dist/index.html'), 'utf8');
assert(built.includes('RHM Advogados') && built.includes('contact-form'), 'Build incompleto');
await access(path.join(root, 'dist', 'privacidade.html'));
const builtTrafficPage = await readFile(path.join(root, 'dist/acidentes-transito.html'), 'utf8');
assert(builtTrafficPage.includes('Seguro e negativa de cobertura') && builtTrafficPage.includes('Indenizações após um acidente') && builtTrafficPage.includes('O que fazer depois de um acidente?') && !builtTrafficPage.includes('id="video-seguro"'), 'Página de acidentes de trânsito incompleta');
assert((builtTrafficPage.match(/data-form-cta/g) || []).length >= 7 && !builtTrafficPage.includes('data-whatsapp-cta'), 'CTAs da página de acidentes devem levar ao formulário');
console.log(`OK: ${ids.length} IDs, design Stitch, formulário e WhatsApp verificados.`);
