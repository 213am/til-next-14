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
