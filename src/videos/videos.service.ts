import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Video } from './entities/video.entity'
import { Repository } from 'typeorm'

import * as ffmpeg from 'fluent-ffmpeg'
import * as path from 'path'
import * as fs from 'fs'

ffmpeg.setFfmpegPath(
	'C:\\Projects\\Repository\\ffmpeg-master-latest-win64-gpl\\bin\\ffmpeg.exe'
)

@Injectable()
export class VideosService {
	constructor(
		@InjectRepository(Video)
		private readonly repository: Repository<Video>
	) {}

	async create(
		createVideoDto: CreateVideoDto,
		video: Express.Multer.File
	): Promise<Video> {
		createVideoDto.videoId = await this.convertVideoToGif(
			createVideoDto.title,
			video,
			createVideoDto.user as unknown as number
		)

		const createVideo = this.repository.create(createVideoDto)

		return await this.repository.save(createVideo)
	}

	async findAll(): Promise<Video[]> {
		const queryBuilder = this.repository.createQueryBuilder('video')
		queryBuilder.leftJoinAndSelect('video.user', 'user')
		queryBuilder.select([
			'video.id',
			'video.title',
			'video.videoId',
			'video.status',
			'user.id',
			'user.name'
		])

		return queryBuilder.getMany()
	}

	async findOne(id: number): Promise<Video> {
		const queryBuilder = this.repository.createQueryBuilder('video')
		queryBuilder.leftJoinAndSelect('video.user', 'user')
		queryBuilder.select([
			'video.id',
			'video.title',
			'video.videoId',
			'video.status',
			'user.id',
			'user.name'
		])
		queryBuilder.where('video.id = :id', { id: id })

		return queryBuilder.getOne()
	}

	async findByUserId(id: number): Promise<Video[]> {
		return await this.repository.find({
			where: {
				user: {
					id
				}
			}
		})
	}

	async update(id: number, updateVideoDto: UpdateVideoDto): Promise<any> {
		const video = await this.findOne(id)

		if (!video) {
			throw new NotFoundException(`Não achei um video com o id ${id}`)
		}

		this.repository.merge(video, updateVideoDto)
		await this.repository.save(video)
	}

	async remove(id: number): Promise<any> {
		const video = await this.findOne(id)

		if (!video) {
			throw new NotFoundException(`Não achei um video com o id ${id}`)
		}
		this.repository.softDelete({ id })
	}

	async convertVideoToGif(
		videoName: string,
		video: Express.Multer.File,
		userId: number
	): Promise<string> {
		const userDir = path.join(__dirname, '..', '..', 'uploads', `${userId}`)

		if (!fs.existsSync(userDir)) {
			fs.mkdirSync(userDir, { recursive: true })
		}

		const gifFileName = `${videoName.replace(/\.[^/.]+$/, '')}.gif`
		const outputPath = path.join(userDir, gifFileName)

		return new Promise((resolve, reject) => {
			ffmpeg(video.path)
				.toFormat('gif')
				.output(outputPath)
				.on('end', () => {
					console.log('GIF creado:', outputPath)
					resolve(gifFileName)
				})
				.on('error', (err) => {
					console.error('Erro na conversão:', err)
					reject(err)
				})
				.run()
		})
	}

	async getUserGIFs(userId: number): Promise<string[]> {
		const userDir = path.join(
			__dirname,
			'..',
			'..',
			'uploads',
			userId.toString()
		)

		if (!fs.existsSync(userDir)) {
			throw new NotFoundException(`Pasta do usuário ${userId} não encontrada.`)
		}

		const files = fs.readdirSync(userDir)

		const gifs = files.filter((file) => file.endsWith('.gif'))
		return gifs.map((gif) => path.join('uploads', userId.toString(), gif))
	}

	async getGifByVideoId(videoId: number): Promise<string | null> {
		const video = await this.findOne(videoId)
		if (!video) {
			throw new NotFoundException(`Vídeo com id ${videoId} não encontrado.`)
		}

		const userDir = path.join(
			__dirname,
			'..',
			'..',
			'uploads',
			`${video.user.id}`
		)
		const gifFileName = `${video.title.replace(/\.[^/.]+$/, '')}.gif`
		const outputPath = path.join(userDir, gifFileName)

		if (fs.existsSync(outputPath)) {
			return path.join('uploads', video.user.id.toString(), gifFileName)
		}

		return null
	}
}
