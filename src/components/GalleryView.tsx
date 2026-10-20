import React, { useState } from 'react';
import {
  Boxes,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Code2,
  CheckCircle,
  Laptop,
} from 'lucide-react';
import { CATEGORIES, VibeAppItem } from '../types';

interface GalleryViewProps {
  apps: VibeAppItem[];
  isAdmin: boolean;
  onAddApp: (app: Omit<VibeAppItem, 'id' | 'createdAt'>) => Promise<boolean>;
  onUpdateApp: (id: string, app: Partial<VibeAppItem>) => Promise<boolean>;
  onDeleteApp: (id: string) => Promise<boolean>;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  apps,
  isAdmin,
  onAddApp,
  onUpdateApp,
  onDeleteApp,
}) => {
  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('AI활용');
  const [url, setUrl] = useState('');
  const [tag, setTag] = useState('개발완료');
  const [author, setAuthor] = useState('교직원 AI동아리');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingAppId(null);
    setTitle('');
    setDescription('');
    setCategory('AI활용');
    setUrl('');
    setTag('개발완료');
    setAuthor('교직원 AI연구회');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (app: VibeAppItem) => {
    setEditingAppId(app.id);
    setTitle(app.title);
    setDescription(app.description);
    setCategory(app.category);
    setUrl(app.url);
    setTag(app.tag);
    setAuthor(app.author);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setFormError('웹앱 제목과 링크 URL은 필수 입력 사항입니다.');
      return;
    }

    if (editingAppId) {
      await onUpdateApp(editingAppId, {
        title: title.trim(),
        description: description.trim(),
        category,
        url: url.trim(),
        tag,
        author,
      });
    } else {
      await onAddApp({
        title: title.trim(),
        description: description.trim(),
        category,
        url: url.trim(),
        tag,
        author,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, appTitle: string) => {
    if (window.confirm(`[운영자 확인] 정말로 "${appTitle}" 웹앱을 구현 갤러리에서 삭제하시겠습니까?`)) {
      await onDeleteApp(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-dashed border-[#d5dfea] gap-2">
        <div>
          <h2 className="text-base font-bold text-[#1e3a5f] flex items-center gap-1.5">
            <Boxes className="w-4 h-4 text-[#2b70af]" />
            바이브 코딩 구현 갤러리 (Showcase)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            교직원 여러분의 제안을 바탕으로 실제 바이브 코딩으로 제작 및 배포된 완성작 웹앱들입니다.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2b70af] hover:bg-[#205788] text-white text-xs font-bold rounded shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 구현작 등록</span>
          </button>
        )}
      </div>

      {/* Guide Banner */}
      <div className="bg-[#f0f9ff] border border-[#bae6fd] p-3 rounded-lg text-xs text-[#0369a1] flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>바이브 코딩이란?</strong> 교직원분들의 아이디어와 요구사항을 자연어로 설명하여 AI와 함께 실시간으로 개발한 맞춤형 소프트웨어입니다.
          필요한 기능이 완성된 앱은 [체험하기] 버튼을 통해 누구나 학교 업무에 즉시 활용하실 수 있습니다!
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-[#d5dfea] rounded-lg p-4 flex flex-col justify-between hover:border-[#2b70af] hover:shadow-xs transition-all relative group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#2b70af] bg-[#eff6ff] px-2 py-0.5 rounded border border-[#dbeafe]">
                  {app.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  {app.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-[#2b70af] transition-colors leading-snug">
                {app.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                {app.description}
              </p>
            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs mt-2">
              <span className="text-[11px] text-gray-400">제작: {app.author}</span>

              <div className="flex items-center gap-1.5">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => openEditModal(app)}
                      className="p-1 text-gray-400 hover:text-[#2b70af] hover:bg-gray-100 rounded transition cursor-pointer"
                      title="수정하기"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id, app.title)}
                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                      title="삭제하기"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {/* External link button */}
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#2b70af] hover:bg-[#1e588c] text-white text-[11px] font-bold rounded shadow-2xs transition-colors"
                >
                  <span>체험하기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {apps.length === 0 && (
        <div className="bg-white rounded-lg border border-[#d5dfea] p-10 text-center text-gray-500">
          <Laptop className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700 mb-1">
            등록된 바이브 코딩 구현작이 아직 없습니다.
          </p>
          <p className="text-xs text-gray-400">
            교직원 아이디어가 모이면 곧 첫 번째 멋진 웹앱이 여기에 등록됩니다!
          </p>
        </div>
      )}

      {/* Admin Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg border border-[#b8cde3] shadow-xl w-full max-w-md p-5 text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
              <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#2b70af]" />
                {editingAppId ? '바이브 코딩 구현작 수정' : '새 바이브 코딩 구현작 등록'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  웹앱 제목 <span className="text-[#ff6e35]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: NEIS 급식 식단 카드 뉴스 생성기"
                  required
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">카테고리</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">상태 태그</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="예: 개발완료, 운영중, 시범운영"
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  접속 링크 URL <span className="text-[#ff6e35]">*</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">상세 설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="앱의 주요 기능 및 어떤 교직원 아이디어를 반영하여 제작되었는지 적어주세요."
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af] resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">제작자/소속</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="예: 교직원 AI연구회 / 정보부"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2b70af] hover:bg-[#205788] text-white font-bold rounded shadow-xs transition cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
