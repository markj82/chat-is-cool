import { useChatStore } from '@/store/chatStore'
import { StyleSheet, Text, View } from 'react-native'

export default function Settings() {
  const { userName } = useChatStore()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {userName}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
