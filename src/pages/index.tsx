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
