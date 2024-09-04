import { Column, Entity, BeforeInsert, OneToMany } from 'typeorm'
import { hashSync } from 'bcrypt'
import { BaseEntity } from 'src/bases/entities/base.entity'
import { Video } from 'src/videos/entities/video.entity'

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

	@OneToMany(() => Video, (video) => video.user)
	videos: Video[]
}
