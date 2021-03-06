import {
  Column,
  Entity,
  EntityRepository,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id?: string;

  @Column()
  public name!: string;
}

export default Category;
