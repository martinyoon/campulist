import type { ChatRoom, ChatMessage } from '@/lib/types';

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'chat-1',
    postId: 'p1',
    postTitle: '맥북 에어 M3 팝니다',
    postPrice: 1450000,
    postThumbnail: 'https://picsum.photos/seed/macbook1/100/100',
    otherUser: { id: 'u6', nickname: '태현이네', avatarUrl: null, isVerified: true, mannerTemp: 37.5, tradeCount: 6 },
    lastMessage: '혹시 가격 네고 가능할까요?',
    lastMessageAt: '2026-02-20T11:55:00Z',
    unreadCount: 2,
    createdAt: '2026-02-20T11:30:00Z',
  },
  {
    id: 'chat-2',
    postId: 'p2',
    postTitle: '경영학원론 교재 판매',
    postPrice: 15000,
    postThumbnail: 'https://picsum.photos/seed/post3/100/100',
    otherUser: { id: 'u7', nickname: '솔이맘', avatarUrl: null, isVerified: true, mannerTemp: 38.9, tradeCount: 18 },
    lastMessage: '내일 정문에서 거래 가능합니다!',
    lastMessageAt: '2026-02-20T10:00:00Z',
    unreadCount: 0,
    createdAt: '2026-02-19T14:00:00Z',
  },
  {
    id: 'chat-3',
    postId: 'p6',
    postTitle: '관악 원룸 양도 (보증금 300/월 35)',
    postPrice: 350000,
    postThumbnail: 'https://picsum.photos/seed/room1/100/100',
    otherUser: { id: 'u5', nickname: '하나둘셋', avatarUrl: null, isVerified: true, mannerTemp: 40.2, tradeCount: 25 },
    lastMessage: '실사 가능한 시간이 언제일까요?',
    lastMessageAt: '2026-02-20T08:00:00Z',
    unreadCount: 0,
    createdAt: '2026-02-19T09:00:00Z',
  },
  {
    id: 'chat-4',
    postId: 'p26',
    postTitle: '기타 레슨 (초급~중급)',
    postPrice: 30000,
    postThumbnail: 'https://picsum.photos/seed/post8/100/100',
    otherUser: { id: 'u6', nickname: '태현이네', avatarUrl: null, isVerified: true, mannerTemp: 37.5, tradeCount: 6 },
    lastMessage: '수업 시간 조율 부탁드려요',
    lastMessageAt: '2026-02-19T20:00:00Z',
    unreadCount: 1,
    createdAt: '2026-02-18T15:00:00Z',
  },
];

export const mockChatMessages: Record<string, ChatMessage[]> = {
  'chat-1': [
    { id: 'msg-1-1', roomId: 'chat-1', senderId: 'u6', content: '안녕하세요! 맥북 아직 판매 중이신가요?', imageUrl: null, isRead: true, createdAt: '2026-02-20T11:30:00Z' },
    { id: 'msg-1-2', roomId: 'chat-1', senderId: 'u1', content: '네, 아직 판매 중입니다!', imageUrl: null, isRead: true, createdAt: '2026-02-20T11:32:00Z' },
    { id: 'msg-1-3', roomId: 'chat-1', senderId: 'u6', content: '상태가 어떤가요? 기스 있나요?', imageUrl: null, isRead: true, createdAt: '2026-02-20T11:35:00Z' },
    { id: 'msg-1-4', roomId: 'chat-1', senderId: 'u1', content: '기스 전혀 없이 깨끗합니다. 배터리 사이클도 50회 정도예요.', imageUrl: null, isRead: true, createdAt: '2026-02-20T11:38:00Z' },
    { id: 'msg-1-5', roomId: 'chat-1', senderId: 'u6', content: '혹시 가격 네고 가능할까요?', imageUrl: null, isRead: false, createdAt: '2026-02-20T11:55:00Z' },
    { id: 'msg-1-6', roomId: 'chat-1', senderId: 'u6', content: '130만원 정도면 바로 거래 가능합니다!', imageUrl: null, isRead: false, createdAt: '2026-02-20T11:55:30Z' },
  ],
  'chat-2': [
    { id: 'msg-2-1', roomId: 'chat-2', senderId: 'u1', content: '안녕하세요, 경영학원론 교재 상태 어떤가요?', imageUrl: null, isRead: true, createdAt: '2026-02-19T14:00:00Z' },
    { id: 'msg-2-2', roomId: 'chat-2', senderId: 'u7', content: '밑줄 약간 있지만 깨끗한 편이에요!', imageUrl: null, isRead: true, createdAt: '2026-02-19T14:10:00Z' },
    { id: 'msg-2-3', roomId: 'chat-2', senderId: 'u1', content: '좋아요, 내일 거래 가능할까요?', imageUrl: null, isRead: true, createdAt: '2026-02-19T14:15:00Z' },
    { id: 'msg-2-4', roomId: 'chat-2', senderId: 'u7', content: '내일 정문에서 거래 가능합니다!', imageUrl: null, isRead: true, createdAt: '2026-02-20T10:00:00Z' },
  ],
  'chat-3': [
    { id: 'msg-3-1', roomId: 'chat-3', senderId: 'u1', content: '원룸 양도 글 보고 연락드립니다.', imageUrl: null, isRead: true, createdAt: '2026-02-19T09:00:00Z' },
    { id: 'msg-3-2', roomId: 'chat-3', senderId: 'u5', content: '안녕하세요! 관심 가져주셔서 감사합니다.', imageUrl: null, isRead: true, createdAt: '2026-02-19T09:10:00Z' },
    { id: 'msg-3-3', roomId: 'chat-3', senderId: 'u1', content: '3월 초에 입주 가능할까요?', imageUrl: null, isRead: true, createdAt: '2026-02-19T09:15:00Z' },
    { id: 'msg-3-4', roomId: 'chat-3', senderId: 'u5', content: '네, 3월 1일부터 가능합니다.', imageUrl: null, isRead: true, createdAt: '2026-02-19T09:20:00Z' },
    { id: 'msg-3-5', roomId: 'chat-3', senderId: 'u5', content: '실사 가능한 시간이 언제일까요?', imageUrl: null, isRead: true, createdAt: '2026-02-20T08:00:00Z' },
  ],
  'chat-4': [
    { id: 'msg-4-1', roomId: 'chat-4', senderId: 'u1', content: '기타 레슨 문의드립니다. 완전 초보인데 가능할까요?', imageUrl: null, isRead: true, createdAt: '2026-02-18T15:00:00Z' },
    { id: 'msg-4-2', roomId: 'chat-4', senderId: 'u6', content: '물론이죠! 초보분들도 많이 가르쳐봤어요.', imageUrl: null, isRead: true, createdAt: '2026-02-18T15:10:00Z' },
    { id: 'msg-4-3', roomId: 'chat-4', senderId: 'u1', content: '주말에 수업 가능할까요?', imageUrl: null, isRead: true, createdAt: '2026-02-18T15:20:00Z' },
    { id: 'msg-4-4', roomId: 'chat-4', senderId: 'u6', content: '수업 시간 조율 부탁드려요', imageUrl: null, isRead: false, createdAt: '2026-02-19T20:00:00Z' },
  ],
};

export function getChatRoom(roomId: string): ChatRoom | null {
  return mockChatRooms.find(r => r.id === roomId) || null;
}

export function getChatMessages(roomId: string): ChatMessage[] {
  return mockChatMessages[roomId] || [];
}
