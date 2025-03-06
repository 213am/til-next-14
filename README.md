# SEO

## http://localhost:3000 SEO 설정

- /src/pages/index.tsx
- 주의사항 : `import Head from "next/head";`
- meta 태그의 속성은 chatGPT 활용도 추천

```tsx
import GoodItem from "@/components/good-item";
import SearchLayout from "@/components/search-layout";
import { fetchGoods } from "@/lib/fetch-good";
import { fetchRandomGood } from "@/lib/fetch-random-good";
import styles from "@/pages/index.module.css";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { ReactNode } from "react";

// Next 에는 약속이 된 함수가 있다.
export const getStaticProps = async () => {
  // 병렬로 실행하기
  const [allGoods, randomGoods] = await Promise.all([
    fetchGoods(),
    fetchRandomGood(),
  ]);

  return {
    props: {
      allGoods: allGoods,
      randomGoods: randomGoods,
    },
    revalidate: 60, // 60초 후 다시 생성
  };
};

export default function Home({
  allGoods,
  randomGoods,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {/* 검색최적화를 위한 설정 */}
      <Head>
        <title>해외 쇼핑몰 추천 서비스</title>
        <meta name="description" content="해외 상품 추천서비스입니다" />
        {/* og 는 페이스북, 카카오톡 등 SNS 공유 시 설정 */}
        <meta property="og:title" content="해외 쇼핑몰 추천 서비스" />
        <meta property="og:description" content="해외 상품 추천서비스입니다" />
        <meta property="og:image" content="/thumbnail.png" />
      </Head>
      <div className={styles.container}>
        <section>
          <h3>지금 추천하는 상품</h3>
          {/* 3개만 랜덤하게 출력 */}
          {randomGoods.map((item) => (
            <GoodItem key={item.id} {...item} />
          ))}
        </section>
        <section>
          <h3>등록된 모든 상품</h3>
          {/* 전체 상품 출력 */}
          {allGoods.map((item) => (
            <GoodItem key={item.id} {...item} />
          ))}
        </section>
      </div>
    </>
  );
}

// JS 에서는 함수도 객체다.
// 객체는 속성을 추가할 수 있다.
Home.getLayout = (page: ReactNode) => {
  return <SearchLayout>{page}</SearchLayout>;
};
```

## http://localhost:3000/search?keyword=Jhon SEO 설정

- /src/pages/search.tsx

```tsx
import styles from "@/pages/search.module.css";
// 앱 라우터버전 import { useRouter } from "next/navigation";
import { useRouter } from "next/router";
// import goods from "@/mock/goods.json";
import GoodItem from "@/components/good-item";
import SearchLayout from "@/components/search-layout";
import { ReactNode, useEffect, useState } from "react";
import { GoodDataType } from "@/types";
import { fetchSearchGood } from "@/lib/fetch-search-good";
import Head from "next/head";

export default function Page() {
  const [goods, setGoods] = useState<GoodDataType[]>([]);
  const router = useRouter();
  const { keyword } = router.query;

  const fetchSearchResult = async () => {
    const data = await fetchSearchGood(keyword as string);
    setGoods(data);
  };

  useEffect(() => {
    // 키워드가 바뀌면 실행
    fetchSearchResult();
  }, [keyword]);

  return (
    <>
      <Head>
        <title>해외 쇼핑몰 {keyword} 검색 서비스</title>
        <meta
          name="description"
          content={`해외 상품 ${keyword} 검색서비스입니다`}
        />
        {/* og 는 페이스북, 카카오톡 등 SNS 공유 시 설정 */}
        <meta
          property="og:title"
          content={`해외 쇼핑몰 ${keyword} 검색 서비스`}
        />
        <meta
          property="og:description"
          content={`해외 상품 ${keyword} 검색서비스입니다`}
        />
        <meta property="og:image" content="/thumbnail.png" />
      </Head>
      <div className={styles.container}>
        <h4>
          <strong>{keyword}</strong> : 검색 결과
        </h4>
        <div>
          {goods.map((item) => (
            <GoodItem key={item.id} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchLayout>{page}</SearchLayout>;
};
```

## http://localhost:3000/good/1 SEO 설정

```tsx
import { fetchOneGood } from "@/lib/fetch-one-good";
import styles from "@/pages/good/[id].module.css";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
// 라우터가 동적인 경로가 필요로 한 상황이다.
// http://localhost:3000/good/[id]   ===> 파라메터
export function getStaticPaths() {
  return {
    // paths 에는 기본적으로 SSG 를 적용해서 데이터를 미리 생성후 반영할 경로
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    // fallback: false, // 위의 paths 에 없는 경로는 404 로 출력
    fallback: true, // 위의 paths 에 없는 경로는 레이아웃 렌더링 후 데이터 로드
    // fallback: "blocking", // 위의 paths 에 없는 경로는 즉시 SSR 로 생성
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  // 쿼리 스트링이 context 에 담겨있음.
  // const { keyword } = context.query;

  // 파라메터는 context 에 담겨있음.
  // 파라메터도 서버에서 문자열로만 온다.
  const id = context.params!.id;
  const data = await fetchOneGood(parseInt(id as string));
  return {
    props: {
      data: data || null,
    },
  };
}

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <>
        <Head>
          <title>해외 쇼핑몰 추천 서비스</title>
          <meta name="description" content="제품 정보가 없습니다" />
          {/* og 는 페이스북, 카카오톡 등 SNS 공유 시 설정 */}
          <meta property="og:title" content="해외 쇼핑몰 추천 서비스" />
          <meta property="og:description" content="제품 정보가 없습니다" />
          <meta property="og:image" content="/thumbnail.png" />
        </Head>
        <div>Loading...</div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Head>
          <title>해외 쇼핑몰 추천 서비스</title>
          <meta name="description" content="제품 정보가 없습니다" />
          {/* og 는 페이스북, 카카오톡 등 SNS 공유 시 설정 */}
          <meta property="og:title" content="해외 쇼핑몰 추천 서비스" />
          <meta property="og:description" content="제품 정보가 없습니다" />
          <meta property="og:image" content="/thumbnail.png" />
        </Head>
        <div>현재 데이터가 없습니다.</div>
      </>
    );
  }
  const { title, image, category, price, description, rating } = data;
  return (
    <>
      {/* 검색최적화를 위한 설정 */}
      <Head>
        <title>{title} 상세정보</title>
        <meta name="description" content={description} />
        {/* og 는 페이스북, 카카오톡 등 SNS 공유 시 설정 */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
      </Head>
      <div className={styles.container}>
        <div className={styles.title}>
          {title} <span>(${price})</span>
        </div>
        <div
          className={styles.cover_image}
          style={{ backgroundImage: `url(${image})` }}
        >
          <Image src={image} alt={title} width={245} height={350} />
        </div>
        <div className={styles.category}>{category}</div>
        <div className={styles.rating}>
          Rating : {rating.rate} | {rating.count}
        </div>
        <div className={styles.description}>{description}</div>
      </div>
    </>
  );
}
```
