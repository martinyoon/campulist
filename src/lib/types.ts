// ============================================================
// 캠퍼스리스트 (Campulist) — TypeScript 타입 정의
// ============================================================

export type UserRole = 'user' | 'business' | 'admin';
export type PostStatus = 'active' | 'reserved' | 'completed' | 'hidden';
export type NotificationType = 'chat' | 'like' | 'keyword' | 'review' | 'system';
export type BizPlan = 'basic' | 'pro' | 'premium';
export type ReportReason = 'spam' | 'fraud' | 'inappropriate' | 'duplicate' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type MemberType = 'undergraduate' | 'graduate' | 'professor' | 'staff' | 'alumni' | 'merchant' | 'general';

export interface University {
  id: number;
  name: string;
  slug: string;
  nameEn: string;
  domain: string;
  region: string;
  logoUrl: string | null;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  role: UserRole;
  memberType: MemberType;
  universityId: number;
  department: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  mannerTemp: number;
  tradeCount: number;
  createdAt: string;
}

export interface UserSummary {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  isVerified: boolean;
  mannerTemp: number;
  tradeCount: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  icon: string;
  sortOrder: number;
}

export interface CategoryGroup {
  major: Category;
  minors: Category[];
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  universityId: number;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  isPremium: boolean;
  status: PostStatus;
  locationDetail: string | null;
  viewCount: number;
  likeCount: number;
  bumpedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostListItem {
  id: string;
  title: string;
  price: number | null;
  priceNegotiable: boolean;
  status: PostStatus;
  thumbnail: string | null;
  bodySnippet: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  bumpedAt: string;
  author: UserSummary;
  university: Pick<University, 'id' | 'name' | 'slug'>;
  categoryMinor: Pick<Category, 'id' | 'name' | 'slug'>;
}

export interface PostDetail extends Post {
  author: UserSummary;
  university: Pick<University, 'id' | 'name' | 'slug'>;
  categoryMajor: Pick<Category, 'id' | 'name' | 'slug' | 'icon'>;
  categoryMinor: Pick<Category, 'id' | 'name' | 'slug'>;
  images: string[];
  tags: string[];
  isLiked: boolean;
}

export interface PostFilters {
  universitySlug?: string;
  categoryMajorSlug?: string;
  categoryMinorSlug?: string;
  query?: string;
  priceMin?: number;
  priceMax?: number;
  status?: PostStatus;
  sortBy?: 'latest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
}

export interface ChatRoom {
  id: string;
  postId: string;
  postTitle: string;
  postPrice: number | null;
  postThumbnail: string | null;
  otherUser: UserSummary;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string | null;
  imageUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface PostImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Review {
  id: string;
  postId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  postId: string | null;
  userId: string | null;
  reporterId: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
}

export interface BusinessAccount {
  id: string;
  userId: string;
  businessName: string;
  businessNumber: string;
  plan: BizPlan;
  isActive: boolean;
  createdAt: string;
}

export interface KeywordAlert {
  id: string;
  userId: string;
  keyword: string;
  universityId: number | null;
  categoryId: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostCreateInput {
  title: string;
  body: string;
  universityId: number;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  locationDetail: string | null;
  tags: string[];
  images: File[];
}
