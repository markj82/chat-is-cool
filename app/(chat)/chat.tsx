import { useChatStore } from '@/store/chatStore'
import { useGlobalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

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
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => {
          console.log('🌴 item: ', JSON.stringify(item))
          return (
            <View
              style={
                item.isSenderBaseParticipant
                  ? { alignItems: 'flex-end' }
                  : { alignItems: 'flex-start' }
              }
            >
              <Text>{item.timeSent}</Text>
              <Text>{item.message}</Text>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
