

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."execute_sql"("command" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  execute command;
end;
$$;


ALTER FUNCTION "public"."execute_sql"("command" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."brew_sentinel_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "ip_address" "text",
    "route" "text",
    "threat_type" "text",
    "timestamp" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."brew_sentinel_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."draw_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "game" "text" NOT NULL,
    "draw_date" "date" NOT NULL,
    "draw_type" "text",
    "status" "text" NOT NULL,
    "numbers" integer[] NOT NULL,
    "bonus_ball" integer,
    "multiplier" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "draw_results_status_check" CHECK (("status" = ANY (ARRAY['completed'::"text", 'upcoming'::"text"])))
);


ALTER TABLE "public"."draw_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."game_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "game" "text" NOT NULL,
    "draw_time" "text",
    "add_on" "text",
    "odds" numeric,
    "payout" numeric,
    "ticket_cost" numeric,
    "is_active" boolean DEFAULT true,
    "last_updated" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid",
    "setting_key" "text",
    "setting_value" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."game_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."geo_audit_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "region" "text",
    "country" "text",
    "city" "text",
    "ip_address" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."geo_audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mega_draws" (
    "id" bigint NOT NULL,
    "draw_date" "date" NOT NULL,
    "numbers" integer[] NOT NULL,
    "mega_ball" integer NOT NULL,
    "megaplier" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "jackpot" bigint
);


ALTER TABLE "public"."mega_draws" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."mega_draws_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."mega_draws_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."mega_draws_id_seq" OWNED BY "public"."mega_draws"."id";



CREATE TABLE IF NOT EXISTS "public"."odds" (
    "id" bigint NOT NULL,
    "game" "text" NOT NULL,
    "draw_date" "date",
    "odds_type" "text",
    "odds" "text",
    "payout" numeric(12,2),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."odds" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."odds_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."odds_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."odds_id_seq" OWNED BY "public"."odds"."id";



CREATE TABLE IF NOT EXISTS "public"."pick3_draws" (
    "id" bigint NOT NULL,
    "draw_date" "date" NOT NULL,
    "draw_type" "text" NOT NULL,
    "numbers" integer[] NOT NULL,
    "fireball" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "session" "text",
    "n1" smallint,
    "n2" smallint,
    "n3" smallint,
    "greenball" integer,
    "double_draw" "text",
    CONSTRAINT "pick3_draws_draw_type_check" CHECK (("draw_type" = ANY (ARRAY['day'::"text", 'evening'::"text"])))
);


ALTER TABLE "public"."pick3_draws" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pick3_draws_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pick3_draws_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pick3_draws_id_seq" OWNED BY "public"."pick3_draws"."id";



CREATE TABLE IF NOT EXISTS "public"."pick4_draws" (
    "id" bigint NOT NULL,
    "draw_date" "date" NOT NULL,
    "draw_type" "text" NOT NULL,
    "numbers" integer[] NOT NULL,
    "fireball" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "n1" smallint,
    "n2" smallint,
    "n3" smallint,
    "n4" smallint,
    CONSTRAINT "pick4_draws_draw_type_check" CHECK (("draw_type" = ANY (ARRAY['day'::"text", 'evening'::"text"])))
);


ALTER TABLE "public"."pick4_draws" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pick4_draws_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pick4_draws_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pick4_draws_id_seq" OWNED BY "public"."pick4_draws"."id";



CREATE TABLE IF NOT EXISTS "public"."pick5_draws" (
    "id" bigint NOT NULL,
    "draw_date" "date" NOT NULL,
    "draw_type" "text" NOT NULL,
    "numbers" integer[] NOT NULL,
    "fireball" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "n1" smallint,
    "n2" smallint,
    "n3" smallint,
    "n4" smallint,
    "n5" smallint,
    "bonus_cash" boolean,
    CONSTRAINT "pick5_draws_draw_type_check" CHECK (("draw_type" = ANY (ARRAY['day'::"text", 'evening'::"text"])))
);


ALTER TABLE "public"."pick5_draws" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pick5_draws_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pick5_draws_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pick5_draws_id_seq" OWNED BY "public"."pick5_draws"."id";



CREATE TABLE IF NOT EXISTS "public"."pick_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "game" "text" NOT NULL,
    "draw_date" "date" NOT NULL,
    "time_of_day" "text",
    "numbers" integer[] NOT NULL,
    "source_url" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."pick_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."play_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "game" "text" NOT NULL,
    "draw_type" "text",
    "strategy" "text",
    "numbers" "text",
    "add_on" "text",
    "amount_spent" numeric,
    "outcome" "text",
    "prize" numeric,
    "play_time" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."play_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."powerball_draws" (
    "id" bigint NOT NULL,
    "draw_date" "date" NOT NULL,
    "numbers" integer[] NOT NULL,
    "powerball" integer NOT NULL,
    "powerplay" integer,
    "doubleplay" integer[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "power_play" integer,
    "jackpot" bigint
);


ALTER TABLE "public"."powerball_draws" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."powerball_draws_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."powerball_draws_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."powerball_draws_id_seq" OWNED BY "public"."powerball_draws"."id";



CREATE TABLE IF NOT EXISTS "public"."predictions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "game" "text" NOT NULL,
    "strategy" "text" NOT NULL,
    "numbers" integer[] NOT NULL,
    "score" double precision,
    "generated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."predictions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "key" "text" NOT NULL,
    "value" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."settings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."settings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."settings_id_seq" OWNED BY "public"."settings"."id";



CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text",
    "avatar_url" "text",
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "last_login" timestamp with time zone
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."mega_draws" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."mega_draws_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."odds" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."odds_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pick3_draws" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pick3_draws_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pick4_draws" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pick4_draws_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pick5_draws" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pick5_draws_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."powerball_draws" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."powerball_draws_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."settings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."settings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."brew_sentinel_logs"
    ADD CONSTRAINT "brew_sentinel_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."draw_results"
    ADD CONSTRAINT "draw_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."game_settings"
    ADD CONSTRAINT "game_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."geo_audit_logs"
    ADD CONSTRAINT "geo_audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mega_draws"
    ADD CONSTRAINT "mega_draws_draw_date_key" UNIQUE ("draw_date");



ALTER TABLE ONLY "public"."mega_draws"
    ADD CONSTRAINT "mega_draws_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."odds"
    ADD CONSTRAINT "odds_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pick3_draws"
    ADD CONSTRAINT "pick3_draws_draw_date_draw_type_key" UNIQUE ("draw_date", "draw_type");



ALTER TABLE ONLY "public"."pick3_draws"
    ADD CONSTRAINT "pick3_draws_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pick4_draws"
    ADD CONSTRAINT "pick4_draws_draw_date_draw_type_key" UNIQUE ("draw_date", "draw_type");



ALTER TABLE ONLY "public"."pick4_draws"
    ADD CONSTRAINT "pick4_draws_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pick5_draws"
    ADD CONSTRAINT "pick5_draws_draw_date_draw_type_key" UNIQUE ("draw_date", "draw_type");



ALTER TABLE ONLY "public"."pick5_draws"
    ADD CONSTRAINT "pick5_draws_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pick_history"
    ADD CONSTRAINT "pick_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."play_log"
    ADD CONSTRAINT "play_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."powerball_draws"
    ADD CONSTRAINT "powerball_draws_draw_date_key" UNIQUE ("draw_date");



ALTER TABLE ONLY "public"."powerball_draws"
    ADD CONSTRAINT "powerball_draws_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."predictions"
    ADD CONSTRAINT "predictions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_user_id_key_key" UNIQUE ("user_id", "key");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "draw_results_game_status_draw_date_idx" ON "public"."draw_results" USING "btree" ("game", "status", "draw_date");



ALTER TABLE ONLY "public"."predictions"
    ADD CONSTRAINT "predictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



CREATE POLICY "Admins can read everything" ON "public"."predictions" FOR SELECT TO "authenticated" USING (("auth"."role"() = 'admin'::"text"));



CREATE POLICY "Allow authenticated insert play_log" ON "public"."play_log" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated insert settings" ON "public"."settings" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated insert users" ON "public"."users" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated update play_log" ON "public"."play_log" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated update settings" ON "public"."settings" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated update users" ON "public"."users" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to delete from pick_history" ON "public"."pick_history" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to insert into pick_history" ON "public"."pick_history" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to select from pick_history" ON "public"."pick_history" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to update pick_history" ON "public"."pick_history" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow insert for authed users" ON "public"."draw_results" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Allow insert via service role" ON "public"."mega_draws" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow insert via service role" ON "public"."pick3_draws" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow insert via service role" ON "public"."pick4_draws" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow insert via service role" ON "public"."pick5_draws" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow insert via service role" ON "public"."powerball_draws" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public read on mega_draws" ON "public"."mega_draws" FOR SELECT USING (true);



CREATE POLICY "Allow public read on odds" ON "public"."odds" FOR SELECT USING (true);



CREATE POLICY "Allow public read on pick3_draws" ON "public"."pick3_draws" FOR SELECT USING (true);



CREATE POLICY "Allow public read on pick4_draws" ON "public"."pick4_draws" FOR SELECT USING (true);



CREATE POLICY "Allow public read on pick5_draws" ON "public"."pick5_draws" FOR SELECT USING (true);



CREATE POLICY "Allow public read on play_log" ON "public"."play_log" FOR SELECT USING (true);



CREATE POLICY "Allow public read on powerball_draws" ON "public"."powerball_draws" FOR SELECT USING (true);



CREATE POLICY "Allow service_role insert odds" ON "public"."odds" FOR INSERT WITH CHECK (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Allow service_role update odds" ON "public"."odds" FOR UPDATE USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can insert their own predictions" ON "public"."predictions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read their own predictions" ON "public"."predictions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "allow_read_game_settings" ON "public"."game_settings" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "backend_can_read_sentinel_logs" ON "public"."brew_sentinel_logs" FOR SELECT TO "service_role" USING (true);



ALTER TABLE "public"."brew_sentinel_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."draw_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."game_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."geo_audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mega_draws" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."odds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pick3_draws" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pick4_draws" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pick5_draws" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pick_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."play_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."powerball_draws" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."predictions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_can_read_own_audit_logs" ON "public"."geo_audit_logs" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "user_can_read_own_profile" ON "public"."user_profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































REVOKE ALL ON FUNCTION "public"."execute_sql"("command" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."execute_sql"("command" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."execute_sql"("command" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."execute_sql"("command" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."brew_sentinel_logs" TO "anon";
GRANT ALL ON TABLE "public"."brew_sentinel_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."brew_sentinel_logs" TO "service_role";



GRANT ALL ON TABLE "public"."draw_results" TO "anon";
GRANT ALL ON TABLE "public"."draw_results" TO "authenticated";
GRANT ALL ON TABLE "public"."draw_results" TO "service_role";



GRANT ALL ON TABLE "public"."game_settings" TO "anon";
GRANT ALL ON TABLE "public"."game_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."game_settings" TO "service_role";



GRANT ALL ON TABLE "public"."geo_audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."geo_audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."geo_audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."mega_draws" TO "anon";
GRANT ALL ON TABLE "public"."mega_draws" TO "authenticated";
GRANT ALL ON TABLE "public"."mega_draws" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mega_draws_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mega_draws_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mega_draws_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."odds" TO "anon";
GRANT ALL ON TABLE "public"."odds" TO "authenticated";
GRANT ALL ON TABLE "public"."odds" TO "service_role";



GRANT ALL ON SEQUENCE "public"."odds_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."odds_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."odds_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pick3_draws" TO "anon";
GRANT ALL ON TABLE "public"."pick3_draws" TO "authenticated";
GRANT ALL ON TABLE "public"."pick3_draws" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pick3_draws_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pick3_draws_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pick3_draws_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pick4_draws" TO "anon";
GRANT ALL ON TABLE "public"."pick4_draws" TO "authenticated";
GRANT ALL ON TABLE "public"."pick4_draws" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pick4_draws_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pick4_draws_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pick4_draws_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pick5_draws" TO "anon";
GRANT ALL ON TABLE "public"."pick5_draws" TO "authenticated";
GRANT ALL ON TABLE "public"."pick5_draws" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pick5_draws_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pick5_draws_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pick5_draws_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pick_history" TO "anon";
GRANT ALL ON TABLE "public"."pick_history" TO "authenticated";
GRANT ALL ON TABLE "public"."pick_history" TO "service_role";



GRANT ALL ON TABLE "public"."play_log" TO "anon";
GRANT ALL ON TABLE "public"."play_log" TO "authenticated";
GRANT ALL ON TABLE "public"."play_log" TO "service_role";



GRANT ALL ON TABLE "public"."powerball_draws" TO "anon";
GRANT ALL ON TABLE "public"."powerball_draws" TO "authenticated";
GRANT ALL ON TABLE "public"."powerball_draws" TO "service_role";



GRANT ALL ON SEQUENCE "public"."powerball_draws_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."powerball_draws_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."powerball_draws_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."predictions" TO "anon";
GRANT ALL ON TABLE "public"."predictions" TO "authenticated";
GRANT ALL ON TABLE "public"."predictions" TO "service_role";



GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























drop extension if exists "pg_net";


