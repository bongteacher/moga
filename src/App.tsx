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

  // Fetch Ideas & Apps & Stats
  const fetchData = useCallback(async () => {
    try {
      const [ideasRes, appsRes, statsRes] = await Promise.all([
        fetch('/api/ideas?limit=100'),
        fetch('/api/apps'),
        fetch('/api/stats'),
      ]);

      if (ideasRes.ok) {
        const data = await ideasRes.json();
        setIdeas(data.items || []);
        setTopRanked(data.topRanked || []);
      }

      if (appsRes.ok) {
        const data = await appsRes.json();
        setApps(data || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch data from server', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Admin Authentication
  const checkAdminAuth = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.isAdmin) {
        setIsAdmin(true);
        setAdminEmail(data.email);
        localStorage.setItem('minihompy_admin_email', data.email);
        return true;
      } else {
        setIsAdmin(false);
        return false;
      }
    } catch (err) {
      console.error('Admin verify failed', err);
      return false;
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminEmail('');
    localStorage.removeItem('minihompy_admin_email');
  };

  // Add Idea
  const handleAddIdea = async (newIdea: {
    nickname: string;
    category: CategoryType;
    title: string;
    description: string;
  }): Promise<boolean> => {
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
      return false;
    } catch (err) {
      console.error('Error posting idea', err);
      return false;
    }
  };

  // Like Idea (with local storage prevention)
  const handleLikeIdea = async (id: string) => {
    if (likedSet.has(id)) {
      // Already liked, can optionally allow un-like or show feedback
      return;
    }

    // Optimistic UI update
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, likes: i.likes + 1 } : i))
    );
    setTopRanked((prev) =>
      prev.map((i) => (i.id === id ? { ...i, likes: i.likes + 1 } : i))
    );

    const updatedLikes = new Set(likedSet);
    updatedLikes.add(id);
    setLikedSet(updatedLikes);
    localStorage.setItem('minihompy_liked_ideas', JSON.stringify(Array.from(updatedLikes)));

    try {
      await fetch(`/api/ideas/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Error liking idea', err);
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
