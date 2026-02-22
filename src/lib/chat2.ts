// ============================================================
// 채팅2 데이터 레이어 — 독립된 localStorage 기반 CRUD
// 기존 api.ts 채팅 함수와 완전 분리. overrides 패턴 없음.
// Phase B에서 Supabase로 교체.
// ============================================================

import type { ChatRoom, ChatMessage, UserSummary } from './types';
import { createNotif2 } from './notification2';

const KEY_ROOMS = 'c2_rooms';
const KEY_MESSAGES = 'c2_messages';

// ─── 내부 헬퍼 ───

function readRooms(): ChatRoom[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_ROOMS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeRooms(rooms: ChatRoom[]): void {
  try { localStorage.setItem(KEY_ROOMS, JSON.stringify(rooms)); }
  catch { /* storage full */ }
}

function readMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeMessages(msgs: ChatMessage[]): void {
  try { localStorage.setItem(KEY_MESSAGES, JSON.stringify(msgs)); }
  catch { /* storage full */ }
}

// ─── 공개 함수 ───

/** 내 채팅방 목록 (최신순) */
export function getChat2Rooms(userId: string): ChatRoom[] {
  return readRooms()
    .filter(r => r.buyerId === userId || r.otherUser.id === userId)
    .sort((a, b) => {
      const at = a.lastMessageAt || a.createdAt;
      const bt = b.lastMessageAt || b.createdAt;
      return new Date(bt).getTime() - new Date(at).getTime();
    });
}

/** 단일 채팅방 조회 */
export function getChat2Room(roomId: string): ChatRoom | null {
  return readRooms().find(r => r.id === roomId) || null;
}

/** 게시글별 기존 채팅 찾기 */
export function findChat2ByPost(postId: string, buyerId: string): ChatRoom | null {
  return readRooms().find(r => r.postId === postId && r.buyerId === buyerId) || null;
}

/** 유저별 기존 채팅 찾기 */
export function findChat2ByUser(targetId: string, myId: string): ChatRoom | null {
  return readRooms().find(r =>
    (r.otherUser.id === targetId && r.buyerId === myId) ||
    (r.buyerId === targetId && r.otherUser.id === myId)
  ) || null;
}

/** 채팅방 생성 + 선택적 첫 메시지 */
export function createChat2Room(input: {
  postId: string;
  postTitle: string;
  postPrice: number | null;
  postThumbnail: string | null;
  buyerId: string;
  otherUser: UserSummary;
  autoMessage?: { senderId: string; content: string };
}): ChatRoom {
  const now = new Date().toISOString();
  const room: ChatRoom = {
    id: `c2-${Date.now()}`,
    postId: input.postId,
    postTitle: input.postTitle,
    postPrice: input.postPrice,
    postThumbnail: input.postThumbnail,
    buyerId: input.buyerId,
    otherUser: input.otherUser,
    lastMessage: input.autoMessage?.content ?? null,
    lastMessageAt: input.autoMessage ? now : null,
    unreadCount: 0,
    createdAt: now,
  };

  const rooms = readRooms();
  rooms.push(room);
  writeRooms(rooms);

  if (input.autoMessage) {
    const msg: ChatMessage = {
      id: `c2m-${Date.now()}`,
      roomId: room.id,
      senderId: input.autoMessage.senderId,
      content: input.autoMessage.content,
      imageUrl: null,
      isRead: false,
      createdAt: now,
    };
    const msgs = readMessages();
    msgs.push(msg);
    writeMessages(msgs);

    // 받는 사람 = 보낸 사람이 아닌 쪽
    const recipientId = input.autoMessage.senderId === input.buyerId
      ? input.otherUser.id
      : input.buyerId;

    // 받는 사람의 unreadCount +1
    const rooms2 = readRooms();
    const idx = rooms2.findIndex(r => r.id === room.id);
    if (idx >= 0) {
      rooms2[idx].unreadCount = 1;
      writeRooms(rooms2);
    }

    // 받는 사람에게만 채팅 알림 생성
    createNotif2({
      userId: recipientId,
      type: 'chat',
      title: '새 채팅이 도착했습니다',
      body: input.autoMessage.content.slice(0, 50),
      link: `/chat2/${room.id}`,
    });
  }

  return room;
}

/** 메시지 목록 */
export function getChat2Messages(roomId: string): ChatMessage[] {
  return readMessages()
    .filter(m => m.roomId === roomId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/** 메시지 전송 + lastMessage 갱신 */
export function sendChat2Message(roomId: string, senderId: string, content: string): ChatMessage {
  const now = new Date().toISOString();
  const msg: ChatMessage = {
    id: `c2m-${Date.now()}`,
    roomId,
    senderId,
    content,
    imageUrl: null,
    isRead: false,
    createdAt: now,
  };

  // 메시지 저장
  const msgs = readMessages();
  msgs.push(msg);
  writeMessages(msgs);

  // 채팅방 lastMessage 갱신 + 받는 사람 unreadCount +1
  const rooms = readRooms();
  const idx = rooms.findIndex(r => r.id === roomId);
  if (idx >= 0) {
    const room = rooms[idx];
    room.lastMessage = content;
    room.lastMessageAt = now;
    room.unreadCount += 1;
    writeRooms(rooms);

    // 받는 사람 = 보낸 사람이 아닌 쪽
    const recipientId = senderId === room.buyerId
      ? room.otherUser.id
      : room.buyerId;

    // 받는 사람에게만 채팅 알림 생성
    createNotif2({
      userId: recipientId,
      type: 'chat',
      title: '새 메시지가 도착했습니다',
      body: content.slice(0, 50),
      link: `/chat2/${roomId}`,
    });
  }

  return msg;
}

/** 안읽음 총합 */
export function getChat2UnreadCount(userId: string): number {
  return readRooms()
    .filter(r => r.buyerId === userId || r.otherUser.id === userId)
    .reduce((sum, r) => sum + r.unreadCount, 0);
}

/** 읽음 처리 */
export function clearChat2Unread(roomId: string): void {
  const rooms = readRooms();
  const idx = rooms.findIndex(r => r.id === roomId);
  if (idx >= 0) {
    rooms[idx].unreadCount = 0;
    writeRooms(rooms);
  }
}
