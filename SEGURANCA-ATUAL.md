# Verificação local

## Atualização de 11/11/2026 — página inicial e acesso na escola

O proprietário confirmou que os scripts de anúncios da página inicial foram colocados intencionalmente para monetização e pediu sua preservação. A remoção temporária dos quatro scripts e as restrições adicionadas nesta revisão foram desfeitas. A página inicial permite recursos HTTPS externos para essas integrações. Os registros históricos abaixo sobre ausência de publicidade não descrevem mais essa página. Os destinos efetivamente usados pelos anúncios ainda não foram auditados nesta revisão; não há certificação de ausência de malware ou de reputação pública do domínio.

O print do proprietário mostra bloqueio Check Point UserCheck na categoria Games. A liberação depende da administração da rede da escola. Não foi confirmado um alerta do navegador contra o domínio por esse print. Consulte `USO-NA-ESCOLA.md`. As alterações são locais até que uma publicação seja concluída e verificada.

## Histórico — 02/11/2026

O Microsoft Defender concluiu a varredura das cópias dos jogos sem novas detecções no intervalo consultado. A inspeção estática dos 205 conjuntos preparados não encontrou os padrões críticos procurados de executáveis nativos disfarçados, mineradores conhecidos ou chaves privadas. Esses exames não garantem ausência de malware ou falhas.

Na preparação foram removidas 139 integrações identificadas de publicidade, analytics e widgets. Destinos externos são bloqueados pela CSP; somente as conexões regionais especificadas do BasketBros foram permitidas após consentimento. SendBeacon, pop-ups e instalação de service workers são desativados nas cópias preparadas. A configuração local do Ruffle nega rede e acesso a JavaScript pelos SWFs.

As páginas do portal usam CSP restrita, sem execução dinâmica de scripts. Os motores de jogos precisam de permissões de execução mais amplas. Iframes locais com scripts e mesma origem não são uma fronteira contra código local malicioso. Câmera, microfone e localização são negados. O áudio exige interação e a proteção tenta pausar mídia/contextos ao ocultar a aba. Navegadores de teste ficam sem áudio e seus processos são encerrados.

O servidor bloqueia diretórios privados, ISOs, Git, arquivos de ferramentas, ZIPs e listagem de diretórios. A seleção do empacotador exclui esses arquivos. Essas proteções não tornam seguro publicar toda a pasta de trabalho. Segredos e configurações das contas GitHub/Cloudflare não foram auditados. Não houve varredura ofensiva de servidores externos nem publicação desta entrega.

Favoritos, listas e histórico ficam no navegador. O e-mail público de contato é apenas o destinatário do formulário; não há senha SMTP ou token de envio. Sites oficiais abertos por links têm suas próprias políticas, fora do controle do portal.

Resultados atuais: assets/quick-game-checks.json, preview/security-hardening-validation.json e preview/curated-catalog-validation.json. Evidências técnicas detalhadas e backups ficam privados. Consulte DOWNLOADS-STATUS.md para as contagens e falhas reais; os testes cobrem abertura, não todas as fases.
