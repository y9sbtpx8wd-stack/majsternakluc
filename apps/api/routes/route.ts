// pages/api/inzeraty.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([
    { id: 1, title: 'Prvý testovací inzerát' },
    { id: 2, title: 'Druhý testovací inzerát' }
  ]);
}
