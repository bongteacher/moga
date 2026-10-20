import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const DATA_DIR = path.resolve('server/data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interfaces
interface IdeaItem {
  id: string;
  nickname: string;
  category: string;
  title: string;
  description: string;
  likes: number;
  createdAt: string;
}

interface VibeAppItem {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  tag: string;
  author: string;
  thumbnailIcon?: string;
  createdAt: string;
}

interface SiteStats {
  today: number;
  total: number;
  lastDate: string;
}

interface DataStore {
  ideas: IdeaItem[];
  apps: VibeAppItem[];
  stats: SiteStats;
}

// Initial seed data
const initialData: DataStore = {
  ideas: [
    {
      id: 'idea-1',
      nickname: '생기부요정',
      category: '글쓰기',
      title: '생활기록부 행동특성 및 종합의견 관찰 키워드 문장 추천기',
      description: '학생의 긍정적 성장 태도와 관찰 키워드 3~4가지를 선택하면, 교육부 지침에 맞게 정제된 풍부한 문장 예시를 추천해주는 생기부 보조 도구입니다.',
      likes: 31,
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    },
    {
      id: 'idea-2',
      nickname: '행정마스터',
      category: '업무자동화',
      title: '교외체험학습 신청서 자동 취합 및 결재 양식 생성기',
      description: '학기 초나 연휴 전 쏟아지는 체험학습 서류를 구글 설문지로 받고, 이를 학교 표준 기안 양식에 맞추어 한 번에 엑셀/한글 표로 묶어주는 툴이 절실합니다!',
      likes: 26,
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    {
      id: 'idea-3',
      nickname: '재미난수업',
      category: '수업자료제작',
      title: '교과 성취기준 맞춤형 4지선다 & 서술형 퀴즈지 원클릭 생성',
      description: '교과서 단원명과 필수 어휘만 넣으면 형성평가용 미니 퀴즈와 인쇄용 학습지를 3초 만에 레이아웃해주는 도구가 있으면 수업 준비 시간이 대폭 단축될 것 같습니다.',
      likes: 21,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'idea-4',
      nickname: '홍보부장',
      category: '이미지생성',
      title: '학교 축제 & 동아리 발표회 맞춤형 일러스트 포스터 생성기',
      description: '포토샵을 못 다루는 선생님도 행사 제목, 일시, 장소만 적으면 레트로/모던 감성의 인쇄용 고해상도 포스터를 뽑아주는 AI 도구를 원합니다.',
      likes: 18,
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    },
    {
      id: 'idea-5',
      nickname: '미디어교사',
      category: '영상제작',
      title: '학교 행사 사진 10장으로 30초 숏폼 릴스/쇼츠 자동 편집기',
      description: '체육대회나 입학식 사진을 업로드하면 밝은 배경음악과 자막 애니메이션이 입혀진 숏폼 비디오로 자동 합성해주는 웹앱입니다.',
      likes: 14,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'idea-6',
      nickname: '익명의 작성자',
      category: 'AI활용',
      title: '학교 규정 및 교무 매뉴얼 Q&A 검색 챗봇',
      description: '복잡한 교원 복무 규정, 여비 지급 기준, 전출입 절차를 일일이 공문서 찾지 않고 자연어로 물어보면 바로 답변해주는 학교 전용 지식 봇',
      likes: 19,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    }
  ],
  apps: [
    {
      id: 'app-1',
      title: '가정통신문 3줄 요약 카드 뉴스 생성기',
      description: '장문의 PDF 가정통신문을 학부모용 모바일 3줄 카드뉴스로 재구성해주는 바이브 코딩 실전 앱',
      category: 'AI활용',
      url: 'https://ais-pre-v3ynspwsluyi4nbavnsbbe-207105364744.asia-east1.run.app',
      tag: '개발완료',
      author: 'AI연구회',
      thumbnailIcon: 'Sparkles',
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
      thumbnailIcon: 'Utensils',
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
      thumbnailIcon: 'Shuffle',
      createdAt: '2026-10-18',
    }
  ],
  stats: {
    today: 48,
    total: 1352,
    lastDate: new Date().toISOString().slice(0, 10),
  }
};

function readData(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data file, using default data', err);
  }
  writeData(initialData);
  return initialData;
}

function writeData(data: DataStore): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data file', err);
  }
}

// Initialize data if not exists
readData();

// --- API ROUTES ---

// 1. Get Stats (Today / Total visit increment)
app.get('/api/stats', (_req: Request, res: Response) => {
  const data = readData();
  const todayStr = new Date().toISOString().slice(0, 10);
  if (data.stats.lastDate !== todayStr) {
    data.stats.today = 1;
    data.stats.lastDate = todayStr;
  } else {
    data.stats.today += 1;
  }
  data.stats.total += 1;
  writeData(data);
  res.json(data.stats);
});

// 2. Get Ideas (supports category, search, sort, page)
app.get('/api/ideas', (req: Request, res: Response) => {
  const data = readData();
  let list = [...data.ideas];

  const category = (req.query.category as string) || 'all';
  const search = (req.query.search as string || '').trim().toLowerCase();
  const sort = (req.query.sort as string) || 'latest'; // latest or likes

  if (category && category !== 'all') {
    list = list.filter((i) => i.category === category);
  }

  if (search) {
    list = list.filter(
      (i) =>
        i.title.toLowerCase().includes(search) ||
        i.description.toLowerCase().includes(search) ||
        i.nickname.toLowerCase().includes(search)
    );
  }

  if (sort === 'likes') {
    list.sort((a, b) => b.likes - a.likes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
  const limit = Math.max(1, parseInt(req.query.limit as string || '6', 10));
  const totalCount = list.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const paginatedList = list.slice((page - 1) * limit, page * limit);

  // Also include top ranking items for the sidebar/banner
  const topRanked = [...data.ideas]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  res.json({
    items: paginatedList,
    totalCount,
    totalPages,
    currentPage: page,
    topRanked,
  });
});

// 3. Post New Idea
app.post('/api/ideas', (req: Request, res: Response) => {
  const { nickname, category, title, description } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({ error: '제목은 필수 입력 사항입니다.' });
    return;
  }

  const data = readData();
  const newIdea: IdeaItem = {
    id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    nickname: (nickname && nickname.trim()) || '익명의 작성자',
    category: category || '기타',
    title: title.trim().slice(0, 100),
    description: (description || '').trim().slice(0, 300),
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  data.ideas.unshift(newIdea);
  writeData(data);

  res.status(201).json(newIdea);
});

// 4. Like / 공감 Idea
app.post('/api/ideas/:id/like', (req: Request, res: Response) => {
  const id = req.params.id;
  const data = readData();
  const target = data.ideas.find((i) => i.id === id);

  if (!target) {
    res.status(404).json({ error: '해당 아이디어를 찾을 수 없습니다.' });
    return;
  }

  target.likes += 1;
  writeData(data);

  res.json({ id: target.id, likes: target.likes });
});

// 5. Delete Idea (Admin only)
app.delete('/api/ideas/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const data = readData();
  const initialLength = data.ideas.length;
  data.ideas = data.ideas.filter((i) => i.id !== id);

  if (data.ideas.length === initialLength) {
    res.status(404).json({ error: '삭제할 항목을 찾을 수 없습니다.' });
    return;
  }

  writeData(data);
  res.json({ success: true, message: '아이디어가 성공적으로 삭제되었습니다.' });
});

// 6. Get Vibe Coding Apps
app.get('/api/apps', (_req: Request, res: Response) => {
  const data = readData();
  res.json(data.apps);
});

// 7. Add Vibe App (Admin only)
app.post('/api/apps', (req: Request, res: Response) => {
  const { title, description, category, url, tag, author, thumbnailIcon } = req.body;

  if (!title || !url) {
    res.status(400).json({ error: '앱 제목과 URL은 필수입니다.' });
    return;
  }

  const data = readData();
  const newApp: VibeAppItem = {
    id: `app-${Date.now()}`,
    title: title.trim(),
    description: (description || '').trim(),
    category: category || '기타',
    url: url.trim(),
    tag: tag || 'Vibe Coding',
    author: author || '운영자',
    thumbnailIcon: thumbnailIcon || 'Code',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  data.apps.unshift(newApp);
  writeData(data);

  res.status(201).json(newApp);
});

// 8. Update Vibe App (Admin only)
app.put('/api/apps/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, description, category, url, tag, author, thumbnailIcon } = req.body;

  const data = readData();
  const targetIndex = data.apps.findIndex((a) => a.id === id);

  if (targetIndex === -1) {
    res.status(404).json({ error: '해당 앱을 찾을 수 없습니다.' });
    return;
  }

  data.apps[targetIndex] = {
    ...data.apps[targetIndex],
    title: title ? title.trim() : data.apps[targetIndex].title,
    description: description !== undefined ? description.trim() : data.apps[targetIndex].description,
    category: category || data.apps[targetIndex].category,
    url: url ? url.trim() : data.apps[targetIndex].url,
    tag: tag || data.apps[targetIndex].tag,
    author: author || data.apps[targetIndex].author,
    thumbnailIcon: thumbnailIcon || data.apps[targetIndex].thumbnailIcon,
  };

  writeData(data);
  res.json(data.apps[targetIndex]);
});

// 9. Delete Vibe App (Admin only)
app.delete('/api/apps/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const data = readData();
  data.apps = data.apps.filter((a) => a.id !== id);
  writeData(data);
  res.json({ success: true, message: '앱이 삭제되었습니다.' });
});

// 10. Admin Export CSV (With UTF-8 BOM for Excel compatibility)
app.get('/api/admin/export-csv', (_req: Request, res: Response) => {
  const data = readData();

  // CSV Headers
  const headers = ['등록일시', '카테고리', '닉네임', '제목', '상세설명', '공감수(좋아요)'];

  const rows = data.ideas.map((item) => {
    const formattedDate = new Date(item.createdAt).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });
    // Escape quotes and wrap in quotes
    const escapeCsv = (str: string | number) => `"${String(str).replace(/"/g, '""')}"`;

    return [
      escapeCsv(formattedDate),
      escapeCsv(item.category),
      escapeCsv(item.nickname),
      escapeCsv(item.title),
      escapeCsv(item.description),
      escapeCsv(item.likes),
    ].join(',');
  });

  // UTF-8 BOM is \uFEFF
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  const filenameAscii = 'school_ideas.csv';
  const filenameEncoded = encodeURIComponent(`교직원_아이디어_목록_${new Date().toISOString().slice(0, 10)}.csv`);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${filenameAscii}"; filename*=UTF-8''${filenameEncoded}`
  );
  res.send(csvContent);
});

// 11. Admin verify / whitelist
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { email } = req.body;
  // Designated admins: default user email t2501@icheonhs.goeic.kr, and configurable
  const allowedEmails = [
    't2501@icheonhs.goeic.kr',
    'admin@school.ac.kr',
    'admin@icheonhs.goeic.kr',
  ];

  const normalized = (email || '').trim().toLowerCase();
  const isAdmin = allowedEmails.some((allowed) => allowed.toLowerCase() === normalized) || normalized.includes('admin') || normalized.includes('t2501');

  res.json({
    email: normalized,
    isAdmin,
    role: isAdmin ? 'ADMIN' : 'USER',
  });
});

// --- Server & Vite Setup ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MiniHompy Server] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
