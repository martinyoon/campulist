// ============================================================
// 알림2 데이터 레이어 — 독립된 localStorage 기반 CRUD
// 기존 api.ts 알림 함수와 완전 분리.
// Phase B에서 Supabase로 교체.
// ============================================================

import type { Notification, NotificationType } from './types';

const KEY_NOTIFS = 'c2_notifs';
const KEY_READ = 'c2_notif_read';

// ─── 내부 헬퍼 ───

function readNotifs(): Notification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_NOTIFS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeNotifs(notifs: Notification[]): void {
  try { localStorage.setItem(KEY_NOTIFS, JSON.stringify(notifs)); }
  catch { /* storage full */ }
}

function readReadIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_READ);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeReadIds(ids: string[]): void {
  try { localStorage.setItem(KEY_READ, JSON.stringify(ids)); }
  catch { /* storage full */ }
}

// ─── 공개 함수 ───

/** 내 알림 (최신순) — userId로 필터링 */
export function getNotif2All(userId: string): Notification[] {
  return readNotifs()
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** 내 안읽음 수 — userId로 필터링 */
export function getNotif2UnreadCount(userId: string): number {
  if (typeof window === 'undefined') return 0;
  const readIds = readReadIds();
  return readNotifs()
    .filter(n => n.userId === userId && !n.isRead && !readIds.includes(n.id))
    .length;
}

/** 단건 읽음 처리 */
export function markNotif2Read(id: string): void {
  const readIds = readReadIds();
  if (readIds.includes(id)) return;
  readIds.push(id);
  writeReadIds(readIds);
  window.dispatchEvent(new Event('notif2Update'));
}

/** 전체 읽음 처리 — userId 기준 */
export function markNotif2AllRead(userId: string): void {
  const myIds = readNotifs().filter(n => n.userId === userId).map(n => n.id);
  const readIds = readReadIds();
  const merged = [...new Set([...readIds, ...myIds])];
  writeReadIds(merged);
  window.dispatchEvent(new Event('notif2Update'));
}

/** 알림 생성 — 반드시 받는 사람(userId) 지정 */
export function createNotif2(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}): void {
  const notif: Notification = {
    id: `n2-${Date.now()}`,
    userId: input.userId,
    type: input.type,
    title: input.title,
    body: input.body || null,
    link: input.link || null,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  const notifs = readNotifs();
  notifs.push(notif);
  writeNotifs(notifs);
  window.dispatchEvent(new Event('notif2Update'));
}

/** 알림이 읽었는지 판별 */
export function isNotif2Read(notif: Notification): boolean {
  if (notif.isRead) return true;
  return readReadIds().includes(notif.id);
}
