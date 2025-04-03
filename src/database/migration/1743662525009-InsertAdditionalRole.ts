import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertAdditionalRole1743662525009 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
           INSERT INTO roles (name,code,description) VALUES
                ('assistant','ASSISTANT', 'Chatbot assistant')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM roles WHERE code = 'SUPER_USER';
        `);

}
}