import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { ObjectId } from 'mongoose';
import { Message } from '../../libs/enums/common.enum';
import { AiChatInput } from '../../libs/dto/ai-chat/ai-chat.input';
import { AiChatResponse } from '../../libs/dto/ai-chat/ai-chat';

@Injectable()
export class AiChatService {
	constructor(private readonly httpService: HttpService) {}

	public async askAiChat(memberId: ObjectId, input: AiChatInput): Promise<AiChatResponse> {
		const systemPrompt = [
			'You are MedBook assistant for patients only.',
			'Provide general, safe health guidance only.',
			'Do not provide diagnosis or definitive treatment plans.',
			'If symptoms are severe or urgent, advise emergency care immediately.',
			'Keep responses concise and practical.',
		].join(' ');

		try {
			const reply = process.env.OPENROUTER_API_KEY
				? await this.askOpenRouter(input.message, systemPrompt)
				: process.env.GEMINI_API_KEY
					? await this.askGemini(input.message, systemPrompt)
					: await this.askOpenAi(input.message, systemPrompt);

			return { reply };
		} catch (err: any) {
			const msg = err?.response?.data?.error?.message ?? err?.message ?? Message.SOMETHING_WENT_WRONG;
			console.log('Error, service. askAiChat:', msg, memberId?.toString?.());
			throw new BadRequestException(msg);
		}
	}

	private async askOpenRouter(message: string, systemPrompt: string): Promise<string> {
		const apiKey = process.env.OPENROUTER_API_KEY;
		const model = process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini';

		if (!apiKey) {
			throw new InternalServerErrorException('OPENROUTER_API_KEY is not configured');
		}

		const payload = {
			model,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: message },
			],
			temperature: 0.4,
			max_tokens: 400,
		};

		const response = await firstValueFrom(
			this.httpService.post('https://openrouter.ai/api/v1/chat/completions', payload, {
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
					'HTTP-Referer': 'http://localhost:3004',
					'X-Title': 'MedBook AI Chat',
				},
				timeout: 30000,
			}),
		);

		return (
			response?.data?.choices?.[0]?.message?.content?.trim() ||
			'I am unable to respond right now. Please try again.'
		);
	}

	private async askGemini(message: string, systemPrompt: string): Promise<string> {
		const apiKey = process.env.GEMINI_API_KEY;
		const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

		if (!apiKey) {
			throw new InternalServerErrorException('GEMINI_API_KEY is not configured');
		}

		const payload = {
			systemInstruction: {
				parts: [{ text: systemPrompt }],
			},
			contents: [
				{
					role: 'user',
					parts: [{ text: message }],
				},
			],
			generationConfig: {
				temperature: 0.4,
				maxOutputTokens: 400,
			},
		};

		const response = await firstValueFrom(
			this.httpService.post(
				`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
				payload,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					timeout: 30000,
				},
			),
		);

		return (
			response?.data?.candidates?.[0]?.content?.parts
				?.map((part: { text?: string }) => part?.text ?? '')
				.join('')
				.trim() || 'I am unable to respond right now. Please try again.'
		);
	}

	private async askOpenAi(message: string, systemPrompt: string): Promise<string> {
		const apiKey = process.env.OPENAI_API_KEY;
		const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

		if (!apiKey) {
			throw new InternalServerErrorException('Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured');
		}

		const payload = {
			model,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: message },
			],
			temperature: 0.4,
			max_tokens: 400,
		};

		const response = await firstValueFrom(
			this.httpService.post('https://api.openai.com/v1/chat/completions', payload, {
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				timeout: 30000,
			}),
		);

		return (
			response?.data?.choices?.[0]?.message?.content?.trim() ||
			'I am unable to respond right now. Please try again.'
		);
	}
}
