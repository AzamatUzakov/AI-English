export interface Lesson {
  id: string;
  date: string;
  topic: string | null;
  score: number | null;
  strong: string | null;
  weak: string | null;
  summary: string | null;
  nextRec: string | null;
  duration: number | null;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
  messages?: LessonMessage[];
}

export interface LessonMessage {
  id: string;
  lessonId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface DiaryRule {
  id: string;
  lessonId: string | null;
  topic: string | null;
  title: string;
  content: any; // Contains structured markdown / table info
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Lessons
  getLessons: (): Promise<Lesson[]> => {
    return request<Lesson[]>('/lessons');
  },

  createLesson: (topic?: string): Promise<Lesson> => {
    return request<Lesson>('/lessons', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  },

  getLessonById: (id: string): Promise<Lesson> => {
    return request<Lesson>(`/lessons/${id}`);
  },

  generateLessonSummary: (id: string): Promise<Lesson> => {
    return request<Lesson>(`/lessons/${id}/summary`, {
      method: 'POST',
    });
  },

  // Messages
  getLessonMessages: (lessonId: string): Promise<LessonMessage[]> => {
    return request<LessonMessage[]>(`/lessons/${lessonId}/messages`);
  },

  sendMessage: (lessonId: string, role: 'user' | 'assistant', content: string): Promise<LessonMessage> => {
    return request<LessonMessage>(`/lessons/${lessonId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ role, content }),
    });
  },

  // Diary Rules
  getDiaryRules: (topic?: string): Promise<DiaryRule[]> => {
    const query = topic ? `?topic=${encodeURIComponent(topic)}` : '';
    return request<DiaryRule[]>(`/diary${query}`);
  },

  saveDiaryRule: (lessonId: string | null, topic: string, title: string, content: any): Promise<DiaryRule> => {
    return request<DiaryRule>('/diary', {
      method: 'POST',
      body: JSON.stringify({ lessonId, topic, title, content }),
    });
  },

  deleteDiaryRule: (id: string): Promise<{ success: boolean }> => {
    return request<{ success: boolean }>(`/diary/${id}`, {
      method: 'DELETE',
    });
  },
};
