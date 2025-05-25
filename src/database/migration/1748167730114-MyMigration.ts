import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1748167730114 implements MigrationInterface {
    name = 'MyMigration1748167730114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_sessions" ("id" BIGSERIAL NOT NULL, "access_token" text NOT NULL, "refresh_token" text NOT NULL, "device_info" character varying(255), "ip_address" character varying(45), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP, "is_revoked" boolean NOT NULL DEFAULT false, "user_id" integer NOT NULL, CONSTRAINT "PK_e93e031a5fed190d4789b6bfd83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_access_token" ON "user_sessions" ("access_token") `);
        await queryRunner.query(`CREATE INDEX "idx_refresh_token" ON "user_sessions" ("refresh_token") `);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" SERIAL NOT NULL, "title" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."messages_role_enum" AS ENUM('developer', 'system', 'user', 'assistant', 'tool', 'agent', 'function')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."messages_role_enum" NOT NULL DEFAULT 'user', "deletedAt" TIMESTAMP, "sender_id" integer, "conversation_id" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'banned', 'pending')`);
        await queryRunner.query(`CREATE TYPE "public"."users_resource_register_enum" AS ENUM('GOOGLE', 'EMAIL')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "username" character varying(50) NOT NULL, "phone_number" character varying(15), "password" character varying(255) NOT NULL, "avatar_url" character varying(255), "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "email_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "last_login_at" TIMESTAMP, "jwtRefreshTokenExpiresAt" TIMESTAMP, "google_id" character varying(255), "resource_register" "public"."users_resource_register_enum" NOT NULL DEFAULT 'EMAIL', "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_google_id_unique_non_deleted" ON "users" ("google_id") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_email_unique_non_deleted" ON "users" ("email") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, "description" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_8dad765629e83229da6feda1c1d" UNIQUE ("code"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "code" character varying(50) NOT NULL, "description" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_type_enum" AS ENUM('BASIC', 'STANDARD', 'PREMIUM')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["chatbot_postgresdb","public","subscriptions","GENERATED_COLUMN","period_months","\n        CASE \"billing_cycle\"\n          WHEN 'monthly' THEN 1\n          WHEN 'quarterly' THEN 3\n          WHEN 'yearly' THEN 12\n          WHEN 'one-time' THEN NULL\n        END\n      "]);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "type" "public"."subscriptions_type_enum" NOT NULL DEFAULT 'BASIC', "price" numeric(15,2) NOT NULL DEFAULT '0', "can_chat_with_agent" boolean NOT NULL DEFAULT false, "billing_cycle" character varying(20) NOT NULL, "period_months" integer GENERATED ALWAYS AS (
        CASE "billing_cycle"
          WHEN 'monthly' THEN 1
          WHEN 'quarterly' THEN 3
          WHEN 'yearly' THEN 12
          WHEN 'one-time' THEN NULL
        END
      ) STORED NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "description" text, "metadata" jsonb, "query_token_limit" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e03f7748dc1247e31dc8078fee7" UNIQUE ("name"), CONSTRAINT "UQ_a4be49c8eb126827c399d23a3f5" UNIQUE ("code"), CONSTRAINT "CHK_3fb5bb51c21363d835bba0e7ea" CHECK ("billing_cycle" IN ('monthly', 'quarterly', 'yearly', 'one-time')), CONSTRAINT "CHK_de262a2807aac6c73e305ae6ff" CHECK ("query_token_limit" IS NULL OR "query_token_limit" >= 0), CONSTRAINT "CHK_aa6deb5a01e057a9c2d237e83f" CHECK ("price" >= 0), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_subscriptions_billing_cycle" ON "subscriptions" ("billing_cycle") `);
        await queryRunner.query(`CREATE INDEX "idx_subscriptions_is_active" ON "subscriptions" ("is_active") `);
        await queryRunner.query(`CREATE TABLE "user_subscriptions" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "subscription_id" integer NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'active', "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "end_date" TIMESTAMP WITH TIME ZONE, "renewal_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_renewal_date" ON "user_subscriptions" ("renewal_date") `);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_status" ON "user_subscriptions" ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_user_id" ON "user_subscriptions" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('BANK_TRANSFER')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_gateway_enum" AS ENUM('SEPAY')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('COMPLETED', 'FAILED', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payment_method" "public"."payments_payment_method_enum" NOT NULL DEFAULT 'BANK_TRANSFER', "payment_gateway" "public"."payments_payment_gateway_enum" NOT NULL DEFAULT 'SEPAY', "transaction_id" integer, "completed_at" TIMESTAMP, "failed_at" TIMESTAMP, "metadata" jsonb, "status" "public"."payments_status_enum" NOT NULL, "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'VND', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying(15) NOT NULL, "user_id" integer NOT NULL, "subscription_id" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")); COMMENT ON COLUMN "payments"."transaction_id" IS 'Transaction ID from payment gateway'; COMMENT ON COLUMN "payments"."metadata" IS 'Additional data, e.g., gateway response, fraud check'; COMMENT ON COLUMN "payments"."status" IS 'Payment status, e.g., COMPLETED, FAILED'; COMMENT ON COLUMN "payments"."amount" IS 'Amount of the payment'; COMMENT ON COLUMN "payments"."currency" IS 'Currency code, e.g., VND'; COMMENT ON COLUMN "payments"."code" IS 'Payment code'`);
        await queryRunner.query(`CREATE TYPE "public"."audit_logs_action_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TYPE "public"."audit_logs_action_by_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entity_type" character varying(50) NOT NULL, "entity_id" bigint NOT NULL, "action" "public"."audit_logs_action_enum" NOT NULL, "action_by" character varying(100) NOT NULL, "action_by_type" "public"."audit_logs_action_by_type_enum" NOT NULL, "old_data" jsonb, "new_data" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "diff" jsonb, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "reason" character varying(255), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7421efc125d95e413657efa3c6" ON "audit_logs" ("entity_type", "entity_id") `);
        await queryRunner.query(`CREATE TABLE "media" ("id" BIGSERIAL NOT NULL, "media_type" character varying(50) NOT NULL, "file_url" character varying(512) NOT NULL, "reference_type" character varying(50), "reference_id" character varying(255), "thumbnail_url" character varying(512), "mime_type" character varying(50), "file_size" bigint, "duration" integer, "metadata" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_media_created_at" ON "media" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_media_type" ON "media" ("media_type") `);
        await queryRunner.query(`CREATE INDEX "idx_media_ref" ON "media" ("reference_type", "reference_id") `);
        await queryRunner.query(`CREATE TABLE "post_categories" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "friendly_slug" character varying(255), "full_slug" character varying(255), "parentId" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_06a309752a93cd98001dbea4603" UNIQUE ("full_slug"), CONSTRAINT "PK_9c45c4e9fb6ebf296990e1d3972" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a09a85a2d70857db5c88035483" ON "post_categories" ("parentId") `);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "categoryId" integer, "title" character varying NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "slug" character varying NOT NULL, "shortDescription" character varying NOT NULL, "category_path" character varying, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation_participants" ("conversation_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_fdcd6405d74e797f10fa8360338" PRIMARY KEY ("conversation_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1559e8a16b828f2e836a231280" ON "conversation_participants" ("conversation_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_377d4041a495b81ee1a85ae026" ON "conversation_participants" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_e9658e959c490b0a634dfc54783" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "fk_message_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "fk_message_conversation" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_f86b815c53c558058190e4b3026" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_0641da02314913e28f6131310eb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "fk_payment_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "fk_payment_subscription" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_categories" ADD CONSTRAINT "FK_a09a85a2d70857db5c88035483b" FOREIGN KEY ("parentId") REFERENCES "post_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_168bf21b341e2ae340748e2541d" FOREIGN KEY ("categoryId") REFERENCES "post_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_1559e8a16b828f2e836a2312800" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_377d4041a495b81ee1a85ae026f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_377d4041a495b81ee1a85ae026f"`);
        await queryRunner.query(`ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_1559e8a16b828f2e836a2312800"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_168bf21b341e2ae340748e2541d"`);
        await queryRunner.query(`ALTER TABLE "post_categories" DROP CONSTRAINT "FK_a09a85a2d70857db5c88035483b"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "fk_payment_subscription"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "fk_payment_user"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_0641da02314913e28f6131310eb"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_f86b815c53c558058190e4b3026"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "fk_message_conversation"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "fk_message_sender"`);
        await queryRunner.query(`ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_e9658e959c490b0a634dfc54783"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_377d4041a495b81ee1a85ae026"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1559e8a16b828f2e836a231280"`);
        await queryRunner.query(`DROP TABLE "conversation_participants"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a09a85a2d70857db5c88035483"`);
        await queryRunner.query(`DROP TABLE "post_categories"`);
        await queryRunner.query(`DROP INDEX "public"."idx_media_ref"`);
        await queryRunner.query(`DROP INDEX "public"."idx_media_type"`);
        await queryRunner.query(`DROP INDEX "public"."idx_media_created_at"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7421efc125d95e413657efa3c6"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TYPE "public"."audit_logs_action_by_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."audit_logs_action_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_gateway_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_renewal_date"`);
        await queryRunner.query(`DROP TABLE "user_subscriptions"`);
        await queryRunner.query(`DROP INDEX "public"."idx_subscriptions_is_active"`);
        await queryRunner.query(`DROP INDEX "public"."idx_subscriptions_billing_cycle"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","period_months","chatbot_postgresdb","public","subscriptions"]);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_type_enum"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP INDEX "public"."idx_email_unique_non_deleted"`);
        await queryRunner.query(`DROP INDEX "public"."idx_google_id_unique_non_deleted"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_resource_register_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_role_enum"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP INDEX "public"."idx_refresh_token"`);
        await queryRunner.query(`DROP INDEX "public"."idx_access_token"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
    }

}
