import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  Send,
  Flame,
  Clock,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { CATEGORIES, CategoryType, IdeaItem, TabType } from '../types';

interface HomeViewProps {
  ideas: IdeaItem[];
  topRanked: IdeaItem[];
  onAddIdea: (newIdea: {
    nickname: string;
    category: CategoryType;
    title: string;
    description: string;
  }) => Promise<boolean>;
  onLikeIdea: (id: string) => Promise<void>;
  setActiveTab: (tab: TabType) => void;
  likedSet: Set<string>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  ideas,
  topRanked,
  onAddIdea,
  onLikeIdea,
  setActiveTab,
  likedSet,
}) => {
  // Form State
  const [nickname, setNickname] = useState('');
  const [category, setCategory] = useState<CategoryType>('AI활용');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('아이디어 제목을 한 줄로 입력해 주세요!');
      return;
    }

    setIsSubmitting(true);
    const success = await onAddIdea({
      nickname: nickname.trim(),
      category,
      title: title.trim(),
      description: description.trim(),
    });

    setIsSubmitting(false);

    if (success) {
      setSubmitSuccess(true);
      setTitle('');
      setDescription('');
      setNickname('');

      // Confetti burst for positive retro reward
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 4000);
    } else {
      setErrorMsg('아이디어 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleLike = async (id: string) => {
    await onLikeIdea(id);
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="space-y-5">
      {/* 1. Intro Welcome Banner */}
      <div className="bg-gradient-to-r from-[#f0f7ff] to-[#f8faff] border border-[#cbe0f4] rounded-lg p-3.5 sm:p-4 text-xs sm:text-sm text-[#1e3a5f] relative overflow-hidden shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 shrink-0 bg-[#2b70af] text-white rounded-lg flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-sm sm:text-base text-[#1e3a5f] mb-1 flex items-center gap-2">
              교직원 여러분, 환영합니다!
              <span className="text-[11px] font-normal text-[#ff6e35] bg-[#fff0eb] border border-[#ffcdba] px-2 py-0.5 rounded-full">
                작은 제안이 큰 변화로
              </span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-[13px]">
              학교 현장에서 업무나 수업을 진행하시며 <em>&ldquo;이런 프로그램이나 도구가 있으면 좋겠다&rdquo;</em>고 생각하셨던 아이디어를 자유롭게 남겨주세요!
              교직원 공감(좋아요) 투표를 바탕으로, <strong>바이브 코딩(AI 개발)</strong>을 통해 실제 동작하는 맞춤형 웹앱으로 제작해 드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Submit Form + Real-time Ranking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Idea Submit Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#d5dfea] p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashed border-[#d5dfea]">
            <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-1.5">
              <span className="text-[#ff6e35]">✍</span> 아이디어 남기기
            </h3>
            <span className="text-[11px] text-gray-400">누구나 자유롭게 제안</span>
          </div>

          {submitSuccess && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>소중한 아이디어가 등록되었습니다! 실시간 목록과 모아보기에서 확인하실 수 있습니다.</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Nickname & Category row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nickname */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  작성자 닉네임 <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder='비워두면 "익명의 작성자"'
                  maxLength={20}
                  className="w-full px-2.5 py-1.5 bg-[#fcfdfe] border border-[#cbd5e1] rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af] focus:bg-white"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  카테고리 선택 <span className="text-[#ff6e35]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-2.5 py-1.5 bg-[#fcfdfe] border border-[#cbd5e1] rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af] focus:bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title (Required) */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                아이디어 한 줄 요약 <span className="text-[#ff6e35]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 교외체험학습 신청서 구글폼 자동 취합 및 결재 양식 생성기"
                maxLength={80}
                required
                className="w-full px-2.5 py-1.5 bg-[#fcfdfe] border border-[#cbd5e1] rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af] focus:bg-white"
              />
            </div>

            {/* Description (Optional, max 300) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-gray-700">
                  부연 설명 <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <span className={`text-[11px] ${description.length >= 280 ? 'text-[#ff6e35] font-bold' : 'text-gray-400'}`}>
                  {description.length} / 300자
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="더 자세히 알려주시면 영상 제작에 큰 도움이 됩니다! (선택)"
                className="w-full px-2.5 py-1.5 bg-[#fcfdfe] border border-[#cbd5e1] rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af] focus:bg-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-1 flex items-center justify-between">
              <div className="flex items-center text-[11px] text-gray-500">
                <HelpCircle className="w-3.5 h-3.5 mr-1 text-[#2b70af]" />
                등록된 제안은 즉시 전체 교직원에게 공유됩니다.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#ff6e35] hover:bg-[#e85b24] disabled:opacity-50 text-white font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? '등록 중...' : '아이디어 남기기'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Real-time Ranking TOP Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#fafcff] rounded-lg border border-[#cbe0f4] p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashed border-[#b8cde3]">
              <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#ff6e35] fill-[#ff6e35]" />
                실시간 인기 랭킹 TOP
              </h3>
              <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded border border-[#cbd5e1]">
                공감 투표순
              </span>
            </div>

            <p className="text-[11px] text-gray-500 mb-3">
              교직원들이 가장 많이 공감한 인기 주제들입니다. 상위 주제는 바이브 코딩 개발 1순위로 채택됩니다!
            </p>

            {/* Top items list */}
            <div className="space-y-2">
              {topRanked.slice(0, 4).map((item, index) => {
                const isLiked = likedSet.has(item.id);

                return (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white border border-[#dbe6f2] rounded flex items-center justify-between gap-2 hover:border-[#2b70af] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 shrink-0 rounded flex items-center justify-center text-xs font-bold font-mono ${
                          index === 0
                            ? 'bg-[#ff6e35] text-white'
                            : index === 1
                            ? 'bg-[#2b70af] text-white'
                            : index === 2
                            ? 'bg-[#5b95c9] text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10px] text-[#2b70af] font-medium">
                          {item.category}
                        </div>
                        <div className="text-xs font-semibold text-gray-800 truncate" title={item.title}>
                          {item.title}
                        </div>
                      </div>
                    </div>

                    {/* Like button in rank */}
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold font-mono transition-all shrink-0 cursor-pointer ${
                        isLiked
                          ? 'bg-[#ffeae3] text-[#ff6e35] border border-[#ffbca8]'
                          : 'bg-gray-50 text-gray-600 hover:bg-[#fff0eb] hover:text-[#ff6e35] border border-gray-200'
                      }`}
                      title="이 아이디어에 공감 투표하기"
                    >
                      <Heart className={`w-3 h-3 ${isLiked ? 'fill-[#ff6e35] text-[#ff6e35]' : 'text-gray-400'}`} />
                      <span>{item.likes}</span>
                    </button>
                  </div>
                );
              })}

              {topRanked.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-400">
                  아직 등록된 제안이 없습니다. 첫 번째 아이디어를 남겨보세요!
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('archive')}
            className="mt-4 w-full py-2 bg-white hover:bg-[#f0f7ff] border border-[#b8cde3] text-[#2b70af] font-semibold text-xs rounded transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>전체 아이디어 모아보기 ({ideas.length}건)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Recent Ideas Feed Preview */}
      <div className="bg-white rounded-lg border border-[#d5dfea] p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashed border-[#d5dfea]">
          <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#2b70af]" />
            방금 올라온 따끈따끈한 생각들
          </h3>
          <button
            onClick={() => setActiveTab('archive')}
            className="text-xs text-[#2b70af] hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
          >
            모두 보기
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ideas.slice(0, 4).map((item) => {
            const isLiked = likedSet.has(item.id);

            return (
              <div
                key={item.id}
                className="p-3 bg-[#fbfcfd] border border-[#e2e8f0] rounded-md hover:border-[#b8cde3] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-[#2b70af] bg-[#eff6ff] px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span>{item.nickname}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1 leading-snug">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 text-[11px]">
                  <span className="text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                      isLiked
                        ? 'bg-[#ffeae3] text-[#ff6e35] border border-[#ffcdba]'
                        : 'bg-white text-gray-600 hover:text-[#ff6e35] border border-gray-200'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-[#ff6e35] text-[#ff6e35]' : 'text-gray-400'}`} />
                    <span>공감 {item.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
