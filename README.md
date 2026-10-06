# RHM Advogados — Site Oficial Completo

**Site:** GitHub Pages do repositório (quando habilitado).  
**Repositório:** [NextSharpLtda/RHM_Advogados](https://github.com/NextSharpLtda/RHM_Advogados)

Site estático em HTML, CSS e JavaScript, baseado na tela **RHM Advogados - Versão Sessão 44 com Seções Intercaladas** do projeto **RHM ADVOGADOS**, no Stitch.

Projeto de origem: `13606967095748532257`  
Tela de origem: `4ba24fd45dc84f9fa2bcdbc0ee1db79b`

As fotos, a marca, a tipografia, as cores, os textos e a ordem das seções foram preservados. Foram adicionados menu móvel, navegação por âncoras, diálogos para as áreas de atuação, formulário de acidentes e empacotamento para o GitHub Pages. Não há dependência do MCP ou de uma chave de API para executar ou hospedar o site.

## Visualizar

Abra `index.html` diretamente no navegador. As imagens, as fontes e o CSS compilado já estão na pasta `assets`.

Para usar um servidor local, com Node.js 22 ou superior:

```sh
npm ci
npm run dev
```

Abra o endereço mostrado no terminal, normalmente `http://127.0.0.1:4173`. Se a porta estiver ocupada, defina a variável `PORT` antes de iniciar.

## Publicar no GitHub Pages

1. Crie um repositório no seu GitHub, com a branch principal chamada `main`.
2. Envie os arquivos desta pasta, incluindo `.github/workflows/pages.yml`. Não envie `node_modules`, `.stitch` ou `dist`; eles estão no `.gitignore`.
3. No repositório, abra **Settings → Pages → Build and deployment → Source** e selecione **GitHub Actions**.
4. Faça um push para `main` ou, em **Actions**, execute **Publicar no GitHub Pages → Run workflow**.
5. Aguarde a publicação. O endereço ficará disponível em **Settings → Pages** e na execução do workflow.

O workflow instala as dependências, compila o CSS, verifica os arquivos e publica somente `dist/`. Os caminhos relativos funcionam tanto em `usuario.github.io` quanto em `usuario.github.io/nome-do-repositorio/`. O workflow define automaticamente a URL pública nas tags de compartilhamento e na URL canônica.

Referência: [GitHub — configuração da origem de publicação](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Editar

| Arquivo | Finalidade |
| --- | --- |
| `index.html` | Textos, seções, imagens e dados exibidos |
| `tailwind.config.cjs` | Cores, fontes, espaçamentos e tipografia exportados do Stitch |
| `src/styles.css` | Ajustes de responsividade, acessibilidade e componentes interativos |
| `assets/app.js` | Menu, diálogos e comportamento do formulário |
| `assets/site-config.js` | Destino do WhatsApp e e-mails opcionais |
| `assets/` | Imagens, fontes, licenças e CSS compilado |
| `.github/workflows/pages.yml` | Publicação automática |

Após editar o HTML, as classes Tailwind ou o CSS:

```sh
npm run build
npm run check
```

O CSS compilado em `assets/styles.css` deve ser incluído no próximo commit para manter a abertura direta de `index.html` funcionando. Para visualizar a pasta publicada, execute `npm run preview`.

## Contatos e formulário

Os botões “Entrar em contato” e o formulário encaminham para o WhatsApp do escritório com uma mensagem pronta. Os links de e-mail continuam sem destinatário enquanto a configuração estiver vazia.

O formulário inclui os campos relativos a acidentes e abre o WhatsApp com os dados preenchidos. O site não armazena esses dados. A seleção de conteúdos abre um aviso de disponibilidade futura, pois a tela exportada não possui artigos.

Para trocar o destino de contato, edite `assets/site-config.js`:

- `whatsapp`: telefone com código do país e DDD, usando somente números.
- `email`: destinatário do escritório.
- `partnerEmails`: e-mails individuais dos sócios.

Com um destino válido, o formulário prepara a mensagem no WhatsApp (prioridade) ou no aplicativo de e-mail. O visitante confirma o envio no aplicativo. Não há backend nem serviço de envio automático. Atualize também os textos de contato no `index.html`, se necessário. Essas configurações são públicas: não coloque senhas ou chaves de API nesse arquivo.

## Arquivos de origem e licenças

Os arquivos temporários de referência do Stitch ficam em `.stitch/` e não entram no Git nem na publicação. As dez imagens foram exportadas da tela fornecida pelo usuário; os direitos dessas imagens e da marca permanecem com seus respectivos titulares. Não foram usadas fotos do projeto incorreto.

As fontes Hanken Grotesk e Libre Caslon Text são distribuídas sob SIL Open Font License. Os ícones Material Symbols usam a licença fornecida pelo repositório Google Material Design Icons. Os textos de licença estão em `assets/fonts/`.

## Publicar em outra hospedagem estática

Execute `npm run build` e envie o conteúdo de `dist/` à hospedagem. Para gerar metadados com a URL final, configure `SITE_URL` durante o build. O site não exige servidor Node.js em produção.
