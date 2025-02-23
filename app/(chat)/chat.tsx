import { useChatStore } from '@/store/chatStore'
import { useGlobalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Button,
} from 'react-native'

export default function ChatScreen() {
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const { messages, updateMessage } = useChatStore()
  const [participantName, setParticipantName] = useState('')
  const params = useGlobalSearchParams()
  const chatId = params?.conversationId

  useEffect(() => {
    const filteredMessages = messages.filter(
      (message) => message.conversationId === chatId
    )
    setChatMessages(filteredMessages)
    const participantName = filteredMessages[0].participants.find(
      (participant) => participant.baseParticipant === false
    ).name
    setParticipantName(participantName)
  }, [messages])

  const handleSendMessage = () => {
    updateMessage(newMessage, chatId, true)
    setNewMessage('')
  }

  return (
    <View style={styles.container}>
      <Text>{participantName}</Text>
      {/* todo improve keyboard avoiding view */}
      <KeyboardAvoidingView>
        <FlatList
          style={{ borderColor: 'blue', borderWidth: 1 }}
          data={chatMessages}
          renderItem={({ item }) => {
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
        <View
          style={{
            borderColor: 'red',
            borderWidth: 1,
          }}
        >
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
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
