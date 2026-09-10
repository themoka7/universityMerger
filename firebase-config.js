/* Firestore 공유 저장 설정.
 * Firebase 콘솔 → 프로젝트 설정 → 내 앱 → 웹 앱의 firebaseConfig 값을 그대로 넣으십시오.
 * 이 파일을 그대로 두면(projectId 가 아래 문구 그대로면) 공유 저장 없이
 * 각자 브라우저에만 저장됩니다.
 *
 * Firestore 규칙 예시 (콘솔 → Firestore → 규칙):
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /tasks/{doc}  { allow read, write: if true; }
 *       match /meta/{doc}   { allow read, write: if true; }
 *     }
 *   }
 *   ↑ 링크를 아는 누구나 고칠 수 있는 설정입니다. 교내 공개 범위를 좁히려면
 *     Google 로그인을 붙이고 request.auth.token.email.matches('.*@pusan[.]ac[.]kr')
 *     조건을 거십시오.
 */
window.FIREBASE_CONFIG = {
  apiKey: "여기에-apiKey",
  authDomain: "여기에-프로젝트.firebaseapp.com",
  projectId: "여기에-projectId",
  storageBucket: "여기에-프로젝트.appspot.com",
  messagingSenderId: "여기에-senderId",
  appId: "여기에-appId"
};
