import { Column, PrimaryGeneratedColumn, Unique } from "typeorm";

export class Role {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
    @Unique(['name'])
    name: string;

    @Column()
    @Unique(['code'])
    code: string;
    @Column()
    description: string;
    createdAt: Date;
    updatedAt: Date;

}