# Pages Router

## http://localhost:3000

- /src/pages/index.tsx

```tsx
export default function Home() {
  return <h1>Home</h1>;
}
```

## http://localhost:3000/search

- /src/pages/search.tsx

```tsx
export default function Page() {
  return <div>검색페이지</div>;
}
```

- http://localhost:3000/search?keyword=아이유
- query string 처리하기

```tsx
// import { useRouter } from "next/navigation"; // 15 버전 - app router
import { useRouter } from "next/router"; // 14 버전 - pages router

export default function Page() {
  const router = useRouter();
  const { keyword } = router.query;

  return (
    <div>
      검색 <b>{keyword}</b> 페이지
    </div>
  );
}
```

## http://localhost:3000/good/:id

- params 처리하기
- /src/pages/good/[id].tsx

```tsx
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  // id 는 파일명을 따른것
  const { id } = router.query;

  return (
    <div>
      <b>{id}</b>번 제품정보
    </div>
  );
}
```

## http://localhost:3000/nopage

- 없는 라우터 이동 시 -> Not Found 페이지
- 파일명은 정해져 있음
- /src/pages/404.tsx

```tsx
export default function Page() {
  return <div>잘못된 주소로 접근하셨습니다</div>;
}
```

# Navigation

## Link 를 이용해서 라우터를 이동

- Link 로 연결된 주소는 서버에서 사전 렌더링으로 html 이 생성됨
- 예시로 `모든 페이지에 보이는 주메뉴바`를 생성
- 모든 페이지에서 보이기 때문에, 위치는 `_app.tsx` 가 가장 좋음

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <>
      <header>
        <Link href={"/"}>홈</Link>
        &emsp;
        <Link href={"/search?keyword=아이유"}>검색 /search?keyword=아이유</Link>
        &emsp;
        <Link href={"/good/1"}>제품상세 /good/1</Link>
        &emsp;
        <button onClick={handleClick}>홈으로 이동하기</button>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <footer></footer>
    </>
  );
}
```
