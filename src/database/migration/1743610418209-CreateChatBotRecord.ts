import { MigrationInterface, QueryRunner } from "typeorm";
import * as argon2 from "argon2";

export class CreateChatBotRecord1743610418209 implements MigrationInterface {
    private readonly CHATBOT_ID = 999999; 
    private readonly CHATBOT_PASSWORD = argon2.hash('0923280469'); 
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO users (id, username, email, password, created_at)
            VALUES ($1, 'chatbot', 'chatbot@gmail.com', $2, NOW())
        `, [this.CHATBOT_ID, this.CHATBOT_PASSWORD]);

        await queryRunner.query(`
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, (SELECT id FROM roles WHERE code = 'BASIC_USER'))
        `, [this.CHATBOT_ID]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM users
            WHERE id = $1
        `, [this.CHATBOT_ID]);
    }
}