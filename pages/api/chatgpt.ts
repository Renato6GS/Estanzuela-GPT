import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Límite de imagenes
    },
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const modelToUse = 'gpt-4o'; // gpt-4o-mini - gpt-4-turbo - ...

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { prompt, typeOfMessage, imageBase64 } = req.body;

  if (!prompt && !imageBase64) {
    return res.status(400).json({ error: 'Prompt or Image is required' });
  }

  try {
    if (typeOfMessage === 'image') {
      const completion = await openai.images.generate({ prompt });
      return res.status(200).json(completion.data[0]?.url ?? 'Ha fallado la generación de la imagen...');
    }

    if (typeOfMessage === 'image_data' && imageBase64) {
      const response = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
      });
      return res.status(200).json(response.choices[0]?.message?.content ?? 'No se pudo interpretar la imagen.');
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: modelToUse,
    });
    return res
      .status(200)
      .json(completion.choices[0]?.message?.content ?? 'Ha fallado la generación de la respuesta...');
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    return res.status(500).json({ error: 'Error communicating with OpenAI API' });
  }
};

export default handler;
