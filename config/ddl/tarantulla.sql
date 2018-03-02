create database tarantulla;

create schema staging;
CREATE TABLE staging.sources_links(
  url TEXT,
 "source" varchar(255),
 primary key(url)
);


CREATE TABLE staging.sources_html(
  url TEXT,
 "source" varchar(255),
 html text,
 primary key(url)
);

CREATE TABLE staging.sources_parsed(
  url TEXT,
 "source" varchar(255),
 tags TEXT,
 "date" Timestamp without time zone,
 title text,
 textHTML text,
 author varchar(255),
 primary key(url)
);

--drop table staging.sources_facebook;
CREATE TABLE staging.sources_facebook(
  url TEXT,
 "source" varchar(255),
 response text,
 APIURL text,
 lookupDate timestamp without time zone,
 primary key(url)
);

--drop table staging.sources_dont_parse;
CREATE TABLE staging.sources_dont_parse(
  url TEXT,
 "source" varchar(255),
 primary key(url)
);