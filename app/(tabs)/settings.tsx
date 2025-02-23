import { useChatStore } from '@/store/chatStore'
import { Text, View } from 'react-native'

export default function Settings() {
  const { userName } = useChatStore()
  return (
    <View>
      <Text className="text-center my-11">Hello, {userName}</Text>
    </View>
  )
}
