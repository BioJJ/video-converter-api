import { Injectable } from '@nestjs/common'
import { compareSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserToken } from './models/UserToken'
import { UserPayload } from './models/UserPayload'
import { UsersService } from 'src/users/users.service'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class AuthService {
	constructor(
		private readonly personService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async login(user: User): Promise<UserToken> {
		const payload: UserPayload = {
			sub: user.id,
			email: user.email,
			name: user.name
		}

		return {
			access_token: this.jwtService.sign(payload),
			sub: user.id,
			email: user.email,
			name: user.name
		}
	}

	async validateUser(email: string, password: string) {
		let user: User
		try {
			user = await this.personService.findEmail(email)
		} catch (error) {
			return null
		}

		const isPasswordValid = compareSync(password, user.password)
		if (!isPasswordValid) return null

		return user
	}
}
