import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { User } from 'src/users/entities/user.entity'

export class CreateVideoDto {
	@IsOptional()
	@ApiProperty()
	folderId: string

	@IsNotEmpty()
	@ApiProperty()
	title: string

	@IsOptional()
	@ApiProperty()
	videoId: string

	@IsNotEmpty()
	@ApiProperty()
	user: User
}
