import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages } = req.body

  const configuration = new Configuration({
    // organization: 'org-*',
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant who speaks Japanese Kansai dialect.',
        },
        ...messages,
      ],
    })
    res.status(200).json({ message: completion.data.choices[0].message })
  } catch (error: unknown) {
    const errorResponse = (error as any).response
    if (error instanceof Error) {
      if (errorResponse) {
        res
          .status(errorResponse.status)
          .json({ error: errorResponse.data.error.message })
      } else {
        res.status(500).json({ error: error.message })
      }
    }
  }
}
