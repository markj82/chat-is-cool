import { useChatStore } from '@/store/chatStore'
import { useGlobalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'

export default function ChatScreen() {
  const [chatMessages, setChatMessages] = useState([])
  const { messages } = useChatStore()
  const params = useGlobalSearchParams()
  const chatId = params?.conversationId

  useEffect(() => {
    const filteredMessages = messages.filter(
      (message) => message.conversationId === chatId
    )
    setChatMessages(filteredMessages)
  }, [messages])

  return (
    <View>
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{item.message}</Text>
            </View>
          )
        }}
      />
    </View>
  )
}
