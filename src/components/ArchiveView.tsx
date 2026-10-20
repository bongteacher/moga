import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Filter,
  ArrowUpDown,
  Heart,
  Calendar,
  User,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, CategoryType, IdeaItem } from '../types';

interface ArchiveViewProps {
  ideas: IdeaItem[];
  onLikeIdea: (id: string) => Promise<void>;
  onDeleteIdea?: (id: string) => Promise<void>;
  isAdmin: boolean;
  likedSet: Set<string>;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  ideas,
  onLikeIdea,
  onDeleteIdea,
  isAdmin,
  likedSet,
}) => {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'latest' | 'likes'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort logic
  const filteredIdeas = ideas.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  filteredIdeas.sort((a, b) => {
    if (sortOption === 'likes') {
      return b.likes - a.likes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const currentItems = filteredIdeas.slice(
    (validPage - 1) * itemsPerPage,
    validPage * itemsPerPage
  );

  const handleLike = async (id: string) => {
    await onLikeIdea(id);
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.8 },
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!onDeleteIdea) return;
    if (window.confirm(`[운영자 확인] 정말로 이 제안을 삭제하시겠습니까?\n\n"${title}"`)) {
      await onDeleteIdea(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-dashed border-[#d5dfea] gap-2">
        <div>
          <h2 className="text-base font-bold text-[#1e3a5f] flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-[#2b70af]" />
            아이디어 모아보기 & 검색
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            교직원 여러분이 남겨주신 소중한 제안들을 카테고리별로 모아보고 공감 투표에 참여하세요.
          </p>
        </div>

        {/* Sort Toggle Controls */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-md border border-[#cbd5e1] self-start sm:self-auto text-xs">
          <button
            onClick={() => {
              setSortOption('latest');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
              sortOption === 'latest'
                ? 'bg-white text-[#1e3a5f] font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => {
              setSortOption('likes');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded font-medium transition cursor-pointer flex items-center gap-1 ${
              sortOption === 'likes'
                ? 'bg-white text-[#ff6e35] font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="w-3 h-3 fill-current" />
            공감순
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-2.5 bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]">
        {/* Category Pills (Functional Filter Buttons) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center">
            카테고리:
          </span>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#2b70af] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            전체 ({ideas.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = ideas.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#2b70af] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat} <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="제목, 내용, 작성자 닉네임으로 검색해 보세요..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-[#cbd5e1] rounded-md text-xs text-gray-800 focus:outline-none focus:border-[#2b70af] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Idea Cards List View */}
      <div className="space-y-3">
        {currentItems.map((item) => {
          const isLiked = likedSet.has(item.id);

          return (
            <div
              key={item.id}
              className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#d5dfea] hover:border-[#b8cde3] transition-all flex flex-col justify-between gap-2 shadow-2xs"
            >
              <div>
                {/* Top meta row */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#2b70af] bg-[#eef5fc] border border-[#d2e4f7] px-2 py-0.5 rounded text-[11px]">
                      {item.category}
                    </span>
                    <span className="flex items-center text-gray-600 text-xs">
                      <User className="w-3 h-3 mr-1 text-gray-400" />
                      {item.nickname}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>

                    {/* Admin delete button */}
                    {isAdmin && onDeleteIdea && (
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition cursor-pointer flex items-center text-[11px]"
                        title="[운영자] 이 제안 삭제하기"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-0.5" />
                        삭제
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 mb-1.5 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                {item.description ? (
                  <p className="text-xs text-gray-600 leading-relaxed bg-[#fbfcfd] p-2.5 rounded border border-gray-100 whitespace-pre-wrap">
                    {item.description}
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">
                    상세 설명 없이 등록된 한 줄 제안입니다.
                  </p>
                )}
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <span className="text-[11px] text-gray-400 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
                  바이브 코딩 후보 제안
                </span>

                {/* Like Button */}
                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-mono transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-[#ffeae3] text-[#ff6e35] border border-[#ffcdba] shadow-2xs'
                      : 'bg-[#f8fafc] text-gray-600 hover:text-[#ff6e35] hover:bg-[#fff0eb] border border-gray-200'
                  }`}
                  title="이 아이디어에 공감 투표하기"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isLiked ? 'fill-[#ff6e35] text-[#ff6e35]' : 'text-gray-400'
                    }`}
                  />
                  <span>공감 {item.likes}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filteredIdeas.length === 0 && (
          <div className="bg-white rounded-lg border border-[#d5dfea] p-8 text-center text-gray-500">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700 mb-1">
              조건에 맞는 아이디어가 없습니다.
            </p>
            <p className="text-xs text-gray-400 mb-3">
              다른 카테고리나 검색어를 입력하시거나, 새로운 아이디어를 직접 남겨보세요!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#2b70af] hover:underline font-medium cursor-pointer"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validPage === 1}
            className="p-1.5 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-7 h-7 text-xs font-mono font-bold rounded transition cursor-pointer ${
                validPage === num
                  ? 'bg-[#2b70af] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validPage === totalPages}
            className="p-1.5 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
