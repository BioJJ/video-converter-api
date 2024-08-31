import { Column, Entity, BeforeInsert } from 'typeorm'
import { hashSync } from 'bcrypt'
import { BaseEntity } from 'src/bases/entities/base.entity'

@Entity()
export class User extends BaseEntity {
	@Column()
	name: string

	@Column()
	email: string

	@Column()
	password: string

	@Column({ default: true })
	status: boolean

	@BeforeInsert()
	hashPassword() {
		this.password = hashSync(this.password, 10)
	}
}
