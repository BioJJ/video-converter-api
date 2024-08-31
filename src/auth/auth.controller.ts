import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UseGuards
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { IsPublic } from './decorators/is-public.decorator'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthRequest } from './models/AuthRequest'

@Controller()
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@IsPublic()
	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Req() req: AuthRequest) {
		return await this.authService.login(req.user)
	}
}
