# ISR

- Incremental Static Regeneration
- 정적 페이지 즉 SSG 로 생성된 페이지를 다시 생성하는 법

### /src/pages/index.tsx

```tsx
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
```

## API 호출로 재생성

### API 생성

- /src/pages/api/revalidate.ts
- http://localhost:3000/api/revalidate

```ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // `/src/pages/index.tsx` 를 재생성하라
    await res.revalidate("/");
    return res.json({ revalidate: true });
  } catch (error) {
    console.log(error);
    return res.status(200).send("Error Revalidate");
  }
}
```

### fetch 생성

- /src/lib/fetch-revalidate.ts

```ts
export const fetchRevalidate = async () => {
  const url = "http://localhost:3000/api/revalidate";

  try {
    await fetch(url);
  } catch (error) {
    console.log(error);
  }
};
```

## API 실행

```tsx
onClick = { fetchRevalidate };
```

# 실제 API 서버 연동 처리

- /src/pages/api/getallgood.ts

  ```ts
  import type { NextApiRequest, NextApiResponse } from "next";
  import { GoodDataType } from "@/types";

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GoodDataType[]>
  ) {
    const data = await fetch("https://fakestoreapi.com/products");
    const jsonData = await data.json();
    res.status(200).json(jsonData);
  }
  ```

- /src/pages/api/onegood.ts

  ```ts
  import type { NextApiRequest, NextApiResponse } from "next";
  import { GoodDataType } from "@/types";

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GoodDataType | null>
  ) {
    // 요청(req)에 의한 Params 처리하기
    // URI 는 무조건 문자열로 처리됩니다.
    const { id } = req.query;
    const data = await fetch(`https://fakestoreapi.com/products/${id}`);
    const jsonData = await data.json();

    res.status(200).json(jsonData || null);
  }
  ```

- /src/pages/api/randomgood.ts

  ```ts
  import type { NextApiRequest, NextApiResponse } from "next";
  import { GoodDataType } from "@/types";

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GoodDataType[]>
  ) {
    // 전체 데이터에서 랜덤하게 3개만 추출하기
    const data = await fetch(`https://fakestoreapi.com/products`);
    const jsonData = await data.json();
    const randomGoods = jsonData.sort(() => Math.random() - 0.5).slice(0, 3);
    res.status(200).json(randomGoods);
  }
  ```

- /src/pages/api/searchgood.ts

  ```ts
  import type { NextApiRequest, NextApiResponse } from "next";
  import { GoodDataType } from "@/types";

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GoodDataType[]>
  ) {
    // 요청(req)에 의한 쿼리(query) 처리하기
    const { keyword } = req.query;
    const data = await fetch(`https://fakestoreapi.com/products`);
    const jsonData = await data.json();
    const filterGoods = jsonData.filter((good: GoodDataType) =>
      good.title.includes(keyword as string)
    );
    res.status(200).json(filterGoods);
  }
  ```

- 실제 서버가 있다면 API 가 정상적이므로 실행이 되지만, 지금은 build 시 생성 불가

# 활성화된 서버로 연결하기 위해 fetch 를 직접 처리

- /src/lib/fetch-good.ts

```ts
import { GoodDataType } from "@/types";

export const fetchGoods = async (): Promise<GoodDataType[]> => {
  const url = "https://fakestoreapi.com/products";
  try {
    // axios 사용해됩니다. 하지만, fetch 를 사용하자.
    // 여기서 fetch 는 Next 에서 추천하고 기능이 더 추가됨.
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};
```

- /src/lib/fetch-one-good.ts

```ts
import { GoodDataType } from "@/types";

export const fetchOneGood = async (
  id: number
): Promise<GoodDataType | null> => {
  // const url = `http://localhost:3000/api/onegood?id=${id}`;
  const url = "https://fakestoreapi.com/products";
  try {
    const response = await fetch(url);
    // console.log(response);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch goods");
    // }
    let data = await response.json();
    data = data.find((good: GoodDataType) => good.id === id);

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
```

- /src/lib/fetch-random-good.ts

```ts
import { GoodDataType } from "@/types";

export const fetchRandomGood = async (): Promise<GoodDataType[]> => {
  // const url = "http://localhost:3000/api/randomgoods";
  const url = "https://fakestoreapi.com/products";
  try {
    const response = await fetch(url);
    // console.log(response);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch goods");
    // }
    let data = await response.json();

    data = data.sort(() => Math.random() - 0.5).slice(0, 3);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
```

- /src/lib/fetch-search-good.ts

```ts
import { GoodDataType } from "@/types";

export const fetchSearchGood = async (
  keyword: string
): Promise<GoodDataType[]> => {
  // const url = `http://localhost:3000/api/searchgood?keyword=${keyword}`;
  const url = "https://fakestoreapi.com/products";
  try {
    const response = await fetch(url);
    //console.log(response);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch goodss");
    // }
    let data = await response.json();
    data = data.filter((good: GoodDataType) =>
      good.title.includes(keyword as string)
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
```
