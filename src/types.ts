export type CategoryType =
  | 'AI활용'
  | '수업자료제작'
  | '이미지생성'
  | '영상제작'
  | '업무자동화'
  | '글쓰기'
  | '기타';

export const CATEGORIES: CategoryType[] = [
  'AI활용',
  '수업자료제작',
  '이미지생성',
  '영상제작',
  '업무자동화',
  '글쓰기',
  '기타',
];

export interface IdeaItem {
  id: string;
  nickname: string;
  category: CategoryType;
  title: string;
  description: string;
  likes: number;
  createdAt: string;
}

export interface VibeAppItem {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  tag: string;
  author: string;
  thumbnailIcon?: string;
  createdAt: string;
}

export interface SiteStats {
  today: number;
  total: number;
  lastDate: string;
}

export type TabType = 'home' | 'archive' | 'gallery' | 'admin';
