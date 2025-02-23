import { Participant, useChatStore } from '@/store/chatStore'
import { formatDate } from '@/utils/date-helpers'
import { router } from 'expo-router'
import { useMemo } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
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
      style={{ borderColor: 'green', borderWidth: 1, padding: 10 }}
      onPress={() =>
        handleNavigateToChat(chatPreviewItem.conversationId, 'mr-test')
      }
      key={chatPreviewItem.conversationId}
    >
      <Text>{formatDate(chatPreviewItem.lastMessageTime)}</Text>
      <Text
        className="text-red-500"
        style={{ fontSize: 16, fontWeight: '600' }}
      >
        {chatPreviewItem.name}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: '400' }}>
        {chatPreviewItem.lastMessage}
      </Text>
    </TouchableOpacity>
  )

  const renderOtherUsers = (participantItem: Participant) => (
    <TouchableOpacity
      style={{ borderColor: 'green', borderWidth: 1, padding: 7 }}
      onPress={() => handleStartNewChat(participantItem)}
      key={participantItem.participantId}
    >
      <Text>{participantItem.name}</Text>
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
