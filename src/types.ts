export interface ChatMessage {
  message: string
  timestamp: number
  sender: ChatUser
}
export interface ChatUser {
  id: string
  nickname: string
  avatar: string
}
