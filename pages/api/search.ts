// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { search } from '../../services/search';

type Data = {
  name?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | any>
) {
  const query =  req.query.q as string;
  const { results } = await search({query: query});
  res.status(200).json(results);
}
