import { MigrationInterface, QueryRunner } from "typeorm";
import argon2 from 'argon2';

export class Initializedata1748178246276 implements MigrationInterface {
    private CHATBOT_ID = 999999;
    private ADMIN_ID = 1000000; 
    public async up(queryRunner: QueryRunner): Promise<void> {
        const CHATBOT_PASSWORD = await argon2.hash('0924280469');
        const ADMIN_PASSWORD = await argon2.hash('admin@23456!');
        await queryRunner.query(`
          INSERT INTO roles (name, code, description) VALUES
            ('admin', 'ADMINISTRATOR', 'Administrator with full access'),
            ('assistant', 'ASSISTANT', 'Chatbot assistant'),
            ('manager', 'MANAGER', 'Manager with limited administrative privileges'),
            ('basic_user', 'BASIC_USER', 'Basic user with limited access'),
            ('advance_user', 'ADVANCED_USER', 'Advanced user with additional privileges'),
            ('pro_user', 'PROFESSIONAL_USER', 'Professional user with extended features');
        `);

        await queryRunner.query(`
          INSERT INTO users (id, username, email, password, created_at)
          VALUES ($1, 'chatbot', 'chatbot@gmail.com', $2, NOW())
        `, [this.CHATBOT_ID, CHATBOT_PASSWORD]);

        await queryRunner.query(`
          INSERT INTO users (id, username, email, password, created_at)
          VALUES ($1, 'admin', 'admin@gmail.com', $2, NOW())
        `, [this.ADMIN_ID, ADMIN_PASSWORD]);

        await queryRunner.query(`
          INSERT INTO user_roles (user_id, role_id)
          VALUES ($1, (SELECT id FROM roles WHERE code = 'BASIC_USER')),
                 ($2, (SELECT id FROM roles WHERE code = 'ADMINISTRATOR'))
        `, [this.CHATBOT_ID, this.ADMIN_ID]);

        await queryRunner.query(`
          INSERT INTO subscriptions (
            id, name, code, type, price, billing_cycle, is_active, description,
            metadata, "query_token_limit", "can_chat_with_agent"
          ) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
            ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22),
            ($23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33),
            ($34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44)
        `, [
          7, "Basic Plan", "BASIC_PLAN", "BASIC", 10, "monthly", true, "For basic users", "{\"descriptionList\": []}", 5, false,
          8, "Standard Plan", "STANDARD_PLAN", "BASIC", 2000, "monthly", true, "For standard users", "{\"descriptionList\": [\"sdghdsh\", \"hdhdhsd\"]}", 200, false,
          12, "Premium Plus", "PREMIUM_PLUS", "BASIC", 10000, "monthly", true, "For premium users", "{\"descriptionList\": []}", null, true,
          13, "Free Plan", "FREE_PLAN", "BASIC", 0, "monthly", true, "For free users", "{\"descriptionList\": []}", 1, false
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          DELETE FROM subscriptions WHERE id IN (7, 8, 9, 12)
        `);

        await queryRunner.query(`
          DELETE FROM user_roles WHERE user_id IN ($1, $2)
        `, [this.CHATBOT_ID, this.ADMIN_ID]);

        await queryRunner.query(`
          DELETE FROM users WHERE id IN ($1, $2)
        `, [this.CHATBOT_ID, this.ADMIN_ID]);

        await queryRunner.query(`
          DELETE FROM roles WHERE code IN (
            'ADMINISTRATOR', 'ASSISTANT', 'MANAGER',
            'BASIC_USER', 'ADVANCED_USER', 'PROFESSIONAL_USER'
          )
        `);
    }
}