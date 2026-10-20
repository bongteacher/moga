import React from 'react';
import { Heart, School, Award, ArrowUpRight, ShieldCheck, User } from 'lucide-react';
import { TabType } from '../types';

interface LeftSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  setActiveTab,
  isAdmin,
  onOpenAdminModal,
}) => {
  return (
    <div className="w-full md:w-60 shrink-0 flex flex-col gap-3">
      {/* Profile Box */}
      <div className="bg-white p-3 rounded border border-[#d5dfea] flex flex-col items-center text-center">
        {/* Retro Profile Avatar */}
        <div className="relative w-36 h-36 bg-gradient-to-br from-[#e0edfb] to-[#c8e0f8] rounded border-2 border-[#b8cde3] p-1 flex items-center justify-center overflow-hidden mb-2 shadow-inner">
          <div className="flex flex-col items-center justify-center text-[#2b70af]">
            <div className="w-16 h-16 bg-[#2b70af] text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md mb-1 border-2 border-white">
              🏫
            </div>
            <span className="text-[11px] font-bold tracking-tight text-[#1e3a5f]">
              교직원 바이브 룸
            </span>
            <span className="text-[10px] text-gray-500">since 2000s retro</span>
          </div>
          {/* Retro Corner Badge */}
          <div className="absolute top-1 right-1 bg-[#ff6e35] text-white text-[9px] px-1 py-0.5 rounded font-mono font-bold">
            LIVE
          </div>
        </div>

        {/* Emotion / Mood of the day */}
        <div className="w-full bg-[#f8fafc] border border-dashed border-[#cbd5e1] p-1.5 rounded text-xs text-gray-700 mb-2">
          <span className="text-[#ff6e35] font-bold mr-1">TODAY IS..</span>
          <span className="text-gray-600 font-medium">아이디어 넘침 💡</span>
        </div>

        {/* Status Message */}
        <div className="text-xs text-gray-600 bg-[#eff6ff] p-2 rounded w-full border border-[#dbeafe] leading-relaxed mb-3 text-left">
          <p className="font-semibold text-[#1e40af] mb-0.5 flex items-center">
            <Heart className="w-3 h-3 text-[#ff6e35] mr-1 fill-[#ff6e35]" />
            선생님의 소중한 생각
          </p>
          <p className="text-[11px] text-gray-600">
            &ldquo;이런 도구 있었으면 좋겠다&rdquo; 싶은 아이디어를 편하게 적어주세요.
          </p>
        </div>

        {/* Room Info Details */}
        <div className="w-full text-left text-xs border-t border-gray-100 pt-2 space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="flex items-center text-gray-600">
              <School className="w-3 h-3 mr-1 text-[#2b70af]" />
              소속 공간
            </span>
            <span className="font-medium text-gray-800">교직원 사랑방</span>
          </div>
          <div className="flex items-center justify-between text-gray-500">
            <span className="flex items-center text-gray-600">
              <Award className="w-3 h-3 mr-1 text-[#ff6e35]" />
              제작 지원
            </span>
            <span className="font-medium text-[#2b70af]">AI 바이브 코딩</span>
          </div>
          <div className="flex items-center justify-between text-gray-500">
            <span className="flex items-center text-gray-600">
              <User className="w-3 h-3 mr-1 text-emerald-600" />
              참여 자격
            </span>
            <span className="font-medium text-emerald-700">전 교직원 누구나</span>
          </div>
        </div>
      </div>

      {/* Quick Wave / Shortcut Surfing */}
      <div className="bg-white p-2.5 rounded border border-[#d5dfea] text-xs">
        <label className="block text-[11px] font-bold text-[#1e3a5f] mb-1.5 flex items-center justify-between">
          <span>파도타기 (바로가기)</span>
          <ArrowUpRight className="w-3 h-3 text-gray-400" />
        </label>
        <select
          onChange={(e) => {
            const val = e.target.value as TabType;
            if (val) setActiveTab(val);
          }}
          value={activeTab}
          className="w-full text-xs p-1.5 bg-[#f8fafc] border border-gray-300 rounded focus:outline-none focus:border-[#2b70af]"
        >
          <option value="home">🏡 홈 & 아이디어 남기기</option>
          <option value="archive">📂 모아보기 (전체 검색)</option>
          <option value="gallery">✨ 구현 (바이브 웹앱)</option>
          <option value="admin">🔒 운영자 관리 센터</option>
        </select>
      </div>

      {/* Admin Status Tag */}
      {isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span className="font-bold">운영자 인증됨</span>
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className="text-[11px] bg-amber-600 text-white px-1.5 py-0.5 rounded hover:bg-amber-700 transition"
          >
            관리실 이동
          </button>
        </div>
      )}
    </div>
  );
};
