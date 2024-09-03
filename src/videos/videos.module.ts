import { Module } from '@nestjs/common'
import { VideosService } from './videos.service'
import { VideosController } from './videos.controller'
import { Video } from './entities/video.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'

@Module({
	imports: [
		TypeOrmModule.forFeature([Video]),
		MulterModule.register({
			dest: './uploads'
		})
	],
	controllers: [VideosController],
	providers: [VideosService]
})
export class VideosModule {}
