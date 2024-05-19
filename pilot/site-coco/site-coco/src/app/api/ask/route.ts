import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

async function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      const { query, prev_messages, new_chat, user_id } = await req.json();
      console.log(query)

      const response = await fetch(`http://localhost:7000/ask?query=${encodeURIComponent(query)}&prev_messages=${prev_messages}&new_chat=${new_chat}&user_id=${encodeURIComponent(user_id)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return NextResponse.json(data, {
        status: 200,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, {
        status: 500,
      });
    }
  } else {
    // res.setHeader('Allow', ['POST']);
    return NextResponse.json({ error: 'Internal Server Error' }, {
        status: 500,
      });
  }
}
export {handler as POST}