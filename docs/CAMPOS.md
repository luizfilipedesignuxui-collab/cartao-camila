# Folha de dados do novo cartão

Copie este bloco e preencha. O visual fica igual ao da Camila. Só mudam estes campos.

Não invente contato, cargo, formação ou experiência. Se não tiver o dado, deixe em branco.

```
NOME COMPLETO:
PRIMEIRO NOME:
SOBRENOME:
CARGO:
ESPECIALIDADE (uma linha, sem travessão):
RESUMO (uma frase):
COMO TRABALHA (texto do card):
CIDADE / ESTADO:
REGISTRO PROFISSIONAL (se houver):

WHATSAPP (como aparece):
MENSAGEM INICIAL DO WHATSAPP:
E-MAIL:
ASSUNTO DO E-MAIL:
LINKEDIN (url completa):

URL PÚBLICA DO CARTÃO (https://...):
FOTO (arquivo em public/):
CAPA (não usar na UI; só se precisar no arquivo):

EXPERIÊNCIA 1
  cargo:
  organização:
  período:
  detalhe:

FORMAÇÃO 1
  título:
  instituição:
  período:

CHIPS (separe por vírgula; saem da especialidade):
```

O QR da primeira tela abre a URL pública do cartão. Preencha `publicUrl` ou `VITE_CARD_PUBLIC_URL` com o endereço `https://` final. Sem isso, o QR usa o domínio atual e não deve ser impresso se ainda for localhost.

Ações que já ficam ligadas no modelo: WhatsApp, e-mail, LinkedIn, salvar contato, compartilhar, baixar a primeira tela. O resto só liga se o campo existir.
