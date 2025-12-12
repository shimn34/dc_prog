# DB_SPEC (簡易)
## コレクション構造（ユーザー単位）
- /users/{uid}
  - uid: string
  - email: string|null
  - displayName: string|null
  - createdAt: timestamp
  - lastLogin: timestamp

- /users/{uid}/courses/{courseId}
  - courseName: string
  - teacher: string
  - room: string
  - year: number (例: 2025)
  - semester: string ("前期" / "後期")
  - day: number (1=月 ... 6=土)
  - period: number (1~6)
  - weight: object (任意) 例 { assignments:40, exam:60 }
  - createdAt, updatedAt: timestamp

- /users/{uid}/courses/{courseId}/assignments/{assignmentId}
  - title: string
  - score: number|null
  - maxScore: number (default 100)
  - weight: number
  - createdAt, updatedAt: timestamp

- /users/{uid}/courses/{courseId}/attendance/meta
  - present: number
  - absent: number

## 設計方針
- 課題が未入力(score==null) のものは進捗計算から除外（計算保留）
- 時間割は course の day & period で特定
- ユーザー固有データはすべて users/{uid} 以下に格納
