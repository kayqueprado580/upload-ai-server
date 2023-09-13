import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'
// import { createReadStream } from "fs";
import { openai } from "../lib/openai";

export async function generateAICompletionRoute(app: FastifyInstance) {
	app.post('/ai/complete', async (request, reply) => {

		const bodySchema = z.object({
			videoId: z.string().uuid(),
			template: z.string(),
			temperature: z.number().min(0).max(1).default(0.5),
		})

		const { videoId, template, temperature } = bodySchema.parse(request.body)

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			}
		})

		const transcription = video.transcription
		if (!transcription) {
			return reply.status(400).send({ message: 'Video transcription was not generated yet.' })
		}
		const promptMessage = template.replace('{transcription}', transcription)
		const completions = await generateComplete(promptMessage, temperature)

		return {
			videoId,
			message: promptMessage,
			completions
		}

	})
}


async function generateComplete(content, temperature) {

	try {
		return await openai.chat.completions.create({
			model: 'gpt-3.5-turbo-16k',
			temperature,
			messages: [
				{ role: 'user', content }
			],
		})
	} catch (error) {
		console.error(error);
		return error
	}

}