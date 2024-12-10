-- CreateIndex
CREATE FULLTEXT INDEX Foods_name_idx ON Foods(name) WITH PARSER ngram;

