import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Music } from 'lucide-react';
import { SiteStats } from '../types';

interface HeaderBarProps {
  stats: SiteStats;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ stats }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-dashed border-[#b8cde3] gap-2">
      {/* Title & Room Status */}
      <div className="flex items-center gap-2">
        <span className="text-[#ff6e35] text-lg font-bold">●</span>
        <h1 className="text-base sm:text-lg font-bold text-[#1e3a5f] tracking-tight">
          교직원 마이크로 바이브 사랑방
        </h1>
        <span className="hidden md:inline-flex items-center text-xs bg-[#eef5fc] text-[#2b70af] px-2 py-0.5 rounded border border-[#cbe0f4]">
          <Sparkles className="w-3 h-3 mr-1 text-[#ff6e35]" />
          아이디어가 실제 웹앱이 되는 공간
        </span>
      </div>

      {/* BGM Player & Today Counter */}
      <div className="flex items-center gap-4 text-xs">
        {/* Retro BGM Player Bar */}
        <div className="flex items-center gap-1.5 bg-[#f0f4f9] px-2.5 py-1 rounded border border-[#d5dfea] text-[#475569]">
          <Music className={`w-3.5 h-3.5 text-[#2b70af] ${isPlaying ? 'animate-bounce' : ''}`} />
          <span className="truncate max-w-[140px] sm:max-w-[180px]">
            프리스타일 - Y (교원 에디션)
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-[#64748b] hover:text-[#1e3a5f] transition-colors p-0.5 ml-1"
            title={isPlaying ? 'BGM 멈춤' : 'BGM 재생'}
          >
            {isPlaying ? (
              <span className="flex items-center text-[10px] text-[#2b70af] font-semibold">
                <Volume2 className="w-3 h-3 mr-0.5" /> ON
              </span>
            ) : (
              <span className="flex items-center text-[10px] text-gray-400 font-semibold">
                <VolumeX className="w-3 h-3 mr-0.5" /> OFF
              </span>
            )}
          </button>
        </div>

        {/* Today / Total counter */}
        <div className="flex items-center font-mono font-bold text-xs whitespace-nowrap bg-white px-2 py-1 rounded border border-[#d5dfea]">
          <span className="text-[#ff6e35]">TODAY</span>
          <span className="text-[#1e3a5f] ml-1 mr-2">{stats.today}</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 ml-2">TOTAL</span>
          <span className="text-gray-700 ml-1">{stats.total}</span>
        </div>
      </div>
    </div>
  );
};
