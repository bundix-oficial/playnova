# Ativar o placar compartilhado no Cloudflare Pages

O frontend usa `/api/*` no próprio domínio. `_worker.js` é gerado por `python tools/build-pages-api.py`; `_routes.json` limita o Worker à API. O catálogo e os jogos continuam servidos como arquivos estáticos. Nunca publique a pasta de trabalho inteira: ela contém dados privados.

## Preparação do banco

1. Entre na conta Cloudflare que possui o projeto Pages do friv.digital.
2. Crie um banco **D1** para o placar, por exemplo `friv-community-v2`.
3. No console SQL desse banco, execute o conteúdo de `worker/schema-v2.sql`. São tabelas novas; o script não apaga tabelas antigas. Não importe automaticamente os placares locais antigos: a captura anterior produzia valores incorretos.
4. No projeto Pages, em Settings / Bindings, adicione um vínculo **D1 database** com nome **DB**, apontando para esse banco. Configure produção e, se quiser testar uma versão de prévia, também o ambiente de prévia.
5. Publique o pacote preparado com `_worker.js` e `_routes.json` na raiz. O envio deve preservar o mesmo projeto e domínio. Para envios com Wrangler, use somente uma pasta de distribuição limpa extraída do ZIP aprovado.

Após publicar, abrir `https://friv.digital/api/status` deve retornar `ready: true`. Sem banco/tabelas, retorna 503 e o portal indica modo local. Criar uma conta online e entrar em outro navegador deve mostrar a mesma conta e o mesmo ranking. As contas antigas armazenadas só no navegador não são contas online; crie um cadastro online. Não envie senha ou token pelo chat.

## O que mudou

As sessões são verificadas no servidor por cookie HttpOnly, e o usuário do placar vem dessa sessão. A API ignora nomes/IDs enviados para tentar atribuir os pontos a outra pessoa. Cada partida tem identificador próprio; o banco registra o melhor resultado semanal por conta. A semana começa na segunda-feira às 00:00 em Brasília. Há filtro básico de nomes e proteção contra reenvio da mesma partida. Isso não torna um jogo executado no navegador imune a trapaças.

O Slope lê somente a chave exata da pontuação atual e confirma o evento de fim observado no build local. Não lê recordes antigos, dados do sistema operacional ou pontuações arbitrárias de outras mensagens.

## Verificações

`node --test tools/test-community-api.mjs tools/test-game-chunks.mjs` verifica identidade, sessões, pontuação, reenvio, semana e leitura das partes dos jogos. `python tools/check-account-ui.py` testa a interface com banco de teste em memória, sem tocar no banco real. Os testes locais não confirmam uma publicação nem os limites do plano Cloudflare.

## Referências

- [Pages em modo avançado](https://developers.cloudflare.com/pages/functions/advanced-mode/)
- [Vínculos de banco no Pages](https://developers.cloudflare.com/pages/functions/bindings/)
- [Operações em lote no D1](https://developers.cloudflare.com/d1/worker-api/d1-database/)

Nesta sessão o Wrangler instalado informou que não há login Cloudflare ativo. Nenhum banco de produção foi criado, alterado ou publicado automaticamente.
