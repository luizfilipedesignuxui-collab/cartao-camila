# Cartão de Camila Ochoa

A primeira tela mostra o nome, a foto e o QR do cartão público. O QR é o foco. O único botão é Ir para o contato. Quem lê o QR e toca em Ver o restante do cartão cai na identidade, não na entrada. Na identidade, os fatos passam num bloco creme e o botão é Contato. Voltar para a primeira tela fica só no contato.

Na sessão de contato: **Salvar contato** gera um arquivo `.vcf` com os dados reais, **Compartilhar** usa o compartilhamento nativo ou copia o link, e **Baixar QR Code** guarda a primeira tela na galeria.

O cartão segue WCAG 2.2 AA: contraste, teclado, foco visível, alvos de toque e leitores de tela. Escape volta à entrada. No carrossel, as setas passam as informações.

## Rodar

```bash
npm install
npm run dev
```

A entrega do cartão fica em `http://127.0.0.1:5173/entrega`. O cartão público abre em `/` e em `/camila-ochoa`.

Verificações:

```bash
npm test
npm run lint
npm run build
```

Para publicar, defina `VITE_CARD_PUBLIC_URL` com o endereço `https://` final e rode `npm run build`. Sem esse endereço, o QR usa o domínio atual e não deve ser impresso se ainda for localhost.

## Replicar para outra pessoa

O visual está fechado. Novos cartões, landings e sites devem ficar idênticos a este.

- Playbook (cartão, landing e site): `docs/REPLICAR.md`
- Folha em branco: `docs/CAMPOS.md`
- Campos no código: `src/config/business-card.template.ts`
- Figma: https://www.figma.com/design/fbFtbk04wUuV7CpT2zI6JJ

## Trocar os dados

Tudo que é pessoal fica em `src/config/business-card.ts`.

Já preenchidos:

- LinkedIn: https://www.linkedin.com/in/camilaochoa/
- WhatsApp `+55 11 93098-8181`
- E-mail `ochocamila.psi@gmail.com`
- Foto e capa do LinkedIn em `public/camila-foto.jpg` e `public/camila-capa.jpg`
- Especialidades, princípios, Lab Yes! e formação do perfil público

O QR da entrada abre a URL pública do cartão (`VITE_CARD_PUBLIC_URL` ou `publicUrl`). O LinkedIn continua só como ação de contato.

Paleta da marca: teal `#1A8C8D`, laranja `#F05E23`, preto `#000000`, branco `#FFFFFF`. Logo em `public/logo-camila-ochoa.png`.

## O que ainda falta para publicar

- Domínio final e `publicUrl`
- Portfólio, site e link de agendamento, se existirem
- PDF do currículo
- Imagem de pré-visualização em `public/og.png` (1200×630), se quiser a miniatura nas redes
