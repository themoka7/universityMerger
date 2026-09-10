# 대학 통합 추진 일정판

통합 추진 과제를 **단계 · 주관부서 · 기간 · 담당자** 기준으로 정리하고, 회의 중에 바로 추가·수정할 수 있는 공유 웹 일정판입니다.

## 구성

| 파일 | 설명 |
| --- | --- |
| `merger-schedule.html` | 일정판 본체. Claude Artifact 소스(게시 시 `<!doctype>`·`<head>`·`<body>` 골격이 자동으로 감싸집니다) |
| `docs/index.html` | GitHub Pages로 배포되는 단독 HTML. `build.py`가 위 파일을 감싸 생성 |
| `docs/firebase-config.js` | Firestore 공유 저장 설정. 채우지 않으면 각자 브라우저 저장으로 동작 |
| `build.py` | `merger-schedule.html` → `index.html` · `docs/index.html` 빌드 |
| `seed/tasks.json` | 초기 과제 27건. Artifact 데이터베이스 `tasks` 컬렉션에 주입한 값이자, 공유 저장에 연결하지 못한 화면에서 쓰는 기본 일정 |

`merger-schedule.html`을 고친 뒤에는 반드시 `python3 build.py`를 실행해 `docs/index.html`을 다시 만들어야 Pages에 반영됩니다. `docs/firebase-config.js`는 이미 있으면 덮어쓰지 않습니다.

## 기능

### 일정 캔버스 — 마우스로 직접 그리는 화면

가로축이 시간입니다. 폼을 채우는 대신 캔버스에서 바로 잡습니다.

| 동작 | 결과 |
| --- | --- |
| 빈 곳을 좌우로 끌기 | 끈 구간이 기간인 새 과제 생성 (주 단위로 맞춰짐) |
| 노드 끌기 | 일정 이동. 위아래로 옮겨 배치도 정리 |
| 노드 좌·우 끝 끌기 | 시작일·종료일 조절 |
| 노드 오른쪽 동그라미 → 다른 노드 | 선행관계 연결 (가장자리에서 자동 스크롤) |
| 선 클릭 | 그 선행관계 끊기 |
| 노드 클릭 | 오른쪽 상세 패널에서 부서·담당자·상태·산출물 수정 |
| `Delete` / `Esc` | 선택 과제 삭제 / 선택 해제 |
| 자동 정렬 | 단계별로 겹치지 않게 재배치 |

배율은 분기·월·주 3단계. 순환 참조(A→B→A)는 만들 수 없습니다.

### 그 밖에

- **과제 목록** — 단계·과제·주관부서·담당자·기간·상태 표, 산출물/협조부서/선행과제 포함
- **부서별** — 부서 카드마다 담당 과제와 미완 건수
- **필터** — 주관부서 칩, 상태(예정·진행중·완료·지연·보류), 과제·담당자 검색
- **선후관계 경고** — 선행이 끝나기 전에 시작하도록 잡힌 과제는 노드 빨간 테두리, 선 점선, 표 경고문, 요약 지표로 드러남
- **상태 자동 판정** — 종료일이 지난 미완료 과제는 `지연`으로 표시
- **D-Day** — 통합 개교 목표일까지 남은 일수. 목표일과 일정판 제목은 화면에서 변경
- **CSV 내려받기** — 현재 필터가 적용된 목록을 UTF-8 BOM CSV로 저장(엑셀 바로 열림)

## 데이터 구조

Artifact 데이터베이스(`db` 기능)에 저장되며, 열려 있는 모든 화면에 실시간 반영됩니다.

```
tasks/<id>   { title, phase, dept, coop, owner, start, end, status, deps[], y, deliverable, note, updatedAt }
meta/board   { title, target }
```

- `phase` — 표시 순서대로 `p1` 합의 / `p2` 신청 / `p3` 법규 정비 / `p4` 학사·조직 설계 / `p5` 시스템·인프라 / `p7` 학사 개시 준비 / `p6` 개교·안정화
  (`p7`은 나중에 추가돼 id가 순서와 어긋나지만, 화면 순서는 `PHASES` 배열이 정한다)
- `deps` — 선행과제 id 배열
- `y` — 캔버스 세로 위치(px). 없으면 단계별로 자동 배치
- `status` — `todo` / `doing` / `done` / `late` / `hold`
- `start`, `end` — `YYYY-MM-DD`

공유 저장소에 연결할 수 없는 환경(GitHub Pages, 로컬 파일 등)에서는 `seed/tasks.json`을 내장한 기본 일정을 띄우고 이후 변경은 그 브라우저의 `localStorage`에만 저장합니다. 화면 상단에 그 사실을 안내합니다.

## 화면 디자인

부산대학교 교육정보시스템의 화면 규칙을 따릅니다 — 남색 상단바와 녹색 라인, 각진 흰 카드에 옅은 청회색 헤더 밴드, 라벨·파란 숫자·기준일 캡션 3단 지표 카드, 고딕 서체, 낮은 모서리 반경. 단계 색은 남색 → 파랑 → 청록 → 녹색 → 겨자 → 주황 → 적색 순서로 진행 단계를 나타냅니다.

## 공유 저장 (Firestore)

Pages에는 서버가 없으므로 기본값은 **각자 브라우저 저장**입니다. 여러 부서가 같은 일정을 함께 고치려면 Firestore를 붙입니다.

1. Firebase 콘솔에서 프로젝트 → **Firestore Database** 만들기
2. 프로젝트 설정 → 내 앱 → 웹 앱 등록 후 `firebaseConfig` 값 복사
3. `docs/firebase-config.js`의 `window.FIREBASE_CONFIG`에 붙여넣고 커밋·푸시
4. Firestore → 규칙:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{doc} { allow read, write: if true; }
    match /meta/{doc}  { allow read, write: if true; }
  }
}
```

설정이 인식되면 화면 오른쪽 아래 표시가 `Firebase 공유 저장`으로 바뀌고, 한 사람이 고친 일정이 다른 사람 화면에 바로 반영됩니다.

**위 규칙은 링크를 아는 누구나 읽고 고칠 수 있습니다.** 교내로 좁히려면 Google 로그인을 붙이고 규칙을 다음과 같이 겁니다.

```
allow read, write: if request.auth != null
  && request.auth.token.email.matches('.*@pusan[.]ac[.]kr');
```

Firestore SDK는 jsDelivr에서 `firebase@10.14.1` compat 빌드를 불러옵니다. compat API가 Artifact의 저장소 API와 모양이 같아 저장 코드는 양쪽이 동일합니다.

## GitHub Pages

`.github/workflows/pages.yml`이 `main` 푸시마다 `docs/`를 배포합니다 (Pages Source: GitHub Actions).
주소: **https://themoka7.github.io/universityMerger/**
Pages는 `docs/firebase-config.js`를 채우면 공유 저장, 비워 두면 각자 브라우저 저장으로 동작합니다.

## 학사 개시 준비 체인

`p7` 단계는 순서가 어긋나면 뒤가 전부 막히는 실무 체인입니다.

```
모집단위·전공 구조 확정 (입학과)
  → 학과·전공 코드 신설 + 구코드 매핑 (교무과·정보전산원)
    → 전공 교육과정 편성 / 교양 영역·교양선택 편성 (학사과)
      → 개설강좌 등록·담당교원 배정 (교무과)
        → 시간표 편성·강의실 배정 (교무과)
```

`deps`로 이 관계를 걸어두면 일정을 당기거나 미룰 때 뒤에 걸린 과제가 바로 경고로 드러납니다.

## 시드 데이터에 관하여

`seed/tasks.json`의 과제 목록과 날짜는 실제 확정 일정이 아니라 **회의에서 채워 넣기 위한 표준 골격**입니다. 부서 구성, 소요 기간, 법정 시한(예: 대교협 전형계획 사전예고)은 각 기관 상황에 맞게 조정해서 쓰십시오.
