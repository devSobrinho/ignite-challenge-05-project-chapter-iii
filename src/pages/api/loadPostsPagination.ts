import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  }
};
