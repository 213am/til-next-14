# **Next.js Page Router - SSR & Pre-rendering 이해하기**

## **1. Next.js 개요**

- Next.js는 **React 기반의 프레임워크**로, 편리한 개발 환경을 제공
- **Vercel(https://vercel.com/)**에서 React.js를 기반으로 개발한 프레임워크
- React는 UI 라이브러리이지만, Next.js는 **완전한 웹 애플리케이션 프레임워크**

### **💡 React vs. Next.js 간략한 차이**

| 항목              | React                         | Next.js                                                |
| ----------------- | ----------------------------- | ------------------------------------------------------ |
| **라우팅**        | `react-router-dom` 필요       | **파일 기반 라우팅 (자동 지원)**                       |
| **렌더링 방식**   | CSR (Client Side Rendering)   | **SSR, SSG, ISR 지원**                                 |
| **SEO 지원**      | ❌ 부족                       | ✅ **SEO 최적화 가능**                                 |
| **이미지 최적화** | ❌ 직접 최적화 필요           | ✅ `next/image` 자동 최적화                            |
| **코드 스플리팅** | 필요 시 직접 적용             | ✅ **자동 코드 스플리팅 지원**                         |
| **데이터 패칭**   | `fetch`, `axios` 등 직접 설정 | ✅ `getServerSideProps`, `getStaticProps` 등 기본 제공 |

---

## **2. Next.js 설치**

```bash
npx create-next-app@latest .
```

- 최신 버전 Next.js 설치
- 자동으로 프로젝트 구조 및 필수 라이브러리 설정

---

# **3. 사전 렌더링 (Pre-rendering) 개념**

## **💡 사전 렌더링이란?**

- Next.js는 기본적으로 **모든 페이지를 사전 렌더링**
- 서버에서 미리 HTML을 생성하여 클라이언트에 제공
- **FCP(First Contentful Paint) 속도를 향상시켜 초기 로딩 성능을 개선**

### **🛠 Pre-rendering 동작 과정**

1️⃣ 사용자가 웹사이트 URL에 접속  
2️⃣ 서버가 HTML을 **미리 생성** 후 클라이언트에 전달  
3️⃣ **React가 실행되면서 인터랙션 가능한 상태로 변환 (Hydration)**  
4️⃣ 사용자는 빠르게 로딩된 페이지를 보고, 이후에 JS가 적용되어 동적 기능이 활성화

---

# **4. CSR (Client Side Rendering, 클라이언트 사이드 렌더링)**

### **📌 CSR이란?**

- 기본적인 **React의 렌더링 방식**
- 서버는 **비어 있는 HTML만 제공**하고,  
  이후 JavaScript가 실행되어 브라우저에서 화면을 구성

### **🛠 CSR 렌더링 흐름**

1️⃣ **사용자 요청** → 웹서버에 HTML 요청  
2️⃣ **웹서버는 빈 HTML 반환**  
3️⃣ **브라우저에서 JavaScript 로드** (React 앱 실행)  
4️⃣ JavaScript 실행 후 **DOM을 생성하여 화면 표시**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React CSR</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- JS 실행 전까지는 빈 화면 -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### **⚠️ CSR의 문제점**

❌ **SEO 최적화 어려움** (검색 엔진이 빈 HTML만 인식)  
❌ **초기 로딩 속도 느림** (JavaScript 실행 전까지 화면이 안 보임)  
❌ **FCP, LCP 속도 저하**

### **✅ CSR의 장점**

✅ 한 번 로딩된 이후에는 **SPA처럼 빠르게 동작**  
✅ 사용자 경험(UX)이 우수

---

# **5. SSR (Server Side Rendering, 서버 사이드 렌더링)**

### **📌 SSR이란?**

- **Next.js의 대표적인 렌더링 방식**
- **서버에서 HTML을 완전히 생성하여 클라이언트에 전달**
- 이후 Hydration을 통해 React가 인터랙티브 기능을 활성화

### **🛠 SSR 렌더링 흐름**

1️⃣ **사용자 요청** → 웹 서버에서 HTML을 생성  
2️⃣ **서버에서 데이터 가져오기 (`getServerSideProps`)**  
3️⃣ **완성된 HTML을 클라이언트에 전달**  
4️⃣ **JS가 실행되면서 Hydration 발생 → 상호작용 가능**

```jsx
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return { props: { data } };
}

export default function Page({ data }) {
  return (
    <div>
      <h1>서버에서 데이터를 가져와 렌더링</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### **✅ SSR의 장점**

✅ **SEO에 최적화됨** (검색 엔진이 HTML을 크롤링 가능)  
✅ **초기 로딩 속도 개선 (FCP, LCP 향상)**  
✅ **사용자가 즉시 콘텐츠를 볼 수 있음**

### **⚠️ SSR의 단점**

❌ **서버 부하 증가** (요청마다 HTML을 새로 생성)  
❌ **페이지 이동 속도 느릴 수 있음**

---

# **6. Hydration & TTI (Time To Interactive) 이해**

### **💡 Hydration이란?**

- **서버에서 생성된 HTML을 React가 takeover하는 과정**
- Hydration이 완료되면 페이지가 **완전히 인터랙티브(상호작용 가능)한 상태**가 됨

```jsx
<div id="root">
  <h1>서버에서 렌더링된 HTML</h1>
</div>
<script>
  ReactDOM.hydrate(<App />, document.getElementById("root"));
</script>
```

### **💡 TTI (Time To Interactive)란?**

- **사용자가 웹페이지와 실제로 상호작용할 수 있는 시간**
- Hydration이 완료된 시점을 의미

**💡 TTI 최적화 방법**  
✅ JavaScript 코드 스플리팅 (`next/dynamic` 활용)  
✅ 불필요한 JS 실행 최소화 (`useEffect`, `useMemo` 최적화)  
✅ Web Worker 사용하여 무거운 작업 분리

---

# **7. SSR vs CSR 비교**

| 항목                 | CSR (Client Side Rendering) | SSR (Server Side Rendering) |
| -------------------- | --------------------------- | --------------------------- |
| **초기 로딩 속도**   | 느림 (JS 실행 필요)         | 빠름 (HTML 미리 렌더링)     |
| **SEO 최적화**       | ❌ 안됨                     | ✅ 최적화 가능              |
| **FCP 속도**         | 느림                        | 빠름                        |
| **서버 부하**        | 낮음                        | 높음                        |
| **페이지 이동 속도** | 빠름 (SPA)                  | 상대적으로 느림             |

---

# **8. 결론 & 실무 적용**

- Next.js는 **SSR과 CSR을 유연하게 조합하여 사용 가능**
- SEO가 중요한 페이지 → `getServerSideProps` 활용
- 빠른 로딩이 필요한 페이지 → `getStaticProps` 활용
- SSR과 SSG를 혼합하여 성능 최적화 (ISR 적용 가능)

# Router 란?

- uri 를 Router 라고 함
  - http://www.naver.com
  - http://www.naver.com/search?keyword=iu
  - http://www.naver.com/good/1

## Next 의 공통 사항

- 파일명, 폴더명이 약속되어있다
- 파일명, 폴더명에 따라서 기능도 약속되어있다

## Pages Router 방식

- Next.js 14 버전으로 진행
- 일반화 되어있는 개발 방식(많은 기업에서 도입해 운영중)
- 반드시 /src/pages 폴더에 있어야 라우터 역할
  - http://localhost:3000 접속시 `/src/pages/index.tsx`
  - http://localhost:3000/test 접속시 `/src/pages/test.tsx`
  - http://localhost:3000/todo 접속시 `/src/pages/todo.tsx` 또는 `/src/pages/todo/index.tsx`
  - http://localhost:3000/todo/setting 접속시 `/src/pages/todo/setting.tsx` 또는 `/src/pages/todo/setting/index.tsx`
  - http://localhost:3000/work/100 접속시 `/src/pages/work/[id].tsx`

## App Router 방식

- Next.js 15 버전으로 진행
- 향후 진행될 개발 방식
- 상당히 많은 부분이 개선, 최적화
- 반드시 /src/app 폴더에 있어야 라우터 역할
  - http://localhost:3000 접속시 `/src/app/page.tsx`
  - http://localhost:3000/test 접속시 `/src/app/test.tsx`
  - http://localhost:3000/todo 접속시 `/src/app/todo.tsx` 또는 `/src/app/todo/page.tsx`
  - http://localhost:3000/todo/setting 접속시 `/src/app/todo/setting.tsx` 또는 `/src/app/todo/setting/page.tsx`
  - http://localhost:3000/work/100 접속시 `/src/app/work/[id]/page.tsx`

# 프로젝트 구조

- public : 정적 파일, 최적화에서 제외
- src : root 폴더
  - src/pages : 라우터로 연결시킬 파일 및 폴더 배치
  - src/styles : css 는 **파일명.module.css** 가 기본
  - src/components : 컴포넌트 파일들

# 첫화면 만들기

- `/src/pages/index.tsx`
- http://localhost:3000

```tsx
export default function Home() {
  return <h1>Home</h1>;
}
```

# \_app.tsx

- `모든 페이지에 공통으로 적용할 내용` 작성

  - 공통 레이아웃, 공통 데이터, 공통 로직 등

- `페이지 파일이 아님`
- `import "@/styles/globals.css";` Next 에서 유일한 css import 문

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* 공통으로 출력하고 싶은 내용. 예) Header, Footer 등 */}
      <p>안녕하세요</p>
      <Component {...pageProps} />
    </>
  );
}
```

# \_document.tsx

- 모든 페이지에 환경 설정하는 곳
- HTML 의 구조를 담당
- 각 태그를 커스터마이징
- font, title, GA4 적용하는 파일

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

# next.config.mjs

- Next 환경설정

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // strict mode 끄기
};

export default nextConfig;
```

# globals.css / Home.module.css

- 모두 내용 초기화 후 직접 작성
