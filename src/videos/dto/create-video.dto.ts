import { IsNotEmpty, IsOptional } from 'class-validator'
import { User } from 'src/users/entities/user.entity'

export class CreateVideoDto {
	@IsOptional()
	folderId: string

	@IsNotEmpty()
	title: string

	@IsOptional()
	videoId: string

	@IsNotEmpty()
	user: User
}
