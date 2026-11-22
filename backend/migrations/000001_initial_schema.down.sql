-- Refuse to destroy application data. This baseline rollback is for empty databases.
BEGIN;
SET LOCAL search_path = public;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Prevent a concurrent insert between the emptiness check and DROP TABLE.
LOCK TABLE "Users", "Posts", "Products", "Dialogs", "Messages", "Comments",
    "Bookmarks", "Reviews", "Likes", "Images", "Orders" IN ACCESS EXCLUSIVE MODE;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Users"
        UNION ALL SELECT 1 FROM "Posts"
        UNION ALL SELECT 1 FROM "Products"
        UNION ALL SELECT 1 FROM "Dialogs"
        UNION ALL SELECT 1 FROM "Messages"
        UNION ALL SELECT 1 FROM "Comments"
        UNION ALL SELECT 1 FROM "Bookmarks"
        UNION ALL SELECT 1 FROM "Reviews"
        UNION ALL SELECT 1 FROM "Likes"
        UNION ALL SELECT 1 FROM "Images"
        UNION ALL SELECT 1 FROM "Orders"
    ) THEN
        RAISE EXCEPTION 'Refusing baseline rollback: HandyCraft tables contain data';
    END IF;
END
$$;

-- One statement handles internal cycles (Users/Images and Dialogs/Messages).
-- No CASCADE: dependencies outside this baseline must stop the rollback.
DROP TABLE "Products", "Orders", "Bookmarks", "Likes", "Reviews", "Comments",
    "Images", "Messages", "Dialogs", "Posts", "Users";

COMMIT;
