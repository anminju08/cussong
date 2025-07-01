# cussong 🎵

직접 노래를 업데이트하여 듣고 싶은 것만 들을 수 있는 나만의 뮤직플레이어

## Features

- 🎧 Add, update, delete, and retrieve songs
- 🗂 Song metadata includes title, artist, album, duration, and file URL
- 🧾 RESTful API endpoints
- 📦 MySQL integration with raw SQL (no ORM)

## 기술스택

프론트
----
- React
- TypeScript
- Tailwind CSS

백
---
- Python 3.11
- FastAPI
- MySQL
- Uvicorn

## 📁 파일구조

```
.
├── cussong
│   ├── config.json
│   ├── prompt
│   └── supabase_discarded_migrations
│       └── 20250630110343_shy_glitter.sql
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── src
│   ├── App.tsx
│   ├── backend
│   │   ├── init_db.py
│   │   └── main.py
│   ├── components
│   │   ├── AudioPlayer.tsx
│   │   ├── PlaylistManager.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SongList.tsx
│   │   └── SongUploadForm.tsx
│   ├── hooks
│   │   └── useAudioPlayer.ts
│   ├── index.css
│   ├── lib
│   ├── main.tsx
│   ├── services
│   │   └── musicService.ts
│   ├── types
│   │   └── index.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## API 

- `GET /songs` - Get all songs
- `GET /songs/{id}` - Get song by ID
- `POST /songs` - Add a new song
- `PUT /songs/{id}` - Update a song
- `DELETE /songs/{id}` - Delete a song

## 실행방법

### 프론트엔드

```bash
npm install
npm run dev
```

### 백엔드

```bash
cd src/backend
uvicorn main:app --reload
```