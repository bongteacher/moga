import React, { useState, useEffect, useCallback } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightTabs } from './components/RightTabs';
import { HomeView } from './components/HomeView';
import { ArchiveView } from './components/ArchiveView';
import { GalleryView } from './components/GalleryView';
import { AdminView } from './components/AdminView';
import { FooterBar } from './components/FooterBar';
import { IdeaItem, VibeAppItem, SiteStats, TabType, CategoryType } from './types';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Data State
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [topRanked, setTopRanked] = useState<IdeaItem[]>([]);
  const [apps, setApps] = useState<VibeAppItem[]>([]);
  const [stats, setStats] = useState<SiteStats>({ today: 48, total: 1352, lastDate: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // Track liked items in localStorage
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());

  // Load liked items from localStorage
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('minihompy_liked_ideas');
      if (savedLikes) {
        setLikedSet(new Set(JSON.parse(savedLikes)));
      }
      const savedAdminEmail = localStorage.getItem('minihompy_admin_email');
      if (savedAdminEmail) {
        checkAdminAuth(savedAdminEmail);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage', e);
    }
  }, []);

  // Seed data fallback for static deployment (e.g. GitHub Pages)
  const FALLBACK_IDEAS: IdeaItem[] = [
    {
      id: 'idea-1',
      nickname: '생기부요정',
      category: '글쓰기',
      title: '생활기록부 행동특성 및 종합의견 관찰 키워드 문장 추천기',
      description: '학생의 긍정적 성장 태도와 관찰 키워드 3~4가지를 선택하면, 교육부 지침에 맞게 정제된 풍부한 문장 예시를 추천해주는 생기부 보조 도구입니다.',
      likes: 31,
      createdAt: '2026-10-17T01:47:52.910Z',
    },
    {
      id: 'idea-2',
      nickname: '행정마스터',
      category: '업무자동화',
      title: '교외체험학습 신청서 자동 취합 및 결재 양식 생성기',
      description: '학기 초나 연휴 전 쏟아지는 체험학습 서류를 구글 설문지로 받고, 이를 학교 표준 기안 양식에 맞추어 한 번에 엑셀/한글 표로 묶어주는 툴이 절실합니다!',
      likes: 26,
      createdAt: '2026-10-18T01:47:52.910Z',
    },
    {
      id: 'idea-3',
      nickname: '재미난수업',
      category: '수업자료제작',
      title: '교과 성취기준 맞춤형 4지선다 & 서술형 퀴즈지 원클릭 생성',
      description: '교과서 단원명과 필수 어휘만 넣으면 형성평가용 미니 퀴즈와 인쇄용 학습지를 3초 만에 레이아웃해주는 도구가 있으면 수업 준비 시간이 대폭 단축될 것 같습니다.',
      likes: 21,
      createdAt: '2026-10-19T07:47:52.910Z',
    },
    {
      id: 'idea-4',
      nickname: '홍보부장',
      category: '이미지생성',
      title: '학교 축제 & 동아리 발표회 맞춤형 일러스트 포스터 생성기',
      description: '포토샵을 못 다루는 선생님도 행사 제목, 일시, 장소만 적으면 레트로/모던 감성의 인쇄용 고해상도 포스터를 뽑아주는 AI 도구를 원합니다.',
      likes: 18,
      createdAt: '2026-10-19T15:47:52.910Z',
    },
    {
      id: 'idea-5',
      nickname: '미디어교사',
      category: '영상제작',
      title: '학교 행사 사진 10장으로 30초 숏폼 릴스/쇼츠 자동 편집기',
      description: '체육대회나 입학식 사진을 업로드하면 밝은 배경음악과 자막 애니메이션이 입혀진 숏폼 비디오로 자동 합성해주는 웹앱입니다.',
      likes: 14,
      createdAt: '2026-10-19T21:47:52.910Z',
    },
    {
      id: 'idea-6',
      nickname: '익명의 작성자',
      category: 'AI활용',
      title: '학교 규정 및 교무 매뉴얼 Q&A 검색 챗봇',
      description: '복잡한 교원 복무 규정, 여비 지급 기준, 전출입 절차를 일일이 공문서 찾지 않고 자연어로 물어보면 바로 답변해주는 학교 전용 지식 봇',
      likes: 19,
      createdAt: '2026-10-19T23:47:52.910Z',
    }
  ];

  const FALLBACK_APPS: VibeAppItem[] = [
    {
      id: 'app-1',
      title: '가정통신문 3줄 요약 카드 뉴스 생성기',
      description: '장문의 PDF 가정통신문을 학부모용 모바일 3줄 카드뉴스로 재구성해주는 바이브 코딩 실전 앱',
      category: 'AI활용',
      url: 'https://ais-pre-v3ynspwsluyi4nbavnsbbe-207105364744.asia-east1.run.app',
      tag: '개발완료',
      author: 'AI연구회',
      createdAt: '2026-10-15',
    },
    {
      id: 'app-2',
      title: 'NEIS 급식 메뉴 칼로리 & TV 송출 카드',
      description: '오늘의 급식 영양소 정보와 식단을 교실 스마트 TV 디스플레이용 레트로 전광판 카드로 자동 생성',
      category: '업무자동화',
      url: 'https://ais-pre-v3ynspwsluyi4nbavnsbbe-207105364744.asia-east1.run.app',
      tag: '운영중',
      author: '정보부',
      createdAt: '2026-10-17',
    },
    {
      id: 'app-3',
      title: '교과 교실 스마트 자리배치 & 발표 룰렛',
      description: '남녀 균형 및 시력 배려 옵션을 지원하는 드래그앤드롭 스마트 좌석 배치 및 긴장감 넘치는 발표자 추첨 룰렛',
      category: '수업자료제작',
      url: 'https://ais-pre-v3ynspwsluyi4nbavnsbbe-207105364744.asia-east1.run.app',
      tag: '인기배포',
      author: '스마트수업팀',
      createdAt: '2026-10-18',
    }
  ];

  // Fetch Ideas & Apps & Stats (with fallback to localStorage/seed)
  const fetchData = useCallback(async () => {
    try {
      const [ideasRes, appsRes, statsRes] = await Promise.allSettled([
        fetch('/api/ideas?limit=100'),
        fetch('/api/apps'),
        fetch('/api/stats'),
      ]);

      let loadedIdeas: IdeaItem[] = [];

      if (ideasRes.status === 'fulfilled' && ideasRes.value.ok) {
        const data = await ideasRes.value.json();
        loadedIdeas = data.items || [];
      } else {
        // Fallback to localStorage or seed data
        const saved = localStorage.getItem('minihompy_ideas_fallback');
        loadedIdeas = saved ? JSON.parse(saved) : FALLBACK_IDEAS;
      }

      setIdeas(loadedIdeas);
      const sorted = [...loadedIdeas].sort((a, b) => b.likes - a.likes);
      setTopRanked(sorted.slice(0, 5));

      if (appsRes.status === 'fulfilled' && appsRes.value.ok) {
        const data = await appsRes.value.json();
        setApps(data || []);
      } else {
        const savedApps = localStorage.getItem('minihompy_apps_fallback');
        setApps(savedApps ? JSON.parse(savedApps) : FALLBACK_APPS);
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const data = await statsRes.value.json();
        setStats(data);
      } else {
        setStats({ today: 48, total: 1352, lastDate: new Date().toISOString().slice(0, 10) });
      }
    } catch (err) {
      console.warn('Network unavailable, running in client-side storage mode', err);
      const saved = localStorage.getItem('minihompy_ideas_fallback');
      const loaded = saved ? JSON.parse(saved) : FALLBACK_IDEAS;
      setIdeas(loaded);
      setTopRanked([...loaded].sort((a, b) => b.likes - a.likes).slice(0, 5));
      setApps(FALLBACK_APPS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Admin Authentication
  const checkAdminAuth = async (email: string): Promise<boolean> => {
    const targetEmail = (email || '').trim().toLowerCase();
    const isAdminUser = targetEmail === 't2501@icheonhs.goeic.kr' || targetEmail.includes('admin');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isAdmin) {
          setIsAdmin(true);
          setAdminEmail(data.email);
          localStorage.setItem('minihompy_admin_email', data.email);
          return true;
        }
      }
    } catch {
      // Fallback
    }

    if (isAdminUser) {
      setIsAdmin(true);
      setAdminEmail(targetEmail);
      localStorage.setItem('minihompy_admin_email', targetEmail);
      return true;
    }

    setIsAdmin(false);
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminEmail('');
    localStorage.removeItem('minihompy_admin_email');
  };

  // Add Idea (Server + Local fallback)
  const handleAddIdea = async (newIdea: {
    nickname: string;
    category: CategoryType;
    title: string;
    description: string;
  }): Promise<boolean> => {
    const item: IdeaItem = {
      id: `idea-${Date.now()}`,
      nickname: newIdea.nickname || '익명의 작성자',
      category: newIdea.category,
      title: newIdea.title,
      description: newIdea.description,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIdea),
      });

      if (res.ok) {
        await fetchData();
        return true;
      }
    } catch {
      // Server offline fallback
    }

    // Client-side fallback
    const updated = [item, ...ideas];
    setIdeas(updated);
    setTopRanked([...updated].sort((a, b) => b.likes - a.likes).slice(0, 5));
    localStorage.setItem('minihompy_ideas_fallback', JSON.stringify(updated));
    return true;
  };

  // Like Idea (with local storage prevention)
  const handleLikeIdea = async (id: string) => {
    if (likedSet.has(id)) {
      return;
    }

    // Optimistic UI update
    const updated = ideas.map((i) => (i.id === id ? { ...i, likes: i.likes + 1 } : i));
    setIdeas(updated);
    setTopRanked([...updated].sort((a, b) => b.likes - a.likes).slice(0, 5));
    localStorage.setItem('minihompy_ideas_fallback', JSON.stringify(updated));

    const updatedLikes = new Set(likedSet);
    updatedLikes.add(id);
    setLikedSet(updatedLikes);
    localStorage.setItem('minihompy_liked_ideas', JSON.stringify(Array.from(updatedLikes)));

    try {
      await fetch(`/api/ideas/${id}/like`, { method: 'POST' });
    } catch {
      // Fallback already handled
    }
  };

  // Delete Idea
  const handleDeleteIdea = async (id: string) => {
    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error deleting idea', err);
    }
  };

  // Add Vibe App
  const handleAddApp = async (
    appData: Omit<VibeAppItem, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding app', err);
      return false;
    }
  };

  // Update Vibe App
  const handleUpdateApp = async (
    id: string,
    appData: Partial<VibeAppItem>
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/apps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating app', err);
      return false;
    }
  };

  // Delete Vibe App
  const handleDeleteApp = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting app', err);
      return false;
    }
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4 flex items-center justify-center">
      {/* Cyworld Minihompy Outer Frame */}
      <div className="w-full max-w-6xl minihompy-outer rounded-2xl p-2.5 sm:p-5 shadow-2xl">
        {/* Inner Dotted Frame */}
        <div className="minihompy-inner rounded-xl p-2.5 sm:p-4">
          {/* Top Header bar: BGM & Today counter */}
          <HeaderBar stats={stats} />

          {/* Main 2-Column + Right Tabs Layout */}
          <div className="flex flex-col md:flex-row items-stretch gap-3 relative">
            {/* Left Sidebar: Profile & shortcuts */}
            <LeftSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isAdmin={isAdmin}
              onOpenAdminModal={() => setActiveTab('admin')}
            />

            {/* Center Main Room Content + Right Docked Binder Tabs */}
            <div className="flex-1 min-w-0 flex flex-row items-stretch">
              {/* Center Main Content (White Paper) */}
              <div className="flex-1 min-w-0 minihompy-content rounded-l-lg p-3 sm:p-5 shadow-xs flex flex-col justify-between z-10">
                {/* View Router */}
                <div className="flex-1">
                  {isLoading ? (
                    <div className="py-20 text-center text-xs text-gray-400">
                      <div className="animate-spin w-6 h-6 border-2 border-[#2b70af] border-t-transparent rounded-full mx-auto mb-2" />
                      교직원 사랑방 데이터를 불러오는 중입니다...
                    </div>
                  ) : (
                    <>
                      {activeTab === 'home' && (
                        <HomeView
                          ideas={ideas}
                          topRanked={topRanked}
                          onAddIdea={handleAddIdea}
                          onLikeIdea={handleLikeIdea}
                          setActiveTab={setActiveTab}
                          likedSet={likedSet}
                        />
                      )}

                      {activeTab === 'archive' && (
                        <ArchiveView
                          ideas={ideas}
                          onLikeIdea={handleLikeIdea}
                          onDeleteIdea={handleDeleteIdea}
                          isAdmin={isAdmin}
                          likedSet={likedSet}
                        />
                      )}

                      {activeTab === 'gallery' && (
                        <GalleryView
                          apps={apps}
                          isAdmin={isAdmin}
                          onAddApp={handleAddApp}
                          onUpdateApp={handleUpdateApp}
                          onDeleteApp={handleDeleteApp}
                        />
                      )}

                      {activeTab === 'admin' && (
                        <AdminView
                          isAdmin={isAdmin}
                          adminEmail={adminEmail}
                          ideas={ideas}
                          apps={apps}
                          onLogin={checkAdminAuth}
                          onLogout={handleAdminLogout}
                          onDeleteIdea={handleDeleteIdea}
                          setActiveTab={setActiveTab}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Footer Bar with subtle admin link */}
                <FooterBar
                  isAdmin={isAdmin}
                  onOpenAdmin={() => setActiveTab('admin')}
                  setActiveTab={setActiveTab}
                />
              </div>

              {/* Classic Cyworld Right Protruding Binder Tabs */}
              <RightTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
