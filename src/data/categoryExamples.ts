/**
 * 소분류별 글쓰기 예시 데이터
 *
 * 플레이스홀더:
 *   {{prefix}}      → [서울대][학부생]
 *   {{university}}   → 서울대
 *   {{department}}   → 경영학과 (없으면 "본인학과")
 *   {{memberType}}   → 학부생
 */

export interface CategoryExample {
  title: string;
  price: string;
  negotiable: boolean;
  body: string;
  tags: string[];
  location: string;
}

export const categoryExamples: Record<number, CategoryExample> = {

  // ═══════════════════════════════════════
  // 📦 중고마켓 (majorId: 1)
  // ═══════════════════════════════════════

  // 전공서적·교양도서 (id: 11)
  11: {
    title: '{{prefix}} {{department}} 전공서적 팝니다',
    price: '15000',
    negotiable: true,
    body: `{{department}} 전공서적 판매합니다.

■ 과목: (과목명 입력)
■ 상태: 깨끗함 (밑줄/필기 없음)
■ 학기: 2025-2학기 사용

{{university}} 캠퍼스 내 직거래 희망합니다.`,
    tags: ['교재', '전공서적'],
    location: '{{university}} 중앙도서관 앞',
  },

  // 전자기기 (id: 12)
  12: {
    title: '{{prefix}} 아이패드 에어 5세대 팝니다',
    price: '450000',
    negotiable: true,
    body: `아이패드 에어 5세대 판매합니다.

■ 색상: 스페이스그레이
■ 용량: 64GB
■ 구매일: 2024년 3월
■ 상태: A급 (스크래치 없음)
■ 구성품: 본체, 충전기, 케이스

직거래 시 확인 가능합니다.`,
    tags: ['아이패드', '전자기기', '태블릿'],
    location: '{{university}} 정문 앞',
  },

  // 가구/생활용품 (id: 13)
  13: {
    title: '{{prefix}} 자취방 책상+의자 세트 팝니다',
    price: '50000',
    negotiable: true,
    body: `자취방 정리하면서 책상+의자 세트 판매합니다.

■ 브랜드: 이케아
■ 사용 기간: 약 1년
■ 상태: 양호 (사용감 있음)
■ 직접 수거 가능하신 분

{{university}} 근처 자취방에서 직접 가져가셔야 합니다.`,
    tags: ['가구', '책상', '자취'],
    location: '{{university}} 후문 자취촌',
  },

  // 의류/패션 (id: 14)
  14: {
    title: '{{prefix}} 나이키 에어포스1 팝니다 (270)',
    price: '60000',
    negotiable: true,
    body: `나이키 에어포스1 판매합니다.

■ 사이즈: 270mm
■ 색상: 화이트
■ 구매일: 2024년 5월
■ 착용 횟수: 약 10회
■ 상태: 양호 (밑창 깨끗)

{{university}} 캠퍼스 내 직거래 가능합니다.`,
    tags: ['나이키', '운동화', '신발'],
    location: '{{university}} 학생회관 앞',
  },

  // 티켓/쿠폰 (id: 15)
  15: {
    title: '{{prefix}} 스타벅스 기프티콘 1만원권 팝니다',
    price: '8500',
    negotiable: false,
    body: `스타벅스 기프티콘 1만원권 판매합니다.

■ 유효기간: 2026년 6월까지
■ 즉시 전송 가능 (카카오톡)

쪽지로 연락주시면 바로 보내드립니다.`,
    tags: ['기프티콘', '스타벅스', '쿠폰'],
    location: '',
  },

  // 무료나눔 (id: 16)
  16: {
    title: '{{prefix}} 전공서적 무료나눔합니다',
    price: '',
    negotiable: false,
    body: `더 이상 필요 없는 전공서적 나눔합니다.

■ 도서 목록:
  1. (도서명)
  2. (도서명)
■ 상태: 사용감 있으나 읽는 데 문제 없음

선착순이며, {{university}} 캠퍼스 내 수령 가능하신 분만 연락주세요.`,
    tags: ['무료나눔', '교재', '나눔'],
    location: '{{university}} 학생회관 앞',
  },

  // 기타 (id: 17)
  17: {
    title: '{{prefix}} (물품명) 팝니다',
    price: '10000',
    negotiable: true,
    body: `(물품명) 판매합니다.

■ 상품 설명: (설명 입력)
■ 상태: (상태 입력)
■ 구매 시기: (시기 입력)

{{university}} 캠퍼스 내 직거래 희망합니다.`,
    tags: ['중고', '판매'],
    location: '{{university}} 정문 앞',
  },

  // 구합니다 (id: 18)
  18: {
    title: '{{prefix}} {{department}} 교재 구합니다',
    price: '',
    negotiable: true,
    body: `{{department}} 전공 교재 구합니다.

■ 찾는 교재: (교재명 입력)
■ 에디션: (무관 / 최신판)
■ 상태: 필기 있어도 괜찮습니다

합리적인 가격에 구매하겠습니다. 쪽지 주세요!`,
    tags: ['구합니다', '교재'],
    location: '',
  },

  // ═══════════════════════════════════════
  // 🏠 주거 (majorId: 2)
  // ═══════════════════════════════════════

  // 원룸/자취방 (id: 21)
  21: {
    title: '{{prefix}} {{university}} 근처 원룸 양도',
    price: '350000',
    negotiable: true,
    body: `{{university}} 근처 원룸 양도합니다.

■ 위치: {{university}} 후문 도보 5분
■ 보증금: 500만원 / 월세: 35만원
■ 방 구조: 원룸 (화장실 포함)
■ 층수: 3층 (엘리베이터 없음)
■ 입주 가능일: (날짜 입력)
■ 옵션: 에어컨, 냉장고, 세탁기, 전자레인지

관심 있으시면 연락주세요. 방문 가능합니다.`,
    tags: ['원룸', '양도', '자취방'],
    location: '{{university}} 후문 도보 5분',
  },

  // 룸메이트 (id: 22)
  22: {
    title: '{{prefix}} {{university}} 근처 룸메이트 구합니다',
    price: '250000',
    negotiable: false,
    body: `{{university}} 근처에서 함께 지낼 룸메이트를 구합니다.

■ 위치: {{university}} 정문 도보 10분
■ 월세: 25만원 (보증금 별도)
■ 방 구조: 투룸 (각자 방 사용)
■ 입주 가능일: (날짜 입력)
■ 선호: 비흡연, 깔끔한 분

편하게 연락주세요!`,
    tags: ['룸메이트', '투룸'],
    location: '{{university}} 정문 근처',
  },

  // 하숙/고시원 (id: 23)
  23: {
    title: '{{prefix}} {{university}} 근처 하숙집 추천',
    price: '400000',
    negotiable: false,
    body: `{{university}} 근처 하숙집 정보 공유합니다.

■ 위치: {{university}} 정문 도보 7분
■ 월세: 40만원 (식사 포함)
■ 식사: 아침/저녁 제공
■ 시설: 개인 방, 공용 화장실
■ 분위기: 조용하고 깨끗

관심 있으시면 쪽지 주세요.`,
    tags: ['하숙', '고시원'],
    location: '{{university}} 정문 근처',
  },

  // 단기임대 (id: 24)
  24: {
    title: '{{prefix}} {{university}} 근처 방학 단기임대',
    price: '300000',
    negotiable: true,
    body: `방학 기간 단기임대 가능한 방입니다.

■ 위치: {{university}} 후문 도보 5분
■ 기간: 2개월 (방학 기간)
■ 월세: 30만원 (보증금 50만원)
■ 옵션: 풀옵션 (에어컨, 세탁기 등)

방학 동안 인턴/연구 하시는 분께 추천합니다.`,
    tags: ['단기임대', '방학', '자취방'],
    location: '{{university}} 후문',
  },

  // 양도 (id: 25)
  25: {
    title: '{{prefix}} {{university}} 근처 자취방 계약 양도',
    price: '0',
    negotiable: false,
    body: `자취방 계약 양도합니다. (권리금 없음)

■ 위치: {{university}} 정문 도보 8분
■ 남은 계약 기간: 6개월
■ 보증금: 300만원 / 월세: 30만원
■ 양도 가능일: (날짜 입력)

직접 방문 후 결정하시면 됩니다.`,
    tags: ['양도', '자취방', '계약'],
    location: '{{university}} 정문 근처',
  },

  // ═══════════════════════════════════════
  // 💼 일자리 (majorId: 3)
  // ═══════════════════════════════════════

  // 아르바이트 (id: 31)
  31: {
    title: '{{prefix}} {{university}} 근처 카페 알바 모집',
    price: '11000',
    negotiable: false,
    body: `{{university}} 근처 카페에서 아르바이트생을 모집합니다.

■ 근무지: {{university}} 정문 앞 OO카페
■ 시급: 11,000원
■ 근무 시간: 평일 오전 9시~오후 2시 (협의 가능)
■ 우대 조건: 바리스타 경험자, 장기 근무 가능자

관심 있으시면 쪽지 주세요!`,
    tags: ['아르바이트', '카페', '알바'],
    location: '{{university}} 정문 앞',
  },

  // 과외 (id: 32)
  32: {
    title: '{{prefix}} {{department}} {{memberType}} 과외합니다',
    price: '40000',
    negotiable: true,
    body: `{{university}} {{department}} {{memberType}} 과외합니다.

■ 과목: (과목명 입력)
■ 대상: 고등학생 / 대학생
■ 수업 방식: 대면 ({{university}} 근처) 또는 비대면
■ 시급: 4만원 (협의 가능)
■ 경력: (경력 입력)

편하게 문의주세요!`,
    tags: ['과외', '{{memberType}}'],
    location: '{{university}} 스터디룸',
  },

  // 레슨 (id: 53)
  53: {
    title: '{{prefix}} 피아노 레슨 해드립니다',
    price: '50000',
    negotiable: true,
    body: `피아노 레슨 해드립니다.

■ 대상: 초급~중급
■ 수업 방식: 대면 ({{university}} 근처)
■ 시간: 주 1회 1시간
■ 수강료: 월 20만원 (주 1회 기준)
■ 경력: (경력 입력)

편하게 문의주세요!`,
    tags: ['레슨', '피아노', '음악'],
    location: '{{university}} 근처',
  },

  // 인턴 (id: 33)
  33: {
    title: '{{prefix}} 스타트업 인턴 모집 ({{department}} 우대)',
    price: '',
    negotiable: false,
    body: `{{department}} 전공 관련 스타트업 인턴을 모집합니다.

■ 회사: (회사명)
■ 위치: (위치)
■ 기간: 3개월 (연장 가능)
■ 급여: 월 200만원
■ 근무: 주 3일 이상 (유연근무)
■ 우대: {{department}} 전공, 관련 경험자

지원 방법: 이력서를 쪽지로 보내주세요.`,
    tags: ['인턴', '스타트업'],
    location: '',
  },

  // 연구보조(RA/TA) (id: 34)
  34: {
    title: '{{prefix}} {{department}} 연구실 RA 모집',
    price: '',
    negotiable: false,
    body: `{{university}} {{department}} 연구실에서 RA를 모집합니다.

■ 연구 주제: (주제 입력)
■ 지도교수: (교수명)
■ 근무: 주 15시간 이상
■ 급여: 학교 기준 지급
■ 자격: {{department}} 전공 학부생/대학원생
■ 기간: 1학기 이상

관심 있는 분 이력서와 함께 쪽지 보내주세요.`,
    tags: ['RA', '연구보조', '연구실'],
    location: '{{university}} {{department}} 연구실',
  },

  // 프리랜서 (id: 35)
  35: {
    title: '{{prefix}} 웹개발 프리랜서 구합니다',
    price: '',
    negotiable: true,
    body: `웹개발 프리랜서를 구합니다.

■ 프로젝트: (프로젝트 설명)
■ 기술 스택: React, Node.js
■ 기간: 약 2주
■ 예산: 협의
■ 미팅: 비대면 (줌)

포트폴리오와 함께 쪽지 주세요.`,
    tags: ['프리랜서', '웹개발', '외주'],
    location: '',
  },

  // 구인 (id: 37)
  37: {
    title: '{{prefix}} {{university}} 학생 대상 구인',
    price: '',
    negotiable: false,
    body: `{{university}} 학생 대상으로 인력을 모집합니다.

■ 업무: (업무 내용)
■ 위치: {{university}} 근처
■ 시간: (근무 시간)
■ 급여: (급여 조건)
■ 자격: {{university}} 재학생

관심 있으신 분 쪽지 주세요.`,
    tags: ['구인', '모집'],
    location: '{{university}} 근처',
  },

  // 구직 (id: 36)
  36: {
    title: '{{prefix}} {{department}} {{memberType}} 구직합니다',
    price: '',
    negotiable: false,
    body: `{{university}} {{department}} {{memberType}} 구직합니다.

■ 가능 업무: (업무 유형)
■ 가능 시간: 주 OO시간
■ 경력/스킬: (경력 입력)
■ 희망 급여: 협의

편하게 연락주세요!`,
    tags: ['구직', '{{memberType}}'],
    location: '{{university}} 근처',
  },

  // ═══════════════════════════════════════
  // 👥 커뮤니티 (majorId: 4)
  // ═══════════════════════════════════════

  // 스터디/팀원 (id: 41)
  41: {
    title: '{{prefix}} {{department}} 스터디 팀원 모집',
    price: '',
    negotiable: false,
    body: `{{department}} 관련 스터디 팀원을 모집합니다.

■ 스터디 주제: (주제 입력)
■ 모집 인원: 4~5명
■ 모임 장소: {{university}} 중앙도서관 스터디룸
■ 모임 시간: 주 1회 (요일/시간 협의)
■ 기간: 한 학기

관심 있는 분 편하게 쪽지 주세요!`,
    tags: ['스터디', '팀원모집'],
    location: '{{university}} 중앙도서관',
  },

  // 동아리/모임 (id: 42)
  42: {
    title: '{{prefix}} {{university}} OO 동아리 신입부원 모집',
    price: '',
    negotiable: false,
    body: `{{university}} OO 동아리에서 신입부원을 모집합니다.

■ 동아리명: (동아리명)
■ 활동: (활동 내용)
■ 모집 인원: OO명
■ 모임: 주 1회 (요일 협의)
■ 회비: (회비 정보)

관심 있는 분 편하게 지원해주세요!`,
    tags: ['동아리', '모집', '신입부원'],
    location: '{{university}} 학생회관',
  },

  // 카풀/동행 (id: 43)
  43: {
    title: '{{prefix}} {{university}} → 강남 카풀 모집',
    price: '5000',
    negotiable: false,
    body: `{{university}}에서 강남 방면 카풀 모집합니다.

■ 출발: {{university}} 정문
■ 도착: 강남역
■ 출발 시간: (시간 입력)
■ 모집 인원: 2명
■ 비용: 1인 5,000원

편하게 연락주세요!`,
    tags: ['카풀', '동행'],
    location: '{{university}} 정문',
  },

  // 분실물 (id: 44)
  44: {
    title: '{{prefix}} {{university}} 에서 지갑 분실했습니다',
    price: '',
    negotiable: false,
    body: `{{university}}에서 지갑을 분실했습니다.

■ 분실 장소: (장소 입력)
■ 분실 시간: (시간 입력)
■ 특징: (지갑 색상, 브랜드 등)
■ 내용물: 학생증, 카드 등

발견하신 분 연락주시면 사례하겠습니다.`,
    tags: ['분실물', '지갑'],
    location: '{{university}}',
  },

  // 학술/세미나 (id: 45)
  45: {
    title: '{{prefix}} {{department}} 특별 세미나 안내',
    price: '',
    negotiable: false,
    body: `{{department}} 관련 특별 세미나를 안내합니다.

■ 주제: (세미나 주제)
■ 연사: (연사 이름 및 소속)
■ 일시: (날짜 및 시간)
■ 장소: {{university}} (건물명 및 호실)
■ 대상: {{university}} 재학생 및 관심 있는 분

참석 희망하시는 분은 쪽지 주세요.`,
    tags: ['세미나', '학술', '강연'],
    location: '{{university}}',
  },

  // 자유게시판 (id: 46)
  46: {
    title: '{{prefix}} (제목을 입력하세요)',
    price: '',
    negotiable: false,
    body: `(자유롭게 내용을 작성해주세요)

{{university}} 커뮤니티에서 다양한 이야기를 나눠보세요.`,
    tags: ['자유게시판'],
    location: '',
  },

  // 봉사활동 (id: 47)
  47: {
    title: '{{prefix}} {{university}} 봉사활동 참여자 모집',
    price: '',
    negotiable: false,
    body: `{{university}} 봉사활동 참여자를 모집합니다.

■ 활동명: (활동명 입력)
■ 일시: (날짜 및 시간)
■ 장소: (장소 입력)
■ 모집 인원: OO명
■ 봉사시간 인정: O시간

많은 참여 부탁드립니다!`,
    tags: ['봉사활동', '봉사', '참여'],
    location: '',
  },

  // ═══════════════════════════════════════
  // 🛠️ 서비스 (majorId: 5)
  // ═══════════════════════════════════════

  // 이사/운송 (id: 51)
  51: {
    title: '{{prefix}} 자취방 이사 도움 구합니다',
    price: '50000',
    negotiable: true,
    body: `자취방 이사를 도와줄 분을 구합니다.

■ 이사일: (날짜 입력)
■ 출발: {{university}} 후문 자취촌
■ 도착: (도착지 입력)
■ 짐 양: 원룸 기본 짐 (큰 가구 없음)
■ 차량: 있으면 좋지만 없어도 OK
■ 사례비: 5만원 (협의 가능)

연락주세요!`,
    tags: ['이사', '운송', '도움'],
    location: '{{university}} 후문',
  },

  // 수리/설치 (id: 52)
  52: {
    title: '{{prefix}} 자취방 에어컨 설치 도움 구합니다',
    price: '30000',
    negotiable: true,
    body: `자취방 에어컨 설치를 도와줄 분을 구합니다.

■ 위치: {{university}} 근처 자취방
■ 작업 내용: 창문형 에어컨 설치
■ 희망 일자: (날짜 입력)
■ 사례비: 3만원 (협의 가능)

경험 있으신 분 연락주세요!`,
    tags: ['수리', '설치', '에어컨'],
    location: '{{university}} 근처',
  },

  // 대행 (id: 54)
  54: {
    title: '{{prefix}} 줄서기 대행 구합니다',
    price: '20000',
    negotiable: true,
    body: `줄서기 대행을 구합니다.

■ 장소: (장소 입력)
■ 날짜: (날짜 입력)
■ 시간: (시간 입력)
■ 예상 대기 시간: 약 OO분
■ 사례비: 2만원

관심 있으신 분 쪽지 주세요.`,
    tags: ['대행', '줄서기'],
    location: '',
  },

  // 기타 서비스 (id: 55)
  55: {
    title: '{{prefix}} (서비스명) 해드립니다',
    price: '',
    negotiable: true,
    body: `(서비스 설명을 입력해주세요)

■ 서비스 내용: (내용 입력)
■ 가격: (가격 입력)
■ 위치: {{university}} 근처

관심 있으시면 쪽지 주세요.`,
    tags: ['서비스'],
    location: '{{university}} 근처',
  },

  // IT/컴퓨터 (id: 56)
  56: {
    title: '{{prefix}} 노트북 포맷/윈도우 설치 해드립니다',
    price: '20000',
    negotiable: false,
    body: `노트북 포맷 및 윈도우 설치 해드립니다.

■ 서비스: 포맷 + 윈도우 설치 + 기본 프로그램 설치
■ 가격: 2만원
■ 소요 시간: 약 1~2시간
■ 장소: {{university}} 캠퍼스 내 카페

예약 후 방문해주시면 됩니다.`,
    tags: ['IT', '컴퓨터', '포맷'],
    location: '{{university}} 카페',
  },

  // 뷰티/미용 (id: 57)
  57: {
    title: '{{prefix}} 헤어 커트 해드립니다 (미용학과)',
    price: '5000',
    negotiable: false,
    body: `미용 관련 전공/경험이 있어 헤어 커트 해드립니다.

■ 가격: 5,000원 (재료비만)
■ 장소: {{university}} 근처 (개인 작업실)
■ 가능 시간: 주말 오후
■ 참고: 포트폴리오 사진 있습니다

쪽지로 문의해주세요!`,
    tags: ['미용', '헤어컷', '뷰티'],
    location: '{{university}} 근처',
  },

  // 건강/운동 (id: 58)
  58: {
    title: '{{prefix}} PT/운동 파트너 구합니다',
    price: '30000',
    negotiable: true,
    body: `운동 파트너 또는 PT를 구합니다.

■ 운동 종류: (종류 입력)
■ 장소: {{university}} 체육관 / 근처 헬스장
■ 시간: 주 3회 (시간 협의)
■ 가격: (PT 시 가격 / 파트너 시 무료)

관심 있으시면 연락주세요!`,
    tags: ['운동', 'PT', '파트너'],
    location: '{{university}} 체육관',
  },

  // 반려동물 (id: 59)
  59: {
    title: '{{prefix}} 강아지 산책 도우미 구합니다',
    price: '15000',
    negotiable: true,
    body: `강아지 산책 도우미를 구합니다.

■ 반려동물: 소형견 (말티즈)
■ 산책 시간: 평일 오후 (30분~1시간)
■ 장소: {{university}} 근처
■ 사례비: 1회 15,000원

동물을 좋아하시는 분 연락주세요!`,
    tags: ['반려동물', '산책', '도우미'],
    location: '{{university}} 근처',
  },

  // ═══════════════════════════════════════
  // 🏪 캠퍼스라이프 (majorId: 6)
  // ═══════════════════════════════════════

  // 맛집/카페 (id: 61)
  61: {
    title: '{{prefix}} {{university}} 근처 숨은 맛집 추천',
    price: '',
    negotiable: false,
    body: `{{university}} 근처 숨은 맛집을 추천합니다!

■ 가게명: (가게명 입력)
■ 위치: {{university}} 후문 도보 3분
■ 추천 메뉴: (메뉴명)
■ 가격대: 1인 8,000~12,000원
■ 분위기: (분위기 설명)

개인적으로 자주 가는 곳이에요. 추천!`,
    tags: ['맛집', '카페', '추천'],
    location: '{{university}} 후문 근처',
  },

  // 할인/이벤트 (id: 62)
  62: {
    title: '{{prefix}} {{university}} 학생 할인 정보 공유',
    price: '',
    negotiable: false,
    body: `{{university}} 학생 할인 정보 공유합니다.

■ 가게/서비스: (이름 입력)
■ 할인 내용: 학생증 제시 시 OO% 할인
■ 기간: (기간 입력)
■ 위치: {{university}} 근처

학생증 꼭 챙겨가세요!`,
    tags: ['할인', '이벤트', '학생할인'],
    location: '{{university}} 근처',
  },

  // 신규오픈 (id: 63)
  63: {
    title: '{{prefix}} {{university}} 앞 새로운 가게 오픈!',
    price: '',
    negotiable: false,
    body: `{{university}} 근처에 새로운 가게가 오픈했습니다!

■ 가게명: (가게명 입력)
■ 업종: (업종 입력)
■ 위치: {{university}} 정문 근처
■ 오픈 이벤트: (이벤트 정보)

가보신 분 후기도 남겨주세요!`,
    tags: ['신규오픈', '맛집', '가게'],
    location: '{{university}} 정문 근처',
  },

  // 상인 구인 (id: 64)
  64: {
    title: '{{prefix}} {{university}} 앞 매장 아르바이트 모집',
    price: '11000',
    negotiable: false,
    body: `{{university}} 앞 매장에서 아르바이트생을 모집합니다.

■ 매장: (매장명)
■ 위치: {{university}} 정문 앞
■ 시급: 11,000원
■ 근무 시간: (시간 입력)
■ 우대: {{university}} 재학생

관심 있으시면 매장으로 방문하시거나 쪽지 주세요.`,
    tags: ['구인', '아르바이트', '매장'],
    location: '{{university}} 정문 앞',
  },

  // ═══════════════════════════════════════
  // 📣 긱·의뢰 (majorId: 7)
  // ═══════════════════════════════════════

  // 심부름/대행 (id: 71)
  71: {
    title: '{{prefix}} 서류 제출 대행 구합니다',
    price: '10000',
    negotiable: true,
    body: `서류 제출 대행을 구합니다.

■ 장소: {{university}} 행정실
■ 서류: (서류명)
■ 희망 일자: (날짜 입력)
■ 사례비: 1만원

{{university}} 재학생이시면 편하게 연락주세요.`,
    tags: ['심부름', '대행', '서류'],
    location: '{{university}} 행정실',
  },

  // 번역/통역 (id: 72)
  72: {
    title: '{{prefix}} 논문 영문교정 의뢰 (5000단어)',
    price: '100000',
    negotiable: true,
    body: `학술 논문 영문교정을 의뢰합니다.

■ 분야: {{department}}
■ 분량: 약 5,000단어
■ 마감일: (날짜 입력)
■ 요청사항: 문법 교정 + 학술적 표현 개선
■ 예산: 10만원 (협의 가능)

관련 경험 있는 분 쪽지 주세요.`,
    tags: ['영문교정', '논문', '번역'],
    location: '',
  },

  // 디자인/창작 (id: 73)
  73: {
    title: '{{prefix}} 팀프로젝트 PPT 디자인 의뢰',
    price: '30000',
    negotiable: true,
    body: `팀프로젝트 발표 PPT 디자인을 의뢰합니다.

■ 슬라이드 수: 약 15~20장
■ 주제: {{department}} 관련 발표
■ 마감일: (날짜 입력)
■ 요청사항: 깔끔하고 전문적인 디자인
■ 참고 자료: 내용 초안 제공 예정

포트폴리오와 함께 쪽지 주세요!`,
    tags: ['PPT', '디자인', '발표'],
    location: '',
  },

  // 촬영/편집 (id: 74)
  74: {
    title: '{{prefix}} 증명사진 촬영 의뢰',
    price: '10000',
    negotiable: false,
    body: `증명사진 촬영을 의뢰합니다.

■ 용도: 이력서/졸업앨범
■ 수량: 데이터 파일 + 인화 4매
■ 희망 일자: (날짜 입력)
■ 장소: {{university}} 캠퍼스 내

사진 관련 전공/경험 있는 분 연락주세요.`,
    tags: ['촬영', '증명사진', '사진'],
    location: '{{university}} 캠퍼스',
  },

  // 설문/참여 (id: 75)
  75: {
    title: '{{prefix}} 설문조사 참여자 모집 (소정의 사례)',
    price: '5000',
    negotiable: false,
    body: `{{department}} 졸업논문/과제 관련 설문조사 참여자를 모집합니다.

■ 주제: (연구 주제)
■ 소요 시간: 약 10분
■ 사례: 커피 기프티콘 (5,000원)
■ 대상: {{university}} 재학생
■ 참여 방법: 아래 링크 클릭
  → (설문 링크)

많은 참여 부탁드립니다!`,
    tags: ['설문조사', '사례', '참여'],
    location: '',
  },

  // 기타 의뢰 (id: 76)
  76: {
    title: '{{prefix}} (의뢰 내용) 해주실 분 구합니다',
    price: '',
    negotiable: true,
    body: `(의뢰 내용을 입력해주세요)

■ 의뢰 내용: (상세 설명)
■ 마감일: (날짜 입력)
■ 예산: (예산 입력 또는 협의)

관심 있는 분 쪽지 주세요.`,
    tags: ['의뢰'],
    location: '',
  },
};
