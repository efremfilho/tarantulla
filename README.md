# Tarantulla

> **NOTA**: Essa é uma versão _alpha_ em processo de adaptação. Há muito acoplamento e muitas coisas como perisstência e trabalhos manuais serão generalizados e automatizados. Veja as Issues e Milestones para saber o que vai acontecer. Seja paciente: breve instruções sobre deploy e utilização.

O Tarantulla é responsável por organizar artigos e metadados de diversos _sources_ (portais) em uma base comum onde se possa comparar informrações.

O Processo de consolidação é organizado em 3 etapas:

* Captura de links;
* Download de conteúdo;
* _Parse_ de conteudo;
* Enriquecimento com engajamento;

## Engenho

Fazer _crawling_ implica em ter implementações específicas pra cada _source_ (portal).

Esse engenho delega essas especificidades atravaés de um "contrato" de integração - fazendo um paralelo com java, imagine que para integrgar um portal, você tenha que implementar algumas _interfaces_.

Cada portal, então, para atender a esse "contrato", deve:
 
 - Implementar um `sources/<NOME-DO-PORTAL>/getLinks.kjb` - o job deve copiar para resultset, os campos:
    * **url** - Endereço do artigo/matéria
    * **source** - nome do portal
 - Implementar um `sources/<NOME-DO-PORTAL>/parseHTML.ktr` - a transformação deve consultar a tabela `staging.sources_html` e copiar para resultset:
    * **url** - Endereço do artigo/matéria
    * **source** - Nome do portal
    * **tags** - Tags do site separadas por `,`;
    * **date** - Data de publicação do artigo/matéria - `yyyy-MM-dd`;
    * **title** - Titulo da página
    * **textHTML** - HTML do corpo da matéria
    * **author** - Autor do artigo
 - Implementar um arquivo config.json com os atrubitos:
    * **name** - nome único do portal. ex.: `Gizmodo B`
    * **brand** - rede a qual pertence o portal. ex.: `Gizmodo`
    * **lang** - Idioma do portal. ex.: `en`
    * **locale** - Locale do portal. ex.: `US`
    * **category** - Uma categoria que você queira utilizar para subdividir os publishers
    
    

### Staging area

Como o processo é lento, pela necessidade de download, limitação de banda e de acessos dos websites, o engenho tem de se preocupar em não desperdiçar esforço já feito. 

Por isso, há de se compreender o papel das stagings.

Há 3 tabelas staging até o parse:

* **staging.sources_links**
  - guarda todos os links que chegam do processamento;
  - link é _primary key_;
* **staging.sources_html**
  - possui os mesmos campos da anterior e mais o conteúdo HMTL baixado; 
  - link é _primary key_
  - Antes de baixar um HTML, o processo verifica se já existe HTML para o link;
* **staging.sources_parsed** - 
  - possui os mesmos campos da sources_links e mais campos gerados pelo `parseHTML`; 
  - link é _primary key_
  - no `parseHTML.ktr`, a implementação deve trazer de `sources_html`, apenas aquilo que não existe em `staging.sources_parsed`;
* **staging.sources_facebook** - 
  - possui os mesmos campos da sources_links e mais campos de engajamento da consulta em https://developers.facebook.com/docs/graph-api/reference/v2.8/url
  - link é _primary key_
  - A implementação traz de `sources_parsed`, apenas aquilo que não existe em `staging.sources_facebook`;
  - Às vezes o limite de consultas diárias é alcançado e essa consulta ajuda:

  ```sql
  delete from staging.sources_facebook where response like '%User request limit reached%'; 
  ```

Dessa maneira, por mais que dê erro em algum estágio, o processo tende a ser capaz de ser re-executado a partir do ponto em que parou, com prejuízo reduzido.

## Utilização

São 5, os principais parâmetros de execução do `./main.kjb`

---

`-param:fetchLinks=(true|false)`

Se vai executar a etapa de descoberta de links para todos os sources;

---

`-param:downloadContent=(true|false)`

Se vai executar a etapa de download de conteúdo HTML de todos os links existentes que ainda não tenham sido baixados (não estejam no cache de banco na tabela `sources_html`).

---

`-param:parseContent=(true|false)`

Se vai executar a etapa de parse de conteúdo HTML de todos os links que tenham HTML persistido e que ainda não tenham sido convertidos (não estejam no cache de banco na tabela `sources_parsed`).
---

`-param:fetchFacebookEngagement=(true|false)`

Se vai executar a etapa de pegar engajamento do Facebook de todos os links que tenham ainda não tenham dados (não estejam no cache de banco na tabela `sources_facebook`).

---

`-param:spscific=(NOTSET|<ID-DO-SOURCE>)`

Se especificado, vai rodar apenas para o source especificado. `<ID-DO-SOURCE>` é o nome da pasta onde a implementação do source está armazenada, depois de `sources/`. Deixe vazio se não quiser especificar


# Backup/restore

Para gerar backups e movimentar dados pesados entre servidores, prefira usar o `pg_dump` em linha de comando.

## Backup

Comando para fazer backup das 3 tabelas de _Market_ comprimidas.

```bash
./pg_dump -U postgres \
--table=staging.sources_links \
--table=staging.sources_html \
--table=staging.sources_parsed \
--table=staging.sources_facebook \
--no-privileges \
--no-owner \
--compress=9 \
-Fc \
--no-tablespaces tarantulla > ./tarantulla.postgres.dump
```

## restore

Comando para restaurar um arquivo gerado com o comando anterior:

```bash
./pg_restore -U postgres \
--dbname=tarantulla \
--verbose \
-Fc \
./tarantulla.postgres.dump
```
