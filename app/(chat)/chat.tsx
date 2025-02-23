import { useChatStore } from '@/store/chatStore'
import { useGlobalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  FlatList,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Button,
  SafeAreaView,
  Keyboard,
} from 'react-native'
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ChatScreen() {
  const insets = useSafeAreaInsets()
  const [newMessage, setNewMessage] = useState('')
  const { messages, updateMessage, otherUsers, baseParticipant } =
    useChatStore()
  const params = useGlobalSearchParams<{
    conversationId: string
    participantId: string
  }>()
  const chatId = params?.conversationId
  const participantId = params?.participantId

  const isNewChat = Boolean(participantId)

  const chatMessages = useMemo(() => {
    return messages.filter((message) => message.conversationId === chatId)
  }, [messages])

  const participant = useMemo(() => {
    let participant = null

    if (isNewChat) {
      participant = otherUsers.find(
        (_participant) => _participant.participantId === participantId
      )
    } else {
      const firstMessage = chatMessages[0]
      participant = firstMessage?.participants.find(
        (participant) => participant.baseParticipant === false
      )
    }
    return participant
  }, [chatMessages])

  const handleSendMessage = () => {
    if (!participant) return
    updateMessage([baseParticipant, participant], newMessage, chatId, true)
    setNewMessage('')
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text>{participant?.name || ''}</Text>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bottomOffset={60}
        contentContainerClassName="flex-1"
      >
        <View className="px-2">
          {chatMessages.map((message) => {
            return (
              <View
                key={message.timeSent}
                style={
                  message.isSenderBaseParticipant
                    ? { alignItems: 'flex-end' }
                    : { alignItems: 'flex-start' }
                }
              >
                <Text>{message.timeSent}</Text>
                <Text>{message.message}</Text>
              </View>
            )
          })}
        </View>
      </KeyboardAwareScrollView>
      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View className="border-red-500 px-2">
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <TextInput
              placeholder="Type a message"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <Button title="Send" onPress={handleSendMessage} />
          </View>
        </View>
      </KeyboardStickyView>
    </SafeAreaView>
  )
}
