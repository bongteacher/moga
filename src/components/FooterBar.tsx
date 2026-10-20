import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { TabType } from '../types';

interface FooterBarProps {
  isAdmin: boolean;
  onOpenAdmin: () => void;
  setActiveTab: (tab: TabType) => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({ isAdmin, onOpenAdmin, setActiveTab }) => {
  return (
    <footer className="mt-4 pt-3 border-t border-dashed border-[#b8cde3] flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
      <div className="flex items-center gap-2">
        <span>© 2026 교직원 마이크로 바이브 사랑방</span>
        <span className="hidden sm:inline text-gray-300">|</span>
        <span className="hidden sm:inline text-gray-400">교직원 아이디어 & 바이브 코딩 연계 게시판</span>
      </div>

      <div className="flex items-center gap-3">
        {isAdmin ? (
          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 transition cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>운영자 모드 (활성화됨)</span>
          </button>
        ) : (
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/50 text-[10px]"
            title="운영자 전용 로그인"
          >
            <Lock className="w-2.5 h-2.5" />
            <span>운영자 로그인</span>
          </button>
        )}
      </div>
    </footer>
  );
};
