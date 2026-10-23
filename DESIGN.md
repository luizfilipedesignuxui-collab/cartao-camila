---
version: alpha
name: Cartão Camila Ochoa
description: Cartão digital, landing e site da Camila Ochoa. Mesmos tokens. O cartão revela identidade e contato. A landing vende. O site é a presença de RH, sem copiar o LinkedIn.
colors:
  bg: "#1A8C8D"
  surface: "#FFFFFF"
  surface-raised: "#FFFFFF"
  media: "#1A8C8D"
  ink: "#000000"
  cream: "#FFFFFF"
  muted: "#000000"
  link: "#1A8C8D"
  accent: "#F05E23"
  accent-ink: "#000000"
  line: "#000000"
  qr-paper: "#FFFFFF"
  qr-ink: "#000000"
  focus: "#FFFFFF"
  brand-linkedin: "#0A66C2"
  brand-whatsapp: "#25D366"
typography:
  display:
    fontFamily: Inter
    fontSize: 4.8rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.045em
  h2:
    fontFamily: Inter
    fontSize: 1.35rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.3
  body-md:
    fontFamily: Inter
    fontSize: 0.95rem
    fontWeight: 400
    lineHeight: 1.45
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.3
rounded:
  sm: 14px
  md: 22px
  lg: 32px
  xl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 20px
  xl: 28px
  xxl: 36px
components:
  card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  button-primary:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: 16px
  button-on-cream:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
    padding: 16px
  button-outline:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
    padding: 16px
  button-action:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-icon:
    backgroundColor: "{colors.media}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
  button-channel:
    backgroundColor: "{colors.brand-linkedin}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
  button-linkedin:
    backgroundColor: "{colors.brand-linkedin}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
  card-qr:
    backgroundColor: "{colors.qr-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  photo-slot:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
  glass:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
---

# Cartão Camila Ochoa

## Overview

Três superfícies, um visual: cartão digital, landing e site. Paleta da marca: teal `#1A8C8D`, laranja `#F05E23`, preto `#000000` e branco `#FFFFFF`. O fundo do cartão é o teal. Nome, cargo e rótulos vão em branco. QR, fatos, contato e LinkedIn ficam em blocos brancos com texto preto. Logo branca no teal.

Este arquivo é a fonte visual de qualquer clone. Para outro usuário, troque só a ficha. Kit no Figma: https://www.figma.com/design/fbFtbk04wUuV7CpT2zI6JJ. Playbook da estrutura: `docs/REPLICAR.md`.

## Colors

- **bg / media:** teal `#1A8C8D`. Fundo de todas as telas do cartão.
- **cream:** branco. Texto sobre o teal, logo e botão principal.
- **ink:** preto. Texto dentro dos blocos brancos.
- **accent:** laranja `#F05E23`. Destaque da marca. Texto sobre laranja é preto.
- **qr-paper / qr-ink:** branco e preto, para leitura do código.

## Typography

Inter. Na entrada, a logo da marca ocupa o lugar do nome. O nome fica só no leitor de tela. Nas outras telas, o nome aparece em tamanho de leitura.

## Shapes

QR com raio de 32px. Ícones em círculo branco. Botão principal em cápsula branca sobre o teal. Fundo teal com o desenho botânico discreto. Informações em cartão branco. Logo branca da marca.

## Components

- **button-primary:** cápsula branca sobre o teal.
- **button-on-cream:** cápsula preta sobre o bloco branco.
- **button-outline:** cápsula secundária no teal, com borda branca e fundo branco translúcido. Usada em Voltar e nos botões do mesmo modelo.
- **button-channel:** bolinha com a marca do canal. O toque abre o bloco branco com o dado e o botão de ação.
- **button-linkedin:** cápsula azul do LinkedIn no convite.
- **card-qr:** placa branca compacta sobre o teal, com um movimento leve na entrada.
- **glass:** bloco branco das informações.
- **photo-slot:** foto do LinkedIn.

## Layout & spacing

Mobile first. Todas as telas do cartão no teal. Na entrada, o QR é o foco, com foto e código no meio do espaço livre. O único botão é a cápsula branca Ir para o contato, acima do rodapé. No desktop, o botão acompanha o bloco de conteúdo, sem descer até a base da janela. O fato atual fica num bloco branco abaixo da foto, com o texto completo visível. No contato, salvar, compartilhar e baixar QR ficam juntos do bloco de ícones, com folga acima de Voltar. Quem lê o QR cai em `/conectar`, no mesmo teal: foto, nome e um card branco com o essencial do LinkedIn. Ver o restante do cartão abre a identidade, não a entrada. Voltar para a primeira tela existe só no contato. Se o convite for mais alto que a tela, a página rola por dentro, sem travar o cursor.

## Accessibility

Camada WCAG 2.2 AA: texto branco grande sobre o teal; texto preto sobre os blocos brancos. Foco visível de 3px, alvos de toque com 44px, um título por tela, atalhos de teclado no carrossel, pausa de movimento e anúncio de status para leitor de tela. Laranja é cromo, não texto miúdo.

## Do / Don't

- **Do:** repetir o teal da entrada; QR como foco da primeira tela; um botão branco Ir para o contato; fatos no bloco branco, com o texto inteiro; deslize; Contato na identidade; Voltar só no contato, para a entrada; só dados reais; salvar número, compartilhar o link e guardar a primeira tela; manter o foco visível; usar o desenho botânico discreto; usar a logo da marca.
- **Don't:** capa de fundo; cortar palavras no bloco branco; frase Pausar informações; monograma CO sobre o nome; numerar etapas; inventar verde antigo; travessão no texto; texto miúdo cinza sobre o teal; Revelar identidade na entrada.
