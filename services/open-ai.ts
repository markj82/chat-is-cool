import axios from 'axios'

const OPENAI_KEY = process.env.EXPO_PUBLIC_OPEN_AI_API

const instance = axios.create({
  baseURL: 'https://api.openai.com/v1/chat/completions',

  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_KEY}`,
  },
})

export const generateResponse = async (message: string) => {
  try {
    const response = await instance.post('', {
      messages: [
        {
          role: 'user',
          content: `
                You are a helpful friend and you are chatting inside a chat app, respond to the message in a short manner.
            ${message}`,
        },
      ],
      max_tokens: 512,
      model: 'gpt-4o',
    })
    return response.data.choices[0].message.content
  } catch (error) {
    console.error(error)
    return ''
  }
}
