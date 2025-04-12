import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1744474058236 implements MigrationInterface {
    name = 'MyMigration1744474058236'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

}
