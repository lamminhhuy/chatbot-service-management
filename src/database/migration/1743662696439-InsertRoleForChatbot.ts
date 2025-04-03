import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRoleForChatbot1743662696439 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const CHATBOT_ID = 999999; 
        await queryRunner.query(`
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, (SELECT id FROM roles WHERE code = 'ASSISTANT'))
        `, [CHATBOT_ID]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
