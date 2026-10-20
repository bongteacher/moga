import React from 'react';
import { Home, ListFilter, Boxes, Lock, ShieldCheck } from 'lucide-react';
import { TabType } from '../types';

interface RightTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAdmin: boolean;
}

export const RightTabs: React.FC<RightTabsProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: '홈',
      subLabel: '소통방',
      icon: Home,
    },
    {
      id: 'archive' as TabType,
      label: '모아보기',
      subLabel: '전체검색',
      icon: ListFilter,
    },
    {
      id: 'gallery' as TabType,
      label: '구현',
      subLabel: '바이브앱',
      icon: Boxes,
    },
    {
      id: 'admin' as TabType,
      label: '운영자',
      subLabel: '관리센터',
      icon: Lock,
    },
  ];

  return (
    <nav
      aria-label="미니홈피 메뉴 탭"
      className="flex flex-col gap-1.5 shrink-0 -ml-[1px] pt-4 sm:pt-6 z-20"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2.5 sm:py-2.5 px-2 sm:px-3 text-xs rounded-r-lg border border-l-0 transition-all cursor-pointer select-none text-left min-w-[54px] sm:min-w-[82px] ${
              isActive
                ? 'bg-white text-[#1e3a5f] font-bold border-[#d5dfea] shadow-md translate-x-1 sm:translate-x-1.5 z-30'
                : 'bg-[#2b70af] hover:bg-[#3880c4] text-white border-[#1f5990] opacity-95 hover:opacity-100'
            }`}
            title={`${tab.label} (${tab.subLabel})`}
          >
            {/* Active Left Connector Cover (seamless blend into the white content box) */}
            {isActive && (
              <span className="hidden sm:block absolute -left-[3px] top-0 bottom-0 w-[4px] bg-white z-40" />
            )}

            {/* Icon */}
            <div className="relative">
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#ff6e35]' : 'text-blue-100'
                }`}
              />
              {tab.id === 'admin' && isAdmin && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 border border-white" />
              )}
            </div>

            {/* Labels */}
            <div className="flex flex-col items-center sm:items-start leading-tight">
              <span className={`text-[11px] sm:text-xs ${isActive ? 'text-[#1e3a5f] font-bold' : 'text-white font-medium'}`}>
                {tab.label}
              </span>
              <span
                className={`hidden sm:inline text-[9px] ${
                  isActive ? 'text-[#ff6e35] font-semibold' : 'text-blue-200'
                }`}
              >
                {tab.subLabel}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};
