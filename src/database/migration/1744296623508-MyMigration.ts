import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1744296623508 implements MigrationInterface {
    name = 'MyMigration1744296623508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["chatbot_postgresdb","public","subscriptions","GENERATED_COLUMN","period_months","\n        CASE \"billing_cycle\"\n          WHEN 'monthly' THEN 1\n          WHEN 'quarterly' THEN 3\n          WHEN 'yearly' THEN 12\n          WHEN 'one-time' THEN NULL\n        END\n      "]);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" BIGSERIAL NOT NULL, "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "price" numeric(15,2) NOT NULL DEFAULT '0', "billing_cycle" character varying(20) NOT NULL, "period_months" integer GENERATED ALWAYS AS (
        CASE "billing_cycle"
          WHEN 'monthly' THEN 1
          WHEN 'quarterly' THEN 3
          WHEN 'yearly' THEN 12
          WHEN 'one-time' THEN NULL
        END
      ) STORED NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "description" text, "metadata" jsonb, "query_token_limit" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e03f7748dc1247e31dc8078fee7" UNIQUE ("name"), CONSTRAINT "UQ_a4be49c8eb126827c399d23a3f5" UNIQUE ("code"), CONSTRAINT "CHK_3fb5bb51c21363d835bba0e7ea" CHECK ("billing_cycle" IN ('monthly', 'quarterly', 'yearly', 'one-time')), CONSTRAINT "CHK_de262a2807aac6c73e305ae6ff" CHECK ("query_token_limit" IS NULL OR "query_token_limit" >= 0), CONSTRAINT "CHK_aa6deb5a01e057a9c2d237e83f" CHECK ("price" >= 0), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
      await queryRunner.query(`INSERT INTO "subscriptions"("name", "code", "price", "billing_cycle", "is_active", "description", "metadata", "query_token_limit") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, ["Basic Plan", "BASIC_PLAN", 10.00, "monthly", true,'For basic users', null, 10]);
      await queryRunner.query(`INSERT INTO "subscriptions"("name", "code", "price", "billing_cycle", "is_active", "description", "metadata", "query_token_limit") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, ["Standard Plan", "STANDARD_PLAN", 25.00, "monthly", true,'For standard users', null, 1000]);
      await queryRunner.query(`INSERT INTO "subscriptions"("name", "code", "price", "billing_cycle", "is_active", "description", "metadata", "query_token_limit") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, ["Premium Plan", "PREMIUM_PLAN", 50.00, "monthly", true,'For premium users', null, 999999]);
      await queryRunner.query(`CREATE INDEX "idx_subscriptions_billing_cycle" ON "subscriptions" ("billing_cycle") `);
        await queryRunner.query(`CREATE INDEX "idx_subscriptions_is_active" ON "subscriptions" ("is_active") `);
        await queryRunner.query(`CREATE TABLE "user_subscriptions" ("id" BIGSERIAL NOT NULL, "user_id" integer NOT NULL, "subscription_id" bigint NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'active', "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "end_date" TIMESTAMP WITH TIME ZONE, "renewal_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_renewal_date" ON "user_subscriptions" ("renewal_date") `);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_status" ON "user_subscriptions" ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_subscription_id" ON "user_subscriptions" ("subscription_id") `);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_user_id" ON "user_subscriptions" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_0641da02314913e28f6131310eb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_f86b815c53c558058190e4b3026" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_f86b815c53c558058190e4b3026"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_0641da02314913e28f6131310eb"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_subscription_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_renewal_date"`);
        await queryRunner.query(`DROP TABLE "user_subscriptions"`);
        await queryRunner.query(`DROP INDEX "public"."idx_subscriptions_is_active"`);
        await queryRunner.query(`DROP INDEX "public"."idx_subscriptions_billing_cycle"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","period_months","chatbot_postgresdb","public","subscriptions"]);
    }

}
