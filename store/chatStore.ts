import { create } from 'zustand'
import { zustandStorage } from './mmkv'
import { createJSONStorage, persist } from 'zustand/middleware'

const participantsInit = [
  {
    name: 'John',
    participantId: '002',
    baseParticipant: false,
  },
  {
    name: 'Jane',
    participantId: '003',
    baseParticipant: false,
  },
  {
    name: 'Alice',
    participantId: '004',
    baseParticipant: false,
  },
  {
    name: 'Bob',
    participantId: '005',
    baseParticipant: false,
  },
  {
    name: 'Charlie',
    participantId: '006',
    baseParticipant: false,
  },
  {
    name: 'David',
    participantId: '007',
    baseParticipant: false,
  },
  {
    name: 'Eve',
    participantId: '008',
    baseParticipant: false,
  },
  {
    name: 'Frank',
    participantId: '009',
    baseParticipant: false,
  },
  {
    name: 'Grace',
    participantId: '010',
    baseParticipant: false,
  },
  {
    name: 'Heidi',
    participantId: '011',
    baseParticipant: false,
  },
  {
    name: 'Ivan',
    participantId: '012',
    baseParticipant: false,
  },
  {
    name: 'Judy',
    participantId: '013',
    baseParticipant: false,
  },
  {
    name: 'Kevin',
    participantId: '014',
    baseParticipant: false,
  },
  {
    name: 'Lana',
    participantId: '015',
    baseParticipant: false,
  },
  {
    name: 'Morgan',
    participantId: '016',
    baseParticipant: false,
  },
  {
    name: 'Nancy',
    participantId: '017',
    baseParticipant: false,
  },
  {
    name: 'Oscar',
    participantId: '018',
    baseParticipant: false,
  },
  {
    name: 'Peter',
    participantId: '019',
    baseParticipant: false,
  },
  {
    name: 'Quinn',
    participantId: '020',
    baseParticipant: false,
  },
  {
    name: 'Rose',
    participantId: '021',
    baseParticipant: false,
  },
  {
    name: 'Steve',
    participantId: '022',
    baseParticipant: false,
  },
  {
    name: 'Tina',
    participantId: '023',
    baseParticipant: false,
  },
  {
    name: 'Ursula',
    participantId: '024',
    baseParticipant: false,
  },
]

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
    isSenderBaseParticipant: true,
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
    isSenderBaseParticipant: false,
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
    isSenderBaseParticipant: true,
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
    isSenderBaseParticipant: false,
  },
]

export const useChatStore = create<any>()(
  persist(
    (set) => ({
      userName: 'Marek',
      messages: messagesInit,
      otherUsers: participantsInit,
      createNewMessage: () => {},
      updateMessage: (
        message: string,
        conversationId: string,
        isSenderBaseParticipant: boolean
      ) =>
        set((state: any) => {
          return {
            messages: [
              ...state.messages,
              {
                conversationId,
                participants: [
                  ...state.messages.find(
                    (message) => message.conversationId === conversationId
                  ).participants,
                ],
                timeSent: new Date().toISOString(),
                message,
                isSenderBaseParticipant,
              },
            ],
          }
        }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
