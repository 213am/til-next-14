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
