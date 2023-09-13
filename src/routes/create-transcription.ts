import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'
import { createReadStream } from "fs";
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
	app.post('/videos/:videoId/transcription', async (request, reply) => {

		const paramsSchema = z.object({
			videoId: z.string().uuid(),
		})

		const { videoId } = paramsSchema.parse(request.params)
		const bodySchema = z.object({ prompt: z.string(), })

		const { prompt } = bodySchema.parse(request.body)

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			}
		})

		const videoPath = video.path
		const audioReadStream = createReadStream(videoPath)

		const response = await createTranscription(audioReadStream, prompt, 0)
		const transcription = response.text

		if (!transcription) {
			return reply.status(400).send({ message: 'error in create transcription', response: response })
		}

		await prisma.video.update({
			where: {
				id: videoId,
			},
			data: {
				transcription: transcription
			}
		})

		return { transcription }

	})
}


async function createTranscription(audio, prompt, temperature) {

	try {
		return await openai.audio.transcriptions.create({
			file: audio,
			model: 'whisper-1',
			language: 'pt',
			response_format: 'json',
			temperature,
			prompt,
		})
	} catch (error) {
		console.error(error);
		return error
	}

}