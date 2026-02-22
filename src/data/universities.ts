import type { University } from '@/lib/types';

export const universities: University[] = [
  { id: 4, name: 'KAIST', slug: 'kaist', nameEn: 'Korea Advanced Institute of Science and Technology', domain: 'kaist.ac.kr', region: '대전 유성', logoUrl: null, isActive: true },
  { id: 5, name: '한예종', slug: 'karts', nameEn: 'Korea National University of Arts', domain: 'karts.ac.kr', region: '서울 석관', logoUrl: null, isActive: true },
  { id: 1, name: '서울대학교', slug: 'snu', nameEn: 'Seoul National University', domain: 'snu.ac.kr', region: '서울 관악', logoUrl: null, isActive: true },
  { id: 2, name: '연세대학교', slug: 'yonsei', nameEn: 'Yonsei University', domain: 'yonsei.ac.kr', region: '서울 신촌', logoUrl: null, isActive: true },
  { id: 3, name: '고려대학교', slug: 'korea', nameEn: 'Korea University', domain: 'korea.ac.kr', region: '서울 안암', logoUrl: null, isActive: true },
];
