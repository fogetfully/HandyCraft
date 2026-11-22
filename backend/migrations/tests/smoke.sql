-- All fixtures are rolled back; suitable for a disposable database only.
BEGIN;
SET LOCAL search_path = public;

DO $$
DECLARE
    author_id integer;
    buyer_id integer;
    post_id integer;
    dialog_id integer;
    message_id integer;
    avatar_id integer;
    comment_id integer;
BEGIN
    IF (SELECT count(*) FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
          AND table_name <> 'schema_migrations') <> 11 THEN
        RAISE EXCEPTION 'Expected 11 application tables';
    END IF;

    IF (SELECT count(*) FROM pg_constraint
        WHERE connamespace = 'public'::regnamespace AND contype = 'f') <> 22 THEN
        RAISE EXCEPTION 'Expected 22 foreign keys';
    END IF;

    INSERT INTO "Users" ("Name", "email", "password", "created")
    VALUES ('Author', 'author@example.test', 'test-fixture-only', now())
    RETURNING "UserID" INTO author_id;
    INSERT INTO "Users" ("Name", "email", "password", "created")
    VALUES ('Buyer', 'buyer@example.test', 'test-fixture-only', now())
    RETURNING "UserID" INTO buyer_id;

    IF NOT (SELECT "Role" = 'user' AND NOT "EmailVerified"
            FROM "Users" WHERE "UserID" = author_id) THEN
        RAISE EXCEPTION 'User defaults are incorrect';
    END IF;

    INSERT INTO "Posts" ("AuthorID", "Type", "Status", "created")
    VALUES (author_id, 'product', 'draft', now()) RETURNING "PostID" INTO post_id;
    INSERT INTO "Products" ("PostID", "Price", "Quantity") VALUES (post_id, 12.34, 2);
    INSERT INTO "Bookmarks" ("UserID", "PostID", "created") VALUES (buyer_id, post_id, now());
    INSERT INTO "Likes" ("SubjectID", "ObjectID", "created") VALUES (buyer_id, post_id, now());
    INSERT INTO "Comments" ("PostID", "AuthorID", "Content", "created")
    VALUES (post_id, buyer_id, 'Test comment', now()) RETURNING "CommentID" INTO comment_id;
    INSERT INTO "Comments" ("PostID", "AuthorID", "ParentID", "Content", "created")
    VALUES (post_id, author_id, comment_id, 'Test reply', now());
    INSERT INTO "Dialogs" ("PostID", "InitiatorID", "LastActivityAt", "created")
    VALUES (post_id, buyer_id, now(), now()) RETURNING "DialogID" INTO dialog_id;

    -- A message can exist without images. Two images can refer to one message.
    INSERT INTO "Messages" ("DialogID", "SenderID", "Content", "created")
    VALUES (dialog_id, buyer_id, 'Hello', now()) RETURNING "MessageID" INTO message_id;
    UPDATE "Dialogs" SET "LastMessageID" = message_id WHERE "DialogID" = dialog_id;
    INSERT INTO "Images" ("UploaderID", "StorageKey", "MessageID", "created")
    VALUES (buyer_id, 'test/one', message_id, now()), (buyer_id, 'test/two', message_id, now());
    INSERT INTO "Images" ("UploaderID", "StorageKey", "created")
    VALUES (author_id, 'test/avatar', now()) RETURNING "ImageID" INTO avatar_id;
    UPDATE "Users" SET "AvatarID" = avatar_id WHERE "UserID" = author_id;
    INSERT INTO "Reviews" ("DialogID", "AuthorID", "SubjectID", "PostTitle", "Content", "created")
    VALUES (dialog_id, buyer_id, author_id, 'Test title', 'Test review', now());

    INSERT INTO "Posts" ("AuthorID", "Type", "Title", "created")
    VALUES (author_id, 'order', 'Test order', now()) RETURNING "PostID" INTO post_id;
    INSERT INTO "Orders" ("PostID", "DesiredPayment") VALUES (post_id, 100);

    BEGIN
        UPDATE "Users" SET "Role" = 'owner' WHERE "UserID" = author_id;
        RAISE EXCEPTION 'Invalid role was accepted';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    BEGIN
        UPDATE "Posts" SET "Type" = 'invalid' WHERE "PostID" = post_id;
        RAISE EXCEPTION 'Invalid post type was accepted';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    BEGIN
        UPDATE "Posts" SET "Status" = 'invalid' WHERE "PostID" = post_id;
        RAISE EXCEPTION 'Invalid post status was accepted';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    BEGIN
        UPDATE "Posts" SET "LikesCount" = -1 WHERE "PostID" = post_id;
        RAISE EXCEPTION 'Negative counter was accepted';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    BEGIN
        UPDATE "Products" SET "Quantity" = -1;
        RAISE EXCEPTION 'Negative quantity was accepted';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    BEGIN
        UPDATE "Orders" SET "DesiredPayment" = -1 WHERE "PostID" = post_id;
        RAISE EXCEPTION 'Negative payment was accepted';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    BEGIN
        INSERT INTO "Images" ("UploaderID", "StorageKey", "MessageID", "created")
        VALUES (buyer_id, 'test/orphan', -1, now());
        RAISE EXCEPTION 'Orphan image was accepted';
    EXCEPTION WHEN foreign_key_violation THEN NULL;
    END;
    BEGIN
        INSERT INTO "Likes" ("SubjectID", "ObjectID")
        SELECT "SubjectID", "ObjectID" FROM "Likes";
        RAISE EXCEPTION 'Duplicate like was accepted';
    EXCEPTION WHEN unique_violation THEN NULL;
    END;
    BEGIN
        INSERT INTO "Bookmarks" ("UserID", "PostID", "created")
        SELECT "UserID", "PostID", now() FROM "Bookmarks";
        RAISE EXCEPTION 'Duplicate bookmark was accepted';
    EXCEPTION WHEN unique_violation THEN NULL;
    END;
    BEGIN
        INSERT INTO "Dialogs" ("PostID", "InitiatorID", "LastActivityAt", "created")
        SELECT "PostID", "InitiatorID", now(), now() FROM "Dialogs" WHERE "DialogID" = dialog_id;
        RAISE EXCEPTION 'Duplicate dialog was accepted';
    EXCEPTION WHEN unique_violation THEN NULL;
    END;
    BEGIN
        INSERT INTO "Reviews" ("DialogID", "AuthorID", "SubjectID", "PostTitle", "Content", "created")
        VALUES (dialog_id, buyer_id, author_id, 'Test', 'Duplicate', now());
        RAISE EXCEPTION 'Duplicate review was accepted';
    EXCEPTION WHEN unique_violation THEN NULL;
    END;
END
$$;

ROLLBACK;
