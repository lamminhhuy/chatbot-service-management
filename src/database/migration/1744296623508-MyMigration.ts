import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1744296623508 implements MigrationInterface {
    name = 'MyMigration1744296623508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["chatbot_postgresdb","public","subscriptions","GENERATED_COLUMN","period_months","\n        CASE \"billing_cycle\"\n          WHEN 'monthly' THEN 1\n          WHEN 'quarterly' THEN 3\n          WHEN 'yearly' THEN 12\n          WHEN 'one-time' THEN NULL\n        END\n      "]);
        await queryRunner.query(`INSERT INTO "subscriptions"("name", "code", "price", "billing_cycle", "is_active", "description", "metadata", "query_token_limit") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, ["Basic Plan", "BASIC_PLAN", 10.00, "monthly", true,'For basic users', null, 10]);
        await queryRunner.query(`INSERT INTO "subscriptions"("name", "code", "price", "billing_cycle", "is_active", "description", "metadata", "query_token_limit") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, ["Standard Plan", "STANDARD_PLAN", 25.00, "monthly", true,'For standard users', null, 1000]);
        await queryRunner.query(`INSERT INTO "subscriptions"("name", "code", "price", "billing_cycle", "is_active", "description", "metadata", "query_token_limit") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, ["Premium Plan", "PREMIUM_PLAN", 50.00, "monthly", true,'For premium users', null, 999999]);
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
