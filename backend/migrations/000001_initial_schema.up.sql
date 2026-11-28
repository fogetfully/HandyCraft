-- Baseline from HandyCraft_2026-11-18T18_22_50.033Z.sql.
-- New databases only; do not apply over an existing HandyCraft schema.
BEGIN;
SET LOCAL search_path = public;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

CREATE TABLE "Users" (
	"UserID" serial NOT NULL,
	"Name" varchar(45) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(50) NOT NULL,
	"About" varchar(500),
	"Role" varchar(5) NOT NULL DEFAULT 'user' CHECK("Role" IN ('user', 'admin')),
	"EmailVerified" boolean NOT NULL DEFAULT FALSE,
	"sex" varchar(10) CHECK("sex" IN ('male', 'female')),
	"city" varchar(50),
	"AvatarID" int,
	"created" timestamp NOT NULL,
	"updated" timestamp,
	"deleted" timestamp,
	PRIMARY KEY("UserID")
);

CREATE TABLE "Posts" (
	"PostID" serial NOT NULL,
	"AuthorID" int NOT NULL,
	"Type" varchar(20) NOT NULL CHECK("Type" IN ('idea', 'order', 'product')),
	"Title" varchar(100),
	"Description" text,
	"LikesCount" int NOT NULL DEFAULT 0 CHECK("LikesCount" >= 0),
	"CommentsCount" int NOT NULL DEFAULT 0 CHECK("CommentsCount" >= 0),
	"Status" varchar(20) NOT NULL DEFAULT 'active' CHECK("Status" IN ('active', 'draft', 'archived')),
	"created" timestamp NOT NULL,
	"updated" timestamp,
	"deleted" timestamp,
	PRIMARY KEY("PostID")
);

CREATE TABLE "Products" (
	"PostID" int NOT NULL,
	"Price" decimal(12,2) CHECK("Price" >= 0),
	"Quantity" int CHECK("Quantity" >= 0),
	PRIMARY KEY("PostID")
);

CREATE TABLE "Dialogs" (
	"DialogID" serial NOT NULL,
	"PostID" int NOT NULL,
	-- мастер или покупатель
	"InitiatorID" int NOT NULL,
	"AuthorConfirmed" boolean NOT NULL DEFAULT FALSE,
	"InitiatorConfirmed" boolean NOT NULL DEFAULT FALSE,
	"AuthorUnreadCount" int NOT NULL DEFAULT 0 CHECK("AuthorUnreadCount" >= 0),
	"InitiatorUnreadCount" int NOT NULL DEFAULT 0 CHECK("InitiatorUnreadCount" >= 0),
	"LastMessageID" int,
	"LastActivityAt" timestamp NOT NULL,
	"created" timestamp NOT NULL,
	"updated" timestamp,
	"deleted" timestamp,
	PRIMARY KEY("DialogID"),
	CONSTRAINT "UNIQUE (PostID, InitiatorID)" UNIQUE ("PostID", "InitiatorID")
);

CREATE TABLE "Messages" (
	"MessageID" serial NOT NULL,
	"DialogID" int NOT NULL,
	"SenderID" int NOT NULL,
	"Content" text,
	"IsRead" boolean NOT NULL DEFAULT FALSE,
	"created" timestamp NOT NULL,
	"updated" timestamp,
	"deleted" timestamp,
	PRIMARY KEY("MessageID")
);

CREATE TABLE "Comments" (
	"CommentID" serial NOT NULL,
	"PostID" int NOT NULL,
	"AuthorID" int NOT NULL,
	"ParentID" int,
	"Content" text,
	"created" timestamp NOT NULL,
	"updated" timestamp,
	"deleted" timestamp,
	PRIMARY KEY("CommentID")
);

CREATE TABLE "Bookmarks" (
	"UserID" int NOT NULL,
	"PostID" int NOT NULL,
	"created" timestamp NOT NULL,
	"deleted" timestamp,
	PRIMARY KEY("UserID", "PostID")
);

CREATE TABLE "Reviews" (
	"ReviewID" serial NOT NULL,
	"DialogID" int NOT NULL,
	"AuthorID" int NOT NULL,
	"SubjectID" int NOT NULL,
	"PostTitle" varchar(100) NOT NULL,
	"Content" text NOT NULL,
	"created" timestamp NOT NULL,
	"updated" timestamp,
	"deleted" timestamp,
	PRIMARY KEY("ReviewID"),
	CONSTRAINT "Reviews_unique_0" UNIQUE ("DialogID", "AuthorID")
);

CREATE TABLE "Likes" (
	"LikeID" serial NOT NULL,
	"SubjectID" int NOT NULL,
	"ObjectID" int NOT NULL,
	"created" timestamp,
	"deleted" timestamp,
	PRIMARY KEY("LikeID"),
	CONSTRAINT "Likes_unique_0" UNIQUE ("SubjectID", "ObjectID")
);

CREATE TABLE "Images" (
	"ImageID" serial NOT NULL,
	"UploaderID" int NOT NULL,
	"StorageKey" varchar(255) NOT NULL UNIQUE,
	"PostID" int,
	"MessageID" int,
	"Position" int,
	"Width" int,
	"Height" int,
	"created" timestamp NOT NULL,
	"updated" timestamp,
	"deleted" timestamp,
	PRIMARY KEY("ImageID")
);

CREATE TABLE "Orders" (
	"PostID" int NOT NULL,
	"DesiredDeadline" date,
	"DesiredPayment" decimal(12, 2) CHECK("DesiredPayment" >= 0),
	PRIMARY KEY("PostID")
);

ALTER TABLE "Products"
ADD FOREIGN KEY("PostID") REFERENCES "Posts"("PostID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Messages"
ADD FOREIGN KEY("DialogID") REFERENCES "Dialogs"("DialogID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Messages"
ADD FOREIGN KEY("SenderID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Posts"
ADD FOREIGN KEY("AuthorID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Comments"
ADD FOREIGN KEY("PostID") REFERENCES "Posts"("PostID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Comments"
ADD FOREIGN KEY("AuthorID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Comments"
ADD FOREIGN KEY("ParentID") REFERENCES "Comments"("CommentID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Reviews"
ADD FOREIGN KEY("SubjectID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Reviews"
ADD FOREIGN KEY("AuthorID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Likes"
ADD FOREIGN KEY("SubjectID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Likes"
ADD FOREIGN KEY("ObjectID") REFERENCES "Posts"("PostID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Bookmarks"
ADD FOREIGN KEY("UserID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Bookmarks"
ADD FOREIGN KEY("PostID") REFERENCES "Posts"("PostID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Users"
ADD FOREIGN KEY("AvatarID") REFERENCES "Images"("ImageID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Images"
ADD FOREIGN KEY("UploaderID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Orders"
ADD FOREIGN KEY("PostID") REFERENCES "Posts"("PostID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Dialogs"
ADD FOREIGN KEY("PostID") REFERENCES "Posts"("PostID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Dialogs"
ADD FOREIGN KEY("InitiatorID") REFERENCES "Users"("UserID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Dialogs"
ADD FOREIGN KEY("LastMessageID") REFERENCES "Messages"("MessageID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Images"
ADD FOREIGN KEY("PostID") REFERENCES "Posts"("PostID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Images"
ADD FOREIGN KEY("MessageID") REFERENCES "Messages"("MessageID")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Reviews"
ADD FOREIGN KEY("DialogID") REFERENCES "Dialogs"("DialogID")
ON UPDATE NO ACTION ON DELETE NO ACTION;

COMMIT;
