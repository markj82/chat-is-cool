import { Participant, useChatStore } from '@/store/chatStore'
import { formatDate } from '@/utils/date-helpers'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

type ChatPreview = {
  conversationId: string
  name: string
  lastMessage: string
  lastMessageTime: string
}

export default function Chats() {
  const { messages, otherUsers } = useChatStore()

  const allChatsPreview = useMemo(() => {
    if (messages?.length) {
      const allChatsSummary = messages.reduce((acc: ChatPreview[], message) => {
        const { conversationId, timeSent, message: lastMessage } = message

        const participant = message.participants.find(
          (participant) => participant.baseParticipant === false
        )
        if (!participant) return acc
        const existingChat = acc.find(
          (chat) => chat.conversationId === conversationId
        )
        if (existingChat) {
          if (timeSent > existingChat.lastMessageTime) {
            existingChat.lastMessage = lastMessage
            existingChat.lastMessageTime = timeSent
          }
        } else {
          acc.push({
            conversationId,
            name: participant.name,
            lastMessage,
            lastMessageTime: timeSent,
          })
        }
        return acc.sort(
          (a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
        )
      }, [])
      return allChatsSummary
    }
    return []
  }, [messages])

  const handleNavigateToChat = (id: string, participantName: string) => {
    router.push({
      pathname: '/(chat)/chat',
      params: { conversationId: id, participantName },
    })
  }

  const handleStartNewChat = (participant: Participant) => {
    const chatWithThisParticipant = messages.find((message) => {
      const p = message.participants.find(
        (participant) => participant.baseParticipant === false
      )
      if (p) {
        return p.participantId === participant.participantId
      }
    })

    const newConversationId = uuidv4()
    router.push({
      pathname: '/(chat)/chat',
      params: {
        conversationId:
          chatWithThisParticipant?.conversationId || newConversationId,
        participantId: participant.participantId,
      },
    })
  }

  const renderMessagePreview = (chatPreviewItem: ChatPreview) => (
    <TouchableOpacity
      className="bg-blue-100 m-1 px-5 py-6 self-center rounded-lg w-[90%]"
      onPress={() =>
        handleNavigateToChat(chatPreviewItem.conversationId, 'mr-test')
      }
      key={chatPreviewItem.conversationId}
    >
      <Text className="text-sm text-gray-500 text-right">
        {formatDate(chatPreviewItem.lastMessageTime)}
      </Text>
      <Text className="text-blue-900 text-lg font-bold">
        {chatPreviewItem.name}
      </Text>
      <Text className="text-m text-gray-900">
        {chatPreviewItem.lastMessage}
      </Text>
    </TouchableOpacity>
  )

  const renderOtherUsers = (participantItem: Participant) => (
    <TouchableOpacity
      className="bg-pink-100 m-1 px-5 py-6 self-center rounded-lg"
      onPress={() => handleStartNewChat(participantItem)}
      key={participantItem.participantId}
    >
      <Text className="text-sm font-bold text-gray-700">
        {participantItem.name}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 content-center bg-white h-[10%]">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={otherUsers}
        renderItem={({ item }) => renderOtherUsers(item)}
      />
      <FlatList
        className="h-[90%]"
        data={allChatsPreview}
        renderItem={({ item }) => renderMessagePreview(item)}
      />
    </View>
  )
}
