DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_class
        WHERE relnamespace = 'public'::regnamespace
          AND relkind IN ('r', 'p', 'S', 'v', 'm')
          AND relname <> 'schema_migrations'
    ) THEN
        RAISE EXCEPTION 'Baseline rollback left application relations behind';
    END IF;
END
$$;
