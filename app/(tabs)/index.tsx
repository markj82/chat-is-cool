import { useChatStore } from '@/store/chatStore'
import { useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function Chats() {
  const { messages } = useChatStore()
  const [allChatsPreview, setAllChatsPreview] = useState()

  useEffect(() => {
    const getLastMessages = (messages) => {
      const allChatsSummary = messages.reduce((acc, message) => {
        const { conversationId, timeSent, message: lastMessage } = message
        const { name } = message.participants.find(
          (participant) => participant.baseParticipant === false
        )
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
            name,
            lastMessage,
            lastMessageTime: timeSent,
          })
        }
        return acc
      }, [])
      setAllChatsPreview(allChatsSummary)
    }

    if (messages?.length) {
      getLastMessages(messages)
    }
  }, [messages])

  const handleNavigateToChat = () => {
    console.log('navigate to chat')
  }

  const renderMessagePreview = (item) => (
    <TouchableOpacity onPress={() => handleNavigateToChat()}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
      <Text style={{ fontSize: 14, fontWeight: '400' }}>
        {item.lastMessage}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={allChatsPreview}
        renderItem={({ item }) => renderMessagePreview(item)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
