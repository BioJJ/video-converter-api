import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LoginValidationMiddleware } from './middlewares/login-validation.middleware'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'

@Module({
	imports: [
		ConfigModule.forRoot(),
		UsersModule,
		PassportModule,
		JwtModule.register({
			privateKey: process.env.JWT_SECRET_KEY,
			signOptions: { expiresIn: '1d' }
		})
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoginValidationMiddleware).forRoutes('login')
	}
}
