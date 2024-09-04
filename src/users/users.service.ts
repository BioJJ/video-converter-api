import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { DeepPartial, Repository } from 'typeorm'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const userPartial: DeepPartial<User> =
			this.mapUserDtoToUserPartial(createUserDto)

		const user = this.userRepository.create(userPartial)

		return await this.userRepository.save(user)
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const userPartial: DeepPartial<User> =
			this.mapUserDtoToUserPartial(updateUserDto)

		const user = await this.findOne(id)

		this.userRepository.merge(user, userPartial)
		await this.userRepository.save(user)
	}

	async findAll(): Promise<User[]> {
		return await this.userRepository.find({
			select: ['id', 'name', 'email', 'status'],
			where: { status: true }
		})
	}

	async findOne(id: number): Promise<User> {
		const User = await this.userRepository.findOne({
			select: ['id', 'name', 'email', 'status'],
			where: { id }
		})

		if (!id) {
			throw new NotFoundException(`Não achei um User com o id ${id}`)
		}
		return User
	}

	async findEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOne({
			select: ['id', 'name', 'email', 'status', 'password'],
			where: { email }
		})

		if (!user) {
			throw new NotFoundException(`Não achei um User com o Email: ${email}`)
		}
		return user
	}
	async remove(id: number): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um User com o id ${id}`)
		}
		this.userRepository.softDelete({ id })
	}

	private mapUserDtoToUserPartial(
		createUserDto: CreateUserDto | UpdateUserDto
	): DeepPartial<User> {
		return {
			name: createUserDto.name,
			email: createUserDto.email,
			password: createUserDto.password,
			status: createUserDto.status
		}
	}
}
