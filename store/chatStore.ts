import { create } from 'zustand'

const messagesInit = [
  {
    conversationId: 'conv-1',

    participants: [
      {
        name: 'Marek',
        participantId: '001',
        baseParticipant: true,
      },
      {
        name: 'John',
        participantId: '002',
        baseParticipant: false,
      },
    ],
    timeSent: '2021-08-19T09:02:00.000Z',
    message: 'Hello, how are you?',
  },
  {
    conversationId: 'conv-1',
    participants: [
      {
        name: 'John',
        participantId: '002',
        baseParticipant: false,
      },
      {
        name: 'Marek',
        participantId: '001',
        baseParticipant: true,
      },
    ],
    timeSent: '2021-08-29T09:02:30.000Z',
    message: 'I am fine, thank you!',
  },
  {
    conversationId: 'conv-2',
    participants: [
      {
        name: 'Marek',
        participantId: '001',
        baseParticipant: true,
      },
      {
        name: 'Jane',
        participantId: '003',
        baseParticipant: false,
      },
    ],
    timeSent: '2021-08-24T09:02:00.000Z',
    message: 'How was your weekend?',
  },
  {
    conversationId: 'conv-2',
    participants: [
      {
        name: 'Jane',
        participantId: '003',
        baseParticipant: false,
      },
      {
        name: 'Marek',
        participantId: '001',
        baseParticipant: true,
      },
    ],
    timeSent: '2021-08-25T09:02:30.000Z',
    message: 'It was great, thank you!',
  },
]

export const useChatStore = create((set) => ({
  messages: messagesInit,
  createNewMessage: () => {},
  updateMessage: () => {},
}))
