CREATE TABLE "games" (
  "id" varchar PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "description" varchar,
  "min_players" int NOT NULL,
  "max_players" int NOT NULL,
  "min_playtime" int NOT NULL,
  "max_playime" int NOT NULL,
  "min_age" int,
  "thumb_url" varchar,
  "img_url" varchar,
  "rules_url" varchar,
  "official_url" varchar,
  "year_published" int,
  "expansionTo" int,
  "isExpansion" bool
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
  "uid" varchar PRIMARY KEY,
  "username" varchar NOT NULL,
  "accesstoken" varchar NOT NULL
);

CREATE TABLE "libraries" (
  "relation_id" SERIAL PRIMARY KEY,
  "uid" varchar,
  "game_id" varchar
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

ALTER TABLE "gamePhotos" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("id");

ALTER TABLE "gameTags" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("id");

ALTER TABLE "gameTags" ADD FOREIGN KEY ("TagId") REFERENCES "tags" ("TagId");

ALTER TABLE "libraries" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");

ALTER TABLE "libraries" ADD FOREIGN KEY ("uid") REFERENCES "users" ("uid");

ALTER TABLE "wishList" ADD FOREIGN KEY ("gameId") REFERENCES "games" ("id");

ALTER TABLE "wishList" ADD FOREIGN KEY ("userId") REFERENCES "users" ("uid");

ALTER TABLE "groupMembers" ADD FOREIGN KEY ("userId") REFERENCES "users" ("uid");

ALTER TABLE "groupMembers" ADD FOREIGN KEY ("groupId") REFERENCES "groups" ("groupId");

ALTER TABLE "friends" ADD FOREIGN KEY ("user1") REFERENCES "users" ("uid");

ALTER TABLE "friends" ADD FOREIGN KEY ("user2") REFERENCES "users" ("uid");

ALTER TABLE "comments" ADD FOREIGN KEY ("GameId") REFERENCES "games" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("groupId") REFERENCES "groups" ("groupId");

ALTER TABLE "games" ADD FOREIGN KEY ("id") REFERENCES "games" ("expansionTo");