# 📄 ТЗ — English AI Tutor

---

## 1. Суть проекта

English AI Tutor — это персональная веб-платформа для изучения английского языка с нуля до продвинутого уровня. Обучение ведёт ИИ (Claude API) в формате живого диалога.

---

## 2. Стек технологий

| Слой | Технология |
|---|---|
| Frontend | React |
| Backend | NestJS |
| База данных | PostgreSQL (Supabase) |
| ИИ | Claude API (claude-sonnet-4-20250514) |
| Хранение файлов | Supabase Storage |

---

## 3. Как всё работает — полный флоу

### 🟢 Первый запуск
```
Пользователь открывает сайт
→ Видит дашборд с кнопкой "Начать урок"
→ Прогресс пустой, история пустая
```

### 📖 Начало урока
```
Нажимает "Начать урок"
→ Фронт делает POST /lessons (создаёт урок в БД)
→ Запускается таймер 60:00
→ Фронт отправляет запрос к Claude API
→ ИИ смотрит карточки прошлых уроков из БД
→ ИИ сам выбирает тему исходя из слабых мест
→ ИИ начинает: "Сегодня наш урок — тема X..."
```

### 💬 Процесс урока
```
ИИ объясняет правило
→ Если правило табличное — выдаёт карточку
   с кнопкой [+ Сохранить в дневник]
→ Пользователь нажимает → POST /diary → сохраняется
→ ИИ даёт задачки → пользователь отвечает
→ Каждое сообщение → POST /lessons/:id/messages
→ ИИ проверяет ответы и объясняет ошибки
→ Так продолжается до таймера
```

### ⏰ Конец урока (таймер = 0)
```
Таймер заканчивается
→ Фронт блокирует input
→ Фронт отправляет финальный запрос к Claude API:
   "Урок окончен, подведи итог"
→ ИИ анализирует все ответы пользователя
→ ИИ возвращает JSON:
   {
     score: 78,
     topic: "Present Simple",
     strong: "утвердительные предложения",
     weak: "вопросы с do/does",
     summary: "текст резюме",
     next_recommendation: "повторить + добавить Present Continuous"
   }
→ PATCH /lessons/:id — сохраняем score и summary
→ Показываем экран с итогами урока
```

### 📓 Дневник правил
```
Пользователь переходит в "Дневник"
→ GET /diary — загружаем все карточки
→ Фильтр по темам
→ Поиск по названию
→ Можно удалить карточку
```

### 🏠 Дашборд
```
GET /lessons — история всех уроков
→ Показываем: дата, тема, score %
→ Общий прогресс по темам
→ Серия дней подряд (streak)
```

---

## 4. Дизайн

**Стиль:** тёмная тема, минималистично, похоже на Claude.ai

**Макет:**
- Левый сайдбар (fixed, 260px) — навигация
- Правая часть — чат / контент

**Цветовая палитра:**

| Назначение | Цвет |
|---|---|
| Фон сайдбара | #1a1a1a |
| Фон чата | #212121 |
| Карточки | #2a2a2a |
| Акцент | #7c3aed (фиолетовый) |
| Текст основной | #ffffff |
| Текст второстепенный | #8b8b8b |
| Таймер (< 5 минут) | #ef4444 (красный) |

**Компоненты UI:**
- Сайдбар: логотип, навигация (Уроки / Дневник), прогресс внизу
- Чат: аватар ИИ слева, сообщения пользователя справа в фиолетовых пузырях
- Карточка правила: тёмная карточка с таблицей и кнопкой "+ Сохранить в дневник"
- Таймер: в правом верхнем углу чата
- Инпут: закруглённое тёмное поле + кнопка отправки

---

## 5. Схема базы данных

### Таблица `lessons` — уроки

```sql
CREATE TABLE lessons (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date        DATE NOT NULL DEFAULT CURRENT_DATE,
    topic       VARCHAR(255),
    score       INTEGER,
    strong      TEXT,
    weak        TEXT,
    summary     TEXT,
    next_rec    TEXT,
    duration    INTEGER,
    status      VARCHAR(20) DEFAULT 'active',
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
```

### Таблица `lesson_messages` — сообщения урока

```sql
CREATE TABLE lesson_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id   UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL,
    content     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

### Таблица `diary_rules` — дневник правил

```sql
CREATE TABLE diary_rules (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id   UUID REFERENCES lessons(id) ON DELETE SET NULL,
    topic       VARCHAR(255),
    title       VARCHAR(255) NOT NULL,
    content     JSONB NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

### Индексы

```sql
CREATE INDEX idx_lesson_messages_lesson_id ON lesson_messages(lesson_id);
CREATE INDEX idx_diary_rules_topic ON diary_rules(topic);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lessons_date ON lessons(date);
```

### Связи

```
lessons (1) ──────── (many) lesson_messages
lessons (1) ──────── (many) diary_rules
```

---

## 6. API Endpoints

### Уроки

| Метод | Endpoint | Описание |
|---|---|---|
| POST | /lessons | Создать новый урок |
| GET | /lessons | История всех уроков |
| GET | /lessons/:id | Получить урок по ID |
| PATCH | /lessons/:id | Обновить урок (score, summary, topic) |

### Сообщения урока

| Метод | Endpoint | Описание |
|---|---|---|
| POST | /lessons/:id/messages | Сохранить сообщение |
| GET | /lessons/:id/messages | Загрузить все сообщения урока |

### Дневник правил

| Метод | Endpoint | Описание |
|---|---|---|
| POST | /diary | Сохранить правило |
| GET | /diary | Все правила (с фильтром по topic) |
| DELETE | /diary/:id | Удалить правило |

---

## 7. Структура NestJS

```
src/
├── lessons/
│   ├── lessons.controller.ts
│   ├── lessons.service.ts
│   ├── lessons.module.ts
│   └── dto/
│       ├── create-lesson.dto.ts
│       └── update-lesson.dto.ts
│
├── messages/
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   └── messages.module.ts
│
├── diary/
│   ├── diary.controller.ts
│   ├── diary.service.ts
│   └── diary.module.ts
│
├── database/
│   └── database.module.ts
│
└── app.module.ts
```

---

## 8. Логика ИИ — системный промпт

ИИ получает при каждом запросе:

```
1. Системный промпт (роль учителя, правила поведения)
2. Карточки-резюме прошлых уроков (из БД)
3. История текущего урока (все сообщения)
4. Сообщение пользователя
```

**Карточка-резюме урока (передаётся в контекст):**
```json
{
  "lesson": 5,
  "date": "2024-01-15",
  "topic": "Present Simple",
  "score": 78,
  "strong": "утвердительные предложения",
  "weak": "вопросы с do/does",
  "next_rec": "повторить тему + добавить Present Continuous"
}
```

**Формат карточки правила (выдаётся ИИ в чате):**
```json
{
  "type": "rule_card",
  "topic": "Глаголы",
  "title": "Глагол TO BE — таблица",
  "content": {
    "headers": ["Местоимение", "Форма", "Сокращение"],
    "rows": [
      ["I (Я)", "am", "I'm"],
      ["He / She / It", "is", "He's / She's / It's"],
      ["You / We / They", "are", "You're / We're / They're"]
    ]
  }
}
```

---

## 9. Страницы фронтенда

| Страница | Путь | Описание |
|---|---|---|
| Дашборд | / | Прогресс, история уроков, кнопка "Начать урок" |
| Урок | /lesson/:id | Живой чат с ИИ + таймер |
| Итоги урока | /lesson/:id/result | Score, резюме, слабые/сильные места |
| Дневник | /diary | Все сохранённые карточки правил |
