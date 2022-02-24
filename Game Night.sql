DROP TABLE IF EXISTS games, gamePhotos, tags, gameTags, users, libraries, groups, groupMembers, comments, friends, wishList

CREATE TABLE "games" (
  "GameId" int PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "minPlayers" int NOT NULL,
  "maxPlayers" int NOT NULL,
  "minTime" int NOT NULL,
  "maxTime" int NOT NULL,
  "minAge" int,
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

CREATE TABLE "groupMembers" (
  "memberId" int PRIMARY KEY,
  "userId" int,
  "groupId" int
);

CREATE TABLE "comments" (
  "commentId" int PRIMARY KEY,
  "GameId" int,
  "username" varchar,
  "comment" varchar,
  "groupId" int
);

CREATE TABLE "friends" (
  "friendId" int PRIMARY KEY,
  "user1" int,
  "user2" int
);

CREATE TABLE "wishList" (
  "wishId" int PRIMARY KEY,
  "gameId" int,
  "userId" int
);

ALTER TABLE "gamePhotos" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("GameId");

ALTER TABLE "gameTags" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("GameId");

ALTER TABLE "gameTags" ADD FOREIGN KEY ("TagId") REFERENCES "tags" ("TagId");

ALTER TABLE "libraries" ADD FOREIGN KEY ("gameId") REFERENCES "games" ("GameId");

ALTER TABLE "libraries" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "wishList" ADD FOREIGN KEY ("gameId") REFERENCES "games" ("GameId");

ALTER TABLE "wishList" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "groupMembers" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "groupMembers" ADD FOREIGN KEY ("groupId") REFERENCES "groups" ("groupId");

ALTER TABLE "friends" ADD FOREIGN KEY ("user1") REFERENCES "users" ("userId");

ALTER TABLE "friends" ADD FOREIGN KEY ("user2") REFERENCES "users" ("userId");

ALTER TABLE "comments" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("GameId");

ALTER TABLE "comments" ADD FOREIGN KEY ("groupId") REFERENCES "groups" ("groupId");
