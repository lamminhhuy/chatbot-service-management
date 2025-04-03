import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSenderIdRoleConstraint1743609430772 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE messages
            ADD CONSTRAINT check_sender_id_role
            CHECK (
                (role = 'assistant' AND sender_id IS NULL) OR
                (role = 'user' AND sender_id IS NOT NULL)
            );
        `);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE messages
            DROP CONSTRAINT check_sender_id_role;
        `);
    }

}
