import type { ChatRoom, ChatMessage } from '@/lib/types';

// ===== 채팅 Mock 데이터 =====
// Phase A: 빈 배열 (모든 채팅은 사용자 액션으로 localStorage에 생성됨)
// Phase B: Supabase로 교체

export const mockChatRooms: ChatRoom[] = [];

export const mockChatMessages: Record<string, ChatMessage[]> = {};

export function getChatMessages(roomId: string): ChatMessage[] {
  return mockChatMessages[roomId] || [];
}
