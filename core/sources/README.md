# Techinsider[OK]

- http://www.businessinsider.com/sitemap

# Techtudo [OK]

- http://pox.globo.com/sitemap/techtudo/

# Olhar digital

- https://olhardigital.com.br/robots.txt        # nao referencia sitemap
- https://olhardigital.com.br/sitemap.xml       # parece gerado manualmente - desatualizado
- https://olhardigital.com.br/rss               # nao consegui paginar
- https://olhardigital.com.br/noticias/2        # pagina legal - só até pagina 10

# tudocelular

- https://www.tudocelular.com/robots.txt        # Nada
- https://www.tudocelular.com/feed/             # nao consegui paginar
- https://www.tudocelular.com/page/2/           # parece seguro. é facil de pegar links pagina até n páginas

# Androidpit [OK]

- https://www.androidpit.com/sitemap.xml        # parece OK
- https://www.androidpit.com.br/sitemap.xml     # parece OK

# UOL Tecnologia [OK]

- https://tecnologia.uol.com.br/sitemap/        # parece OK


# Gizmodo [OK]

- http://gizmodo.uol.com.br/sitemap_index.xml/  # parece OK
- http://gizmodo.com/sitemap.xml                # parece OK

# Estadao link

- http://link.estadao.com.br/sitemap/Link.xml   # CRAP
- http://link.estadao.com.br/busca/vejaMais?pagina=3&editoria=link&rows=10 # Utilizavel

# R7 Tecnologia

- ...                                           # BAD BAD


# The Verge

- ...                                           # BAD BAD

# Engadget [OK]
 
- https://www.engadget.com/sitemap_index.xml    # parece OK

# CNet [OK]

- https://www.cnet.com/robots.txt               # parece OK

# Mashable

- http://mashable.com/stories.json?new_per_page=100&channel=tech&hot_per_page=0&rising_per_page=0               # utilizavel
- http://mashable.com/robots.txt - tem sitemaps mas estao incompletos

# PCWorld [OK]

- http://pcworld.com/robots.txt                 # parece OK

# Slashgear [OK]

- https://www.slashgear.com/sitemap.xml         # parece OK

# Techradar [OK]

- http://www.techradar.com/sitemap.xml          # Parece OK

# TODO

## tratar exceções de download automaticamente

gizmodoptbr

```sql
select flag_source, count(1) qtd from (
 select case when html like '%<title>502 Bad Gateway%' then 'bad' else 'good' end as flag_source from staging.sources_html where source='gizmodoptbr'
)tempx group by flag_source;
```

## Tratar falha na API do facebook automaticamente

```sql
  delete from staging.sources_facebook where response like '%User request limit reached%'; 
```

# Anotações
```bash
for i in {1..20}; do \
./etl.sh job ../backend/etl/staging/market/job_market.kjb \
-param:fetchLinks=false \
-param:downloadContent=false \
-param:parseContent=true \
-param:fetchFacebookEngagement=false\
; done
```

```sql
select count(1) from
(
  select 
    *
  from staging.sources_html h
  where 
    (select count(1) from staging.sources_parsed p where p.url = h.url)=0
  and source='techtudo'
)temp
where   
  html not like '%<title>Globo.com - Desculpe-nos%'
  and url not like '%/kits/%';
```



```sql
select
  x.source,
  (select count(1) from staging.sources_html h where h.source=x.source) qtd_parsed,
  (select count(1) from staging.sources_facebook p where p.source=x.source) qtd_facebook,
  (select count(1) from staging.sources_html h where h.source=x.source) -
  (select count(1) from staging.sources_facebook p where p.source=x.source) diff
from 
  (select distinct source from staging.sources_html) x;
```



```sql
select
  x.source,
  (select count(1) from staging.sources_html h where h.source=x.source) qtd_html,
  (select count(1) from staging.sources_parsed p where p.source=x.source) qtd_parsed,
  (select count(1) from staging.sources_html h where h.source=x.source) -
  (select count(1) from staging.sources_parsed p where p.source=x.source) diff
from 
  (select distinct source from staging.sources_html) x;
```