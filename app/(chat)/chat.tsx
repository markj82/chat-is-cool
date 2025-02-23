import { useGlobalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function ChatScreen() {
  const params = useGlobalSearchParams()

  console.log(params.conversationId)
  return (
    <View>
      <Text>Chat Screen</Text>
    </View>
  )
}
