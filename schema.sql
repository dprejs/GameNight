CREATE TABLE "games" (
  "GameId" int PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "minPlayers" int NOT NULL,
  "maxPlayers" int NOT NULL,
  "minTime" int NOT NULL,
  "maxTime" int NOT NULL,
  "minAge" int,
  "maxAge" int,
  "mainPhoto" int
);

CREATE TABLE "gamePhotos" (
  "PhotoId" int PRIMARY KEY,
  "photo" bytea NOT NULL,
  "GameId" int NOT NULL
);

CREATE TABLE "tags" (
  "TagId" int PRIMARY KEY,
  "tagName" varchar UNIQUE NOT NULL
);

CREATE TABLE "gameTags" (
  "relationId" int PRIMARY KEY,
  "GameId" int,
  "TagId" int
);

CREATE TABLE "users" (
  "userId" int PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "hashedPW" varchar NOT NULL
);

CREATE TABLE "libraries" (
  "userId" int,
  "gameId" int
);

CREATE TABLE "groups" (
  "groupId" int PRIMARY KEY,
  "groupName" varchar NOT NULL
);

CREATE TABLE "comments" (
  "commentId" int PRIMARY KEY,
  "GameId" int,
  "username" varchar,
  "comment" varchar,
  "groupId" int
);

ALTER TABLE "gamePhotos" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("GameId");

ALTER TABLE "gameTags" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("GameId");

ALTER TABLE "gameTags" ADD FOREIGN KEY ("TagId") REFERENCES "tags" ("TagId");

ALTER TABLE "libraries" ADD FOREIGN KEY ("gameId") REFERENCES "games" ("GameId");

ALTER TABLE "libraries" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "comments" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("GameId");

ALTER TABLE "comments" ADD FOREIGN KEY ("groupId") REFERENCES "groups" ("groupId");
