import { IsOptional } from 'class-validator'

export class BaseDTO {
	@IsOptional()
	id?: string
	@IsOptional()
	createdAt?: Date
	@IsOptional()
	updatedAt?: Date
	@IsOptional()
	deletedAt?: Date
}
