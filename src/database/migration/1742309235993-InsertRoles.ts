import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRoles1742309235993 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO roles (name,code,description) VALUES
                ('admin','ADMINISTRATOR', 'Administrator with full access'),
                ('manager','MANAGER', 'Manager with limited administrative privileges'),
                ('basic_user','BASIC_USER', 'Basic user with limited access'),
                ('advance_user','ADVANCED_USER', 'Advanced user with additional privileges'),
                ('pro_user','PROFESSIONAL_USER', 'Professional user with extended features');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS roles;");
    }

}
