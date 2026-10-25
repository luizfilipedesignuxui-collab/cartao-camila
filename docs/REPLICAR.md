# Como replicar o cartão, a landing e o site

Este projeto é o modelo fechado. Outros clones precisam ficar **idênticos** a este: mesmas telas, mesma ordem de seções, mesmas cores, mesmos botões. O que muda é só a ficha da pessoa.

Três superfícies, um único visual:

| Superfície | Onde vive | Papel |
|---|---|---|
| Cartão digital | código em `src/` · rotas `/`, `/{slug}`, `/conectar`, `/entrega`, `/conexoes` | Peça em circulação. QR, identidade, contato. |
| Landing | Figma página `Landing` | Página única de venda. Primeiro passo: WhatsApp. Percurso completo: LinkedIn. |
| Site | Figma página `Site` | Presença profissional de RH, mais completa que a landing. Não copia o LinkedIn. |

- Figma: [Cartão Digital — Kit UI](https://www.figma.com/design/fbFtbk04wUuV7CpT2zI6JJ)
- Design system: `DESIGN.md`
- Folha em branco: `docs/CAMPOS.md`
- Objeto em branco: `src/config/business-card.template.ts`
- Ficha da Camila (referência): `src/config/business-card.ts`

Só dados reais. Sem clientes, depoimentos, preços, horários, agenda ou contato inventado.

---

## O que nunca muda (as três superfícies)

- Tokens de `DESIGN.md`. Sem hex fora da lista.
- Tipografia Inter. Regular, Medium, Semi Bold.
- Fundo de faixa tinta: `#000000`. Texto cream `#FFFFFF`.
- Fundo de faixa cream: `#FFFFFF`. Texto ink `#000000`.
- Três círculos `#1A8C8D` no canto direito de toda faixa tinta. Laranja `#F05E23` só como destaque.
- Cápsula creme sobre verde. Cápsula tinta sobre cream. Nunca botão vermelho.
- Foto circular nomeada **Foto de [Nome]**. Anel cream na foto sobre verde.
- Nome da pessoa em **uma linha** na hero e na entrada do cartão.
- Sem capa de fundo, sem monograma sobre o nome, sem Reveal ID, sem 01 02 03, sem travessão.
- WCAG 2.2 AA: um H1 por página, foco visível 3px para fora, alvo 44px, cápsulas 52px, skip **Ir para o conteúdo**, nomes de botão descritivos.
- Formação acadêmica completa **não se lista**. O convite é o LinkedIn.
- WhatsApp é o primeiro contato. LinkedIn é o percurso inteiro.

| Token | Hex | Uso |
|---|---|---|
| ink | `#000000` | fundo tinta, texto sobre branco |
| cream | `#FFFFFF` | texto no preto, botão principal, faixas |
| media | `#1A8C8D` | círculos, barra dos cards, ícones |
| accent | `#F05E23` | destaque da marca |
| muted | `#000000` | texto auxiliar (preto a 64% no CSS) |
| bg | `#FFFFFF` | fundo claro |
| surface-raised | `#FFFFFF` | card elevado |
| line | `#000000` | borda dos cards (preto a 14% no CSS) |
| qr-paper | `#FFFFFF` | placa do QR |
| qr-ink | `#000000` | módulos do QR |
| brand-linkedin | `#0A66C2` | só o selo do convite `/conectar` |

Espaçamento: 4 / 8 / 16 / 20 / 28 / 36. Raios: 14 / 22 / 32 / 9999.

---

## 1. Cartão digital

Código. Não redesenhar componentes. Trocar só a ficha.

### Rotas

| Rota | Tela |
|---|---|
| `/` e `/{slug}` | Cartão (entrada, identidade ou contato) |
| `/conectar` | Convite LinkedIn, aberto pelo QR |
| `/entrega` | Entrega do cartão físico |
| `/conexoes` | Minhas conexões (privado, `noindex`, só pela entrega) |
| qualquer outro slug | Cartão ausente |

O QR **nunca** aponta para o LinkedIn. Ele aponta para a URL pública + `/conectar`.

### Sessões do cartão

Ordem fixa: **Entrada → Identidade → Contato**. Quem lê o QR cai em `/conectar`. **Ver o restante do cartão** abre a identidade, não a entrada. **Voltar** existe só no contato e volta para a entrada.

#### 1. Entrada

- Fundo tinta + três círculos media à direita.
- H1: nome em uma linha.
- Cargo. Especialidade.
- Foto + QR compacto no meio do espaço livre. QR é o foco.
- Rodapé: só a cápsula creme **Ir para o contato**.
- Sem cidade nesta tela. Sem Revelar identidade. Sem segundo botão.

#### 2. Identidade

- Mesmo verde. Foto maior, cidade, nome, cargo, chips da especialidade.
- Card cream com fatos em ciclo (deslize ou setas). Texto inteiro, sem cortar palavra, sem Pausar informações.
- Nav: só **Contato**.
- Quem vem de **Ver o restante do cartão** cai aqui.

Fatos do carrossel, nesta ordem, só se existirem na ficha:

1. Foco → especialidade + linha de prática
2. Como trabalha → resumo
3. Organização da experiência → cargo + detalhe
4. Registro → credencial + cidade

#### 3. Contato

- Título **Fale com [primeiro nome]**.
- Ícones WhatsApp / LinkedIn / e-mail. Toque mostra o detalhe.
- Ações no bloco: Salvar contato, Compartilhar, Baixar QR Code.
- Nav: **Voltar** (entrada) e **Contato**.

#### 4. Conectar (`/conectar`)

- Fundo tinta. Foto. Nome. Cargo.
- Card cream LinkedIn. CTA tinta **Conectar no LinkedIn** (abre o perfil real).
- **Ver o restante do cartão** → identidade (`?layer=identity`).
- Se o card for mais alto que a tela, a página rola por dentro. Sem travar o cursor.

##### Sua primeira mensagem

Dentro do card do LinkedIn, abaixo do CTA (que não muda), nesta ordem:

1. Explicação curta e a orientação **Escolha networking, parcerias ou oportunidades…**
2. Rótulo **Contexto da conexão (opcional)** e três botões: Networking, Parcerias, Oportunidades (`role="group"` + `aria-labelledby`).
3. Um contexto por vez, nenhum marcado por padrão. Marcado = fundo tinta + check + `aria-pressed="true"`. Tocar de novo desmarca.
4. Com contexto: lead e destaques tirados só da ficha (`buildContextModes`), a mensagem sugerida (`buildConnectionMessage`), **Editar mensagem** e **Copiar mensagem**.
5. A frase **Conecte-se com [primeiro nome] no LinkedIn ou envie a mensagem que você preparou.** e o botão **Enviar mensagem no LinkedIn**, que copia o texto e abre o perfil real. O LinkedIn não aceita DM com texto pronto por link: a tela avisa que a mensagem foi copiada e que é só colar e enviar.

Sem contexto não há mensagem. O texto editado fica no `sessionStorage`, um por contexto. `?contexto=networking|parcerias|oportunidades` abre com o contexto marcado (`src/lib/context-mode.ts`). Os textos das mensagens são fixos; troque só a saudação pelo `firstName` da ficha.

### Comportamentos que o clone precisa manter

- Salvar contato gera vCard 3.0 e abre a agenda
- Compartilhar usa o share nativo; se faltar, copia o link
- Baixar QR Code grava a primeira tela na galeria
- Escape volta à entrada
- Tela travada em `h-dvh` (exceto `/conectar`, que pode rolar por dentro)
- `?layer=identity` e `?layer=connection` só para conferência

### Onde mexer

| Pode | Não pode |
|---|---|
| `src/config/business-card.ts` | `src/components/**` |
| `public/` (foto) | `src/index.css` tokens |
| `index.html` metadados | `DESIGN.md` cores e raios |
| `docs/CAMPOS.md` daquela pessoa | Adicionar sessão, capa, monograma, pill 01 02 03 |

---

## 2. Landing

Figma: `Landing / Desktop` (1440) e `Landing / Mobile` (390). Uma página só. Não é o site.

### Ordem das seções (não inverter)

1. **Topo** — nav + hero
2. **Fala de venda** — faixa tinta. Por que falar com a pessoa. WhatsApp primeiro, LinkedIn para o percurso.
3. **Como trabalha** — H2 da prática + 3 cards cream (competências da ficha)
4. **Para quem** — 3 cards (recolocação, carreira, diversidade e inclusão)
5. **CTA WhatsApp** — faixa tinta, número e **Falar no WhatsApp**
6. **Princípios** — 4 cards tinta/cream (ética, embasamento, acolhimento, sigilo)
7. **Percurso** — Lab Yes! + convite LinkedIn. Sem lista de cursos.
8. **Contato** — WhatsApp, e-mail, LinkedIn, cápsulas

### Hero

**Desktop:** texto à esquerda, foto circular à direita. Círculos media no canto. Cápsulas WhatsApp + LinkedIn. Chips de credencial e trajetória. Nome em uma linha.

**Mobile (390):** skip **Ir para o conteúdo** (44px, foco 3px). Nav com marca à esquerda e **Contato** à direita, alvo 44px, `SPACE_BETWEEN`. Foto 160px centrada, anel cream 4px. Nome em uma linha ( Semi Bold 32). Especialidade, resumo, chips, cápsulas 52px empilhadas na largura. Círculos media no canto direito, sem cobrir a foto.

A fala de venda não se mistura com a hero. A hero apresenta. A faixa seguinte vende.

### O que a landing não faz

- Não lista MBA, pós, PUCRS, Pearson, Anhanguera
- Não copia o About do LinkedIn
- Não usa a mesma frase de 16 anos no título de Como trabalha se a fala de venda já usou
- Não diz “recorte de inclusão”; diz **inclusão**
- Não inventa depoimento, preço ou agenda

---

## 3. Site

Figma: página `Site`. Mais completo que a landing. Não é currículo.

### Páginas desktop (1440), nesta ordem no arquivo

| Frame | Papel | Seções |
|---|---|---|
| `Site / Completo` | Home | Topo · Dados · Sobre · Atuação · Ponte segunda seção · Contato |
| `Site / Segunda seção` | Continuação da home | Nav (sem hero) · Para quem · Princípios · Percurso · Convite LinkedIn · Atendimento · Canais · Contato |
| `Site / Sobre` | Página Sobre | Topo com hero da pessoa · Formação teaser + atendimento · CTA WhatsApp · Contato |
| `Site / Atuação` | Página Atuação | Topo curto · Frentes · Para quem · Princípios · CTA WhatsApp · Rodapé |
| `Site / Percurso` | Página Percurso | Topo Lab Yes! · Convite LinkedIn · CTA WhatsApp · Rodapé |
| `Site / Completo Mobile` | Home 390 | Mesma ordem da home desktop, hero mobile igual à landing |
| `Site / Contato` | Página Contato | Topo · Canais · CTA WhatsApp · Rodapé |

Nav do site: **Início · Sobre · Atuação · Percurso · Contato**. No mobile da home: marca + **Contato**.

### Home (`Site / Completo`)

Não empilhar o site inteiro aqui.

1. Hero (apresentação + foto + WhatsApp + LinkedIn)
2. Dados: 16+ · CRP · 3 frentes · SP
3. Sobre curto
4. Como trabalha: 3 cards (orientação, posicionamento, job hunter)
5. Ponte **Segunda seção** (faixa tinta) → resto do conteúdo
6. Contato

### Segunda seção

**Sem banner de hero.** Só nav, depois o conteúdo:

- Para quem
- Princípios
- Lab Yes!
- Convite: *O percurso completo está no LinkedIn* + `in/handle` + **Abrir LinkedIn**
- Como o atendimento funciona
- Canais (WhatsApp, e-mail, LinkedIn)
- Contato

### Sobre

Hero da pessoa. Segunda faixa: teaser de formação (*MBA, diversidade e auditoria em RH. O detalhe está no LinkedIn*) + card de atendimento. Faixa WhatsApp com o número grande e **Chamar no WhatsApp**. Contato.

### Percurso acadêmico

Não repetir a lista de cursos em Completo, Sobre, Percurso e landing. Uma frase + CTA **Ver percurso no LinkedIn**. A formação completa vive no perfil.

### Mobile do site

Hero idêntica em regra à landing mobile: skip, nav `SPACE_BETWEEN`, foto 160, nome em uma linha, chips, cápsulas 52px. Seções da home em coluna. Cards cream largura total, raio 32, barra media 4px.

---

## 4. Como montar um clone

1. Copie esta pasta. Não copie de um rascunho antigo.
2. Preencha `docs/CAMPOS.md` e depois `src/config/business-card.ts`.
3. Troque `public/` pela foto da pessoa. Apague a foto da Camila do novo projeto.
4. Atualize `index.html`: título, descrição, author, og e theme-color `#000000`.
5. Preencha `publicUrl` ou `VITE_CARD_PUBLIC_URL` com o endereço final `https://`.
6. No Figma, duplique o arquivo e troque nome, foto, textos da ficha. Mantenha frames, ordem e tokens.
7. Rode `npm install`, `npm run dev`, `npm test`, `npm run lint`, `npm run build`.
8. Confira `/`, `/{slug}`, `/conectar`, `/entrega` e `/conexoes`. O QR deve abrir a URL pública + `/conectar`, não localhost e não LinkedIn.

Se a pessoa não tiver LinkedIn, WhatsApp ou e-mail, deixe o campo vazio. Não invente. Não redesenhe o vazio.

---

## 5. Minhas conexões (`/conexoes`)

Página privada da dona do cartão. Não entra no cartão público e não é indexada (`noindex` na página e `X-Robots-Tag` no `vercel.json`).

- Acesso só pelo botão **Minhas conexões** (outline, 52px) em `/entrega`, logo depois de **Compartilhar meu cartão**.
- Formulário **Nova conexão**: Pessoa (obrigatório), Contexto (Networking, Parceria, Oportunidade profissional), Próximo passo e Lembrete (data opcional).
- Lista ordenada pelo lembrete mais próximo; sem lembrete vai para o fim. Selos **Hoje** e **Atrasado**. Cada item pode ser removido.
- **Preparar mensagem** mostra a prévia das conexões marcadas; **Abrir no WhatsApp** usa `https://wa.me/?text=...` sem número. A dona escolhe o contato e confirma.
- Dados só no aparelho: `localStorage`, chave `cartao:conexoes:v1`. Sem servidor, sem login. Trocar de celular ou limpar o navegador apaga a lista.
- Lógica em `src/lib/connections.ts` (limites: nome 60, contexto 60, próximo passo 140).

---

## Conferência

### Cartão

- [ ] Nome numa linha na entrada
- [ ] Sem cidade na entrada
- [ ] Foto e QR acima dos botões
- [ ] Só **Ir para o contato** na entrada
- [ ] QR abre `/conectar` no domínio público
- [ ] Identidade no mesmo verde, card cream sem palavra cortada
- [ ] Identidade só com Contato; Voltar só no contato, para a entrada
- [ ] WhatsApp, e-mail e LinkedIn reais
- [ ] Nenhuma tela do cartão estoura `h-dvh` (exceto rolagem interna de `/conectar`)

### Landing

- [ ] Ordem: Topo → Fala de venda → Como trabalha → Para quem → CTA WhatsApp → Princípios → Percurso → Contato
- [ ] Fala de venda com caminho WhatsApp + LinkedIn
- [ ] Como trabalha sem repetir a frase dos 16 anos da faixa anterior
- [ ] Sem lista de formação
- [ ] Hero mobile: nome em uma linha, foto visível, Contato 44px à direita, círculos sem cobrir o rosto
- [ ] Desktop 1440 e mobile 390

### Site

- [ ] Home enxuta + segunda seção sem hero
- [ ] Sobre não contém a segunda seção aninhada
- [ ] Formação só como teaser + LinkedIn
- [ ] Nav Início / Sobre / Atuação / Percurso / Contato
- [ ] Mobile da home com a mesma regra de hero da landing
- [ ] Site mais completo que a landing, sem copiar o LinkedIn
