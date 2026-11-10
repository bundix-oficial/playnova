# 🚀 FRIV DIGITAL — Backend (Cloudflare Workers + D1)

Este diretório contém o backend completo e gratuito para o sistema de Login e Ranking Semanal do FRIV DIGITAL.

> **Nota:** Atualmente o frontend funciona 100% no navegador via `localStorage` (sem precisar de servidor nenhum). Quando você quiser que o ranking seja global entre todos os jogadores de computadores diferentes, basta seguir os passos abaixo!

---

## 🛠️ Como fazer o deploy no Cloudflare (Passo a Passo)

### 1. Criar o Banco D1
No terminal (ou no painel web da Cloudflare em `Workers & Pages > D1`):
```bash
npx wrangler d1 create friv-db
```
Copie o `database_id` gerado e cole no arquivo `wrangler.toml`.

### 2. Criar as Tabelas
```bash
npx wrangler d1 execute friv-db --file=./schema.sql
```

### 3. Fazer o Deploy do Worker
```bash
npx wrangler deploy
```

Seu backend estará no ar em: `https://friv-api.<seu-subdominio>.workers.dev`!
