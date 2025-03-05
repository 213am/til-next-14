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
