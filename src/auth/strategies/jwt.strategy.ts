import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserFromJwt } from '../models/UserFromJwt'
import { UserPayload } from '../models/UserPayload'
import { PassportStrategy } from '@nestjs/passport'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET_KEY
		})
	}

	async validate(payload: UserPayload): Promise<UserFromJwt> {
		return { id: payload.sub, email: payload.email, name: payload.name }
	}
}
