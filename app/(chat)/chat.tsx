import { useChatStore } from '@/store/chatStore'
import { router, useGlobalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Text,
  TextInput,
  View,
  Button,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { formatDate } from '@/utils/date-helpers'

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
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={32} color="grey" />
      </TouchableOpacity>
      <View className="flex flex-row items-center justify-center">
        <Text className=" content-around text-lg text-center text-gray-600 bg-yellow-300 w-[40%] rounded-lg">
          {participant?.name || ''}
        </Text>
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        bottomOffset={60}
        contentContainerClassName="flex-1"
      >
        <View className="px-2 bg-white">
          {chatMessages.map((message) => {
            const bubbleStyle = message.isSenderBaseParticipant
              ? 'bg-blue-300 self-end'
              : 'bg-pink-200 self-start'
            return (
              <View
                className={`flex flex-col p-2 my-2 rounded-lg ${bubbleStyle}`}
                key={message.timeSent}
              >
                <Text className="text-xs text-gray-900">
                  {formatDate(message.timeSent)}
                </Text>
                <Text className="text-lg">{message.message}</Text>
              </View>
            )
          })}
        </View>
      </KeyboardAwareScrollView>
      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View className="border-red-500 px-2">
          <View className="flex flex-row items-center justify-between bg-white border-slate-200 border rounded-lg">
            <TextInput
              className="flex-1 p-2 w-[90%]"
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
