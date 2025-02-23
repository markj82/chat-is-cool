import { MMKV } from 'react-native-mmkv'
import { StateStorage } from 'zustand/middleware'

export const mmkv = new MMKV({
  id: 'chat-storage',
})

export const zustandStorage: StateStorage = {
  setItem: (name: string, value) => mmkv.set(name, value),
  getItem: (name: string) => mmkv.getString(name) ?? null,
  removeItem: (name: string) => mmkv.delete(name),
}
