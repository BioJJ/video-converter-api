import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { IsPublic } from 'src/auth/decorators/is-public.decorator'
import { ApiTags, ApiBody } from '@nestjs/swagger'

@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@IsPublic()
	@Post()
	@ApiBody({ type: CreateUserDto })
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return await this.usersService.create(createUserDto)
	}

	@Get()
	async findAll(): Promise<User[]> {
		return await this.usersService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<User> {
		return await this.usersService.findOne(+id)
	}

	@Patch(':id')
	@ApiBody({ type: UpdateUserDto })
	async update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto
	): Promise<void> {
		return await this.usersService.update(+id, updateUserDto)
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		return await this.usersService.remove(+id)
	}
}
