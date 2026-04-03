'use server';
/**
 * @fileOverview A selfie mixer AI agent that combines a Guru photo with a user photo.
 * 
 * - mixSelfie - A function that handles the composite image generation.
 * - SelfieMixerInput - Input type for the mixer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SelfieMixerInputSchema = z.object({
  guruPhotoUri: z.string().describe("Guru Ji portrait URL or data URI."),
  userPhotoUri: z.string().describe("User photo data URI."),
});

export async function mixSelfie(input: z.infer<typeof SelfieMixerInputSchema>) {
  return selfieMixerFlow(input);
}

/**
 * Downloads an image from a URL and converts it to a base64 data URI.
 */
async function fetchImageAsBase64(url: string): Promise<string> {
  if (url.startsWith('data:')) return url;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error("Error fetching Guru photo:", error);
    throw new Error("Could not process Guru Ji's pose image. Please try again.");
  }
}

const selfieMixerFlow = ai.defineFlow(
  {
    name: 'selfieMixerFlow',
    inputSchema: SelfieMixerInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const guruBase64 = await fetchImageAsBase64(input.guruPhotoUri);

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      prompt: [
        { media: { url: guruBase64 } },
        { media: { url: input.userPhotoUri } },
        { text: "Combine these two photos into a single high-quality portrait. Place the Guru Ji subject and the user subject side-by-side in a serene, spiritual setting. Ensure lighting and blending are professional." },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
        ]
      },
    });

    if (!media) {
      throw new Error('AI was unable to generate the selfie. Please ensure both photos are clear and try again.');
    }

    return media.url;
  }
);