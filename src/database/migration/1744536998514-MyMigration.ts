import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1744536998514 implements MigrationInterface {
    name = 'MyMigration1744536998514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('BANK_TRANSFER')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_gateway_enum" AS ENUM('SEPAY')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" integer NOT NULL, "subscription_id" integer NOT NULL, "payment_method" "public"."payments_payment_method_enum" NOT NULL DEFAULT 'BANK_TRANSFER', "payment_gateway" "public"."payments_payment_gateway_enum" NOT NULL DEFAULT 'SEPAY', "transaction_id" integer NOT NULL, "completed_at" TIMESTAMP NOT NULL, "failed_at" TIMESTAMP NOT NULL, "metadata" jsonb NOT NULL, "status" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "idempodency_key" character varying(100) NOT NULL, "code" character varying(15) NOT NULL, CONSTRAINT "UQ_06669615484fd70a4a9dcb83a41" UNIQUE ("idempodency_key"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")); COMMENT ON COLUMN "payments"."transaction_id" IS 'A transaction id comes from a payment gateway'; COMMENT ON COLUMN "payments"."metadata" IS 'Additional data, e.g., gateway response, fraud check'; COMMENT ON COLUMN "payments"."status" IS 'Payment status, e.g., COMPLETED, FAILED'; COMMENT ON COLUMN "payments"."amount" IS 'Amount of the payment'; COMMENT ON COLUMN "payments"."currency" IS 'Currency code, e.g., VND'; COMMENT ON COLUMN "payments"."code" IS 'Payment code'`);
        await queryRunner.query(`CREATE INDEX "IDX_3669932439c68826d2a3516c31" ON "payments" ("user_id", "subscription_id", "idempodency_key") `);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_f86b815c53c558058190e4b3026"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "PK_a87248d73155605cf782be9ee5e"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "PK_9e928b0954e51705ab44988812c"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_subscription_id"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP COLUMN "subscription_id"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD "subscription_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_subscription_id" ON "user_subscriptions" ("subscription_id") `);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_f86b815c53c558058190e4b3026" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_f86b815c53c558058190e4b3026"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_subscriptions_subscription_id"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP COLUMN "subscription_id"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD "subscription_id" bigint NOT NULL`);
        await queryRunner.query(`CREATE INDEX "idx_user_subscriptions_subscription_id" ON "user_subscriptions" ("subscription_id") `);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "PK_9e928b0954e51705ab44988812c"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "PK_a87248d73155605cf782be9ee5e"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_f86b815c53c558058190e4b3026" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3669932439c68826d2a3516c31"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_gateway_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
    }

}
