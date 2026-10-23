# CLAUDE.md — Cartão digital da Camila Ochoa

Contexto para o Claude Code trabalhar neste projeto. Responder sempre em português do Brasil, de forma direta.

## O projeto
Cartão de visita digital (PWA) da Camila Ochoa. Primeira tela: nome, foto e QR do cartão público. Depois: identidade e contato (salvar .vcf, compartilhar, baixar QR).
- Produção: https://camila.luizfilipe-design.com.br (Vercel, projeto `cartao-camila`, time luizfilipedesignuxui-collab)
- Leia antes de mexer no visual: `DESIGN.md`. Campos editáveis: `docs/CAMPOS.md`. Como replicar para outro cliente: `docs/REPLICAR.md`.

## Stack
React + TypeScript + Vite, framer-motion, lucide-react, qrcode.react. Testes com Vitest. PWA via `public/manifest.webmanifest` e `public/sw.js`.

## Comandos
```bash
npm install        # dependências
npm run dev        # servidor local (Vite)
npm run build      # tsc -b && vite build -> dist/
npm run lint       # ESLint
npm test           # Vitest
npm run preview    # serve o build
```

## Estrutura
- `src/App.tsx` — composição das telas
- `src/components/` — componentes (BusinessCard, ActionButton, ConnectInvite...) e `reveal/` (animações de entrada)
- `src/config/business-card.ts` — dados do cartão (nome, contatos, links). Edite aqui para mudar conteúdo. `business-card.template.ts` é o modelo para novos clientes.
- `src/lib/` — utilitários (vCard, QR, compartilhamento etc.)
- `public/` — fotos, logos, ícones, manifest e service worker

## Regras
- Acessibilidade WCAG 2.2 AA é obrigatória: contraste, foco visível, navegação por teclado, textos alternativos, respeitar `prefers-reduced-motion`.
- Mobile first. Testar em 360px de largura.
- Não versionar `.env`, `dist/`, `node_modules/`, `.vercel/` nem arquivos `tmp-*`.
- Variável de ambiente: `VITE_CARD_PUBLIC_URL` (URL pública usada no QR). Copie `.env.example` para `.env`.
- Ao trocar foto/logo, mantenha os mesmos nomes de arquivo em `public/` ou atualize as referências no config.
- Rodar `npm run lint`, `npm test` e `npm run build` antes de cada commit.

## Fluxo de trabalho
1. Criar branch a partir de `main` para cada mudança.
2. Commits curtos em português (ex.: `feat: adiciona botão do Instagram`, `fix: corrige contraste do botão`).
3. Push -> a Vercel gera preview; merge em `main` publica em produção.
