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
  apiKey: "AIzaSyC7aJarz6EyXsDGy9G-2pDgwSMEVgEFUhM",
  authDomain: "universitymerger.firebaseapp.com",
  projectId: "universitymerger",
  storageBucket: "universitymerger.firebasestorage.app",
  messagingSenderId: "18070832527",
  appId: "1:18070832527:web:b72adce16583f3d78137fa",
  measurementId: "G-CV3T2CKD0Z"
};
