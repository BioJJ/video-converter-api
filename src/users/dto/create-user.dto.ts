import { IsNotEmpty, IsEmail, Matches, IsOptional } from 'class-validator'
import { MessagesHelper } from 'src/helpers/messages.helper'
import { RegExHelper } from 'src/helpers/regex.helper'
import { ApiProperty } from '@nestjs/swagger'
import { BaseDTO } from 'src/bases/dto/base.dto'

export class CreateUserDto extends BaseDTO {
	@IsNotEmpty()
	@ApiProperty({
		example: 'Jefferson Coelho',
		description: `O nome será utilizado para qualquer coisa que precise exibir informações da pessoa conectada.`
	})
	name: string

	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({
		example: 'email@email.com',
		description: `O e-mail é necessário para o login.`
	})
	email: string

	@Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
	@IsNotEmpty()
	@ApiProperty({
		example: '123@abc',
		description: `É possível conectar com redes sociais sem uma senha, mas para login usando o e-mail diretamente é necessário informar uma senha.`
	})
	password: string

	@IsOptional()
	@ApiProperty({
		example: 'True | False',
		description: `Status de cadastro do usuario.`
	})
	status?: boolean
}
