import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ChatPage() {
  // Phase A: Mock 채팅 데이터
  const mockChats = [
    {
      id: 'chat-1',
      postTitle: '맥북 에어 M3 팝니다',
      postThumbnail: 'https://picsum.photos/seed/post1/100/100',
      otherUser: { nickname: '연세맨', avatar: '연' },
      lastMessage: '혹시 가격 네고 가능할까요?',
      lastMessageAt: '5분 전',
      unreadCount: 2,
    },
    {
      id: 'chat-2',
      postTitle: '경영학원론 교재 판매',
      postThumbnail: 'https://picsum.photos/seed/post3/100/100',
      otherUser: { nickname: '고대사자', avatar: '고' },
      lastMessage: '내일 정문에서 거래 가능합니다!',
      lastMessageAt: '1시간 전',
      unreadCount: 0,
    },
    {
      id: 'chat-3',
      postTitle: '원룸 양도합니다 (관악구)',
      postThumbnail: 'https://picsum.photos/seed/post5/100/100',
      otherUser: { nickname: '서울학생', avatar: '서' },
      lastMessage: '실사 가능한 시간이 언제일까요?',
      lastMessageAt: '3시간 전',
      unreadCount: 0,
    },
    {
      id: 'chat-4',
      postTitle: '통기타 레슨 해드립니다',
      postThumbnail: 'https://picsum.photos/seed/post8/100/100',
      otherUser: { nickname: '음악인', avatar: '음' },
      lastMessage: '수업 시간 조율 부탁드려요',
      lastMessageAt: '어제',
      unreadCount: 1,
    },
  ];

  return (
    <div>
      {/* 헤더 */}
      <div className="border-b border-border px-4 py-4">
        <h1 className="text-xl font-bold">채팅</h1>
      </div>

      {/* 채팅 목록 */}
      {mockChats.length > 0 ? (
        <div>
          {mockChats.map(chat => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-center gap-3 border-b border-border px-4 py-3.5 transition-colors hover:bg-muted"
            >
              {/* 상대방 아바타 */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-medium">
                {chat.otherUser.avatar}
              </div>

              {/* 채팅 내용 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{chat.otherUser.nickname}</span>
                  <span className="text-xs text-muted-foreground">{chat.lastMessageAt}</span>
                </div>
                <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground/70">{chat.postTitle}</p>
              </div>

              {/* 상품 썸네일 + 읽지 않은 수 */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <img
                  src={chat.postThumbnail}
                  alt={chat.postTitle}
                  className="h-10 w-10 rounded-md object-cover"
                />
                {chat.unreadCount > 0 && (
                  <Badge className="h-5 min-w-5 justify-center bg-blue-600 px-1.5 text-[10px] text-white">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-4 py-16 text-center text-muted-foreground">
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <p className="text-lg font-medium">채팅이 없습니다</p>
          <p className="mt-2 text-sm">관심 있는 게시글에서 채팅을 시작해보세요.</p>
        </div>
      )}
    </div>
  );
}
