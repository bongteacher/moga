import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  Trash2,
  Boxes,
  LogIn,
  LogOut,
  Mail,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { IdeaItem, TabType, VibeAppItem } from '../types';

interface AdminViewProps {
  isAdmin: boolean;
  adminEmail: string;
  ideas: IdeaItem[];
  apps: VibeAppItem[];
  onLogin: (email: string) => Promise<boolean>;
  onLogout: () => void;
  onDeleteIdea: (id: string) => Promise<void>;
  setActiveTab: (tab: TabType) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  isAdmin,
  adminEmail,
  ideas,
  apps,
  onLogin,
  onLogout,
  onDeleteIdea,
  setActiveTab,
}) => {
  const [emailInput, setEmailInput] = useState(adminEmail || 't2501@icheonhs.goeic.kr');
  const [loginError, setLoginError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsProcessing(true);

    const success = await onLogin(emailInput);
    setIsProcessing(false);

    if (!success) {
      setLoginError(
        '운영자 권한이 등록되지 않은 계정입니다. 지정된 학교 관리자 이메일(t2501@icheonhs.goeic.kr 등)로 로그인해 주세요.'
      );
    }
  };

  const handleDownloadCsv = () => {
    setExportNotice(true);
    try {
      const headers = ['등록일시', '카테고리', '닉네임', '제목', '상세설명', '공감수(좋아요)'];
      const escapeCsv = (str: string | number) => `"${String(str || '').replace(/"/g, '""')}"`;
      const rows = ideas.map((item) => [
        escapeCsv(new Date(item.createdAt).toLocaleString('ko-KR')),
        escapeCsv(item.category),
        escapeCsv(item.nickname),
        escapeCsv(item.title),
        escapeCsv(item.description),
        escapeCsv(item.likes),
      ].join(','));
      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `교직원_아이디어_목록_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.location.href = '/api/admin/export-csv';
    }
    setTimeout(() => setExportNotice(false), 5000);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`[운영자 확인] 정말로 아래 제안을 삭제하시겠습니까?\n\n"${title}"`)) {
      await onDeleteIdea(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#d5dfea]">
        <div>
          <h2 className="text-base font-bold text-[#1e3a5f] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2b70af]" />
            운영자 관리 센터 (Admin Console)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            지정된 교직원 운영자만 접근 가능하며, 제안 관리 및 CSV 데이터 다운로드가 가능합니다.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        )}
      </div>

      {!isAdmin ? (
        /* Not logged in: Google Account Login Box */
        <div className="bg-white border border-[#d5dfea] rounded-lg p-6 max-w-lg mx-auto shadow-xs text-xs">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">운영자 구글 계정 인증</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              학교 관리자 및 담당자 구글 계정으로 인증하시면<br />
              의견 삭제, 바이브 코딩 웹앱 등록, CSV 다운로드 권한이 부여됩니다.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                관리자 구글 이메일 주소
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="예: t2501@icheonhs.goeic.kr"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#2b70af]"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                기본 등록 관리자: <code>t2501@icheonhs.goeic.kr</code> (원클릭 인증 가능)
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2 bg-[#2b70af] hover:bg-[#1e588c] disabled:opacity-50 text-white font-bold rounded shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>{isProcessing ? '인증 확인 중...' : '구글 운영자 로그인'}</span>
            </button>
          </form>
        </div>
      ) : (
        /* Logged In Admin Dashboard */
        <div className="space-y-4">
          {/* Admin Banner & Quick Stats */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <div className="font-bold text-emerald-900">
                  {adminEmail} <span className="text-[11px] font-normal text-emerald-700">(운영자 인증 완료)</span>
                </div>
                <div className="text-[11px] text-emerald-700">
                  총 제안 {ideas.length}건 | 등록된 바이브 앱 {apps.length}건
                </div>
              </div>
            </div>

            {/* Action Buttons: CSV & Project ZIP */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="/minihompy-project.zip"
                download="school-vibe-hompy.zip"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#2b70af] hover:bg-[#1f588d] text-white font-bold rounded shadow-xs transition cursor-pointer text-xs"
                title="GitHub에 업로드할 수 있는 전체 소스코드 압축파일 다운로드"
              >
                <Download className="w-4 h-4 text-blue-200" />
                <span>깃허브 업로드용 ZIP 다운로드</span>
              </a>

              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow-xs transition cursor-pointer self-start sm:self-auto text-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>의견 목록 CSV 다운로드</span>
                <Download className="w-3.5 h-3.5 text-emerald-200" />
              </button>
            </div>
          </div>

          {exportNotice && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                CSV 파일 다운로드가 시작되었습니다. 엑셀에서 한글이 깨지지 않도록 UTF-8 BOM 인코딩이 적용되었습니다.
              </span>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border border-[#d5dfea] p-3.5 rounded-lg flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-gray-800 mb-0.5">바이브 코딩 구현작 관리</h4>
                <p className="text-[11px] text-gray-500">신규 웹앱 추가, 수정 및 삭제</p>
              </div>
              <button
                onClick={() => setActiveTab('gallery')}
                className="px-2.5 py-1.5 bg-[#2b70af] hover:bg-[#1e588c] text-white rounded font-medium transition cursor-pointer flex items-center gap-1"
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>갤러리 바로가기</span>
              </button>
            </div>

            <div className="bg-white border border-[#d5dfea] p-3.5 rounded-lg flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-gray-800 mb-0.5">교직원 제안 전체 보기</h4>
                <p className="text-[11px] text-gray-500">모아보기 페이지에서 편리하게 검색</p>
              </div>
              <button
                onClick={() => setActiveTab('archive')}
                className="px-2.5 py-1.5 bg-[#f0f4f9] hover:bg-[#e2e8f0] text-gray-700 rounded font-medium transition cursor-pointer border border-[#cbd5e1]"
              >
                모아보기 이동
              </button>
            </div>
          </div>

          {/* Full Idea Management Table */}
          <div className="bg-white border border-[#d5dfea] rounded-lg p-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#1e3a5f] mb-3 flex items-center justify-between">
              <span>제안 목록 일괄 관리 (총 {ideas.length}건)</span>
              <span className="text-xs text-gray-400 font-normal">부적절하거나 중복된 제안은 즉시 삭제할 수 있습니다.</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-gray-200 text-gray-600 font-medium">
                    <th className="py-2 px-2.5 w-20">카테고리</th>
                    <th className="py-2 px-2.5">제목 및 상세내용</th>
                    <th className="py-2 px-2.5 w-24">작성자</th>
                    <th className="py-2 px-2.5 w-16 text-center">공감수</th>
                    <th className="py-2 px-2.5 w-24">등록일</th>
                    <th className="py-2 px-2.5 w-16 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ideas.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fbfcfe]">
                      <td className="py-2.5 px-2.5">
                        <span className="text-[11px] font-semibold text-[#2b70af] bg-[#eff6ff] px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5">
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        {item.description && (
                          <div className="text-[11px] text-gray-500 truncate max-w-md">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-2.5 text-gray-600">{item.nickname}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono font-bold text-[#ff6e35]">
                        {item.likes}
                      </td>
                      <td className="py-2.5 px-2.5 text-gray-400 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ideas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-400">
                        등록된 아이디어가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
