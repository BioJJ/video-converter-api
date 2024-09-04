import { User } from 'src/users/entities/user.entity'
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from 'src/bases/entities/base.entity'

@Entity()
export class Video extends BaseEntity {
	@Column()
	title: string

	@Column({ name: 'video_id' })
	videoId: string

	@Column({ name: 'folder_id', nullable: true })
	folderId: string

	@Column({ default: true })
	status: boolean

	@ManyToOne(() => User, (user) => user.videos)
	@JoinColumn()
	user: User
}
