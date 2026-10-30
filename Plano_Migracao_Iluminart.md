# Iluminart — vitrine, compra e resultados

## Estrutura atual preparada

O domínio lojaluzmariana.com.br abre a Iluminart. A Luz Mariana tem sua seção exclusiva para artigos religiosos, preservando sua marca. A vitrine geral reúne os produtos públicos para que o cliente possa comprar sem escolher outro sistema.

| Caminho | Função |
| --- | --- |
| `/` ou `/index.html` | Página principal, vitrine e carrinho único |
| `/#catalogo` | Todos os produtos da loja |
| `/#loja/luz-mariana` | Artigos religiosos classificados como Luz Mariana |
| `/#loja/personalizados` | Ideias e pedidos personalizados |
| `/#loja/natal` e `/#loja/decoracao` | Coleções |
| `/catalogo.html#finalizar` | Finalização direta do mesmo carrinho |
| `/catalogo.html#acompanhar` | Acompanhamento de pedido |
| `/admin/` e `/calculadora/` | Acesso direto da equipe, sem links na página principal |
| `/iluminart/` | Compatibilidade com o endereço da primeira entrega |

## Jornada de compra

**Escolher a peça → adicionar ao carrinho → finalizar pedido.**

Todos os cartões de peças com preço têm um botão grande Adicionar ao carrinho. Ver detalhes aparece menor logo abaixo e é opcional. Modelos e tamanhos são escolhidos no cartão; uma única variação já vem selecionada.

O cartão destaca o preço à vista no Pix, o valor total no cartão e a parcela em até 3x. Os dois preços pertencem ao mesmo modelo e acompanham a seleção. A partir de sinaliza modelos com valores diferentes antes da escolha. Parcelas com arredondamento de centavos são identificadas como aproximadas. Esse padrão também se aplica à listagem do catálogo interno.

O carrinho permite aumentar, reduzir, remover e registrar cor ou observação opcional. Uma barra visível mantém o acesso ao carrinho no celular. Finalizar pedido abre diretamente os dados de compra, sem gerar orçamento ou copiar resumo intermediário.

O mesmo armazenamento de carrinho é usado nas duas páginas, com os IDs e modelos já existentes. Produtos da Iluminart e da Luz Mariana podem ser comprados juntos. O checkout recalcula preços a partir do catálogo, mantém campanhas, cupons, retirada/entrega, pagamento e o registro de pedidos existentes.

O subtotal Pix usa as mesmas funções de preços e campanhas do checkout. Frete, crédito, cupons e embalagens opcionais continuam sendo escolhidos na finalização. Itens sem estoque continuam vendáveis sob encomenda. Valores não cadastrados corretamente são tratados por consulta, sem inventar preços.

As observações das peças aparecem na revisão e seguem para o pedido e a mensagem. Ao continuar comprando, o preenchimento é mantido temporariamente nesta aba. Nenhum pedido é registrado apenas por adicionar ao carrinho ou navegar. A ação final de envio permanece explícita.

## Personalizados

O atendimento Quero um personalizado fica separado da compra de peças cadastradas. O cliente descreve sua ideia e conversa com a equipe no WhatsApp para combinar valores e prazo. A entrada automática de solicitações personalizadas no painel permanece uma etapa futura.

## Marcas e coleções

A classificação por marca continua disponível no painel, sem duplicar produtos, custos ou modelos. Uma peça pode ter múltiplas coleções. Luz Mariana permanece uma marca religiosa.

A organização por marca deixa de impedir a compra: produtos públicos ainda não classificados aparecem na vitrine geral como Peças da loja. Não há classificação automática como Luz Mariana por nome. Categorias reconhecidas já cadastradas também ajudam os filtros de coleção. A seção religiosa usa a classificação revisada.

## Equipe e dados existentes

Os links Calculadora e Orçamentos e Área da Equipe foram removidos da página principal a pedido do usuário. As páginas permanecem acessíveis diretamente em seus endereços habituais.

A atualização de compra não altera o código da calculadora, os SQLs de aprovação, a gestão financeira nem a fila de produção. Mantém descontos, observações, orçamento compartilhado, aprovação única, impressão A4/58 mm e regras de retirada já implementadas.

## Publicação

O pacote atual é **Atualizacao_Vitrine_Completa_Iluminart.zip**. Contém index.html, catalogo.html, admin/index.html, storefront-core.js, storefront-improvements.css, loja-assets e o novo SQL. Publicar o conteúdo web na raiz do repositório existente, preservando as demais pastas. Antes de publicar, executar Instalar_Melhorias_Vitrine.sql no Supabase já utilizado pela loja.

As logomarcas mantêm seus arquivos transparentes originais, sem caixas de fundo no layout. As fotos antigas e novas são exibidas em quadros quadrados e inteiras, sem recorte ou distorção; os arquivos armazenados não são regravados. O domínio, carrinho e links antigos de produto continuam compatíveis. A configuração de manutenção permanece preservada.

O snapshot completo catalogo-main.zip contém o código atual. Instruções em Como_Atualizar_Iluminart.txt.

## Seis melhorias da vitrine

- Banner móvel compacto e produtos mais vendidos próximos ao topo, com fallback honesto para Peças em destaque quando não há vendas informadas.
- Busca junto à marca e atalhos para presentes até R$ 30 e coleções.
- Prazo público configurável pela equipe, retirada e consulta por CEP para confirmar frete/transporte antes da compra. Não promete uma cotação automática na nova consulta.
- Avaliações aprovadas quando existentes e galeria com fotos cadastradas, sem depoimentos fictícios ou atribuição indevida a clientes.
- Ajuda contextual no WhatsApp, com peça/modelo selecionados.
- Relatório privado de visitas por etapa, acessível em Produtos/Precificação → Mais ações → Vitrine e resultados.

A configuração de prazo e o relatório usam o novo SQL. O prazo inicialmente fica a confirmar com a loja. A medição não interpreta WhatsApp aberto ou pedido registrado como pagamento. Não inclui dados pessoais ou texto livre nos novos eventos, respeita Não Rastrear e pode ser desativada pela equipe. As visitas são agrupadas nesta aba até 30 minutos de inatividade. Resultados antigos podem não conter todas as etapas.

## Verificação e limites

Testes locais com respostas controladas: produto com/sem múltiplos modelos, validação de escolha, carrinho misto, quantidade, observações, campanha e total iguais na finalização, continuidade dos dados ao adicionar itens, ausência de classificação sem bloquear a vitrine geral e carrinho/finalização em 375 px sem transbordamento horizontal.

Testes das funções compartilhadas de preço: herança de variação, campanhas em % e R$, pedido mínimo, teto e pagamento. Scripts completos das duas páginas validados.

Nenhum pedido ou mensagem real foi enviado. Não houve publicação no GitHub nem alteração do Supabase por esta entrega. A conferência com produtos, fotos e serviços de entrega reais deve ser feita após a publicação.


Verificação adicional da revisão dos cartões: compra com seleção inline, falta de modelo, atualização dos dois preços do mesmo modelo, parcelamento exato/aproximado, detalhes secundários, listagem interna e 375 px sem transbordamento. O código de envio e finalização do pedido foi mantido.


Verificação desta etapa: compra pelos destaques, modelos sincronizados, busca/filtro por preço, consulta de CEP e ajuda contextual, avaliações aprovadas, painel de configuração e relatório, quadros quadrados e vitrine/carrinho/finalização em 375 px sem rolagem horizontal. SQL validado localmente com instalação e reinstalação, acessos por papel, validação de prazo e contagem das etapas. Nenhum pedido ou mensagem real foi enviado.
