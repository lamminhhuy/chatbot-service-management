import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoleTrigger1742147099813 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tạo function cho trigger
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION insert_default_user_role()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO user_role (user_id, role)
                VALUES (NEW.id, 'user');
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER trigger_insert_default_user_role
            AFTER INSERT ON users
            FOR EACH ROW
            EXECUTE FUNCTION insert_default_user_role();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS trigger_insert_default_user_role ON users;
        `);

        await queryRunner.query(`
            DROP FUNCTION IF EXISTS insert_default_user_role();
        `);
    }
}