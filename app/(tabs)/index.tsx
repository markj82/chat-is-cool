import { useChatStore } from '@/store/chatStore'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function Chats() {
  const { messages, otherUsers } = useChatStore()
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
        return acc.sort(
          (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        )
      }, [])
      setAllChatsPreview(allChatsSummary)
    }

    if (messages?.length) {
      getLastMessages(messages)
    }
  }, [messages])

  const handleNavigateToChat = (id: string) => {
    router.push({
      pathname: '/(chat)/chat',
      params: { conversationId: id },
    })
  }

  const renderMessagePreview = (item) => (
    <TouchableOpacity
      style={{ borderColor: 'green', borderWidth: 1, padding: 10 }}
      onPress={() => handleNavigateToChat(item.conversationId)}
      key={item.conversationId}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
      <Text style={{ fontSize: 14, fontWeight: '400' }}>
        {item.lastMessage}
      </Text>
    </TouchableOpacity>
  )

  const renderOtherUsers = (item) => (
    <TouchableOpacity
      style={{ borderColor: 'green', borderWidth: 1, padding: 7 }}
      key={item.participantId}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        style={{ borderColor: 'red', borderWidth: 1, height: '10%' }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={otherUsers}
        renderItem={({ item }) => renderOtherUsers(item)}
      />
      <FlatList
        style={{
          borderColor: 'blue',
          borderWidth: 1,
          height: '90%',
          width: '100%',
        }}
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
    backgroundColor: '#fff',
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
