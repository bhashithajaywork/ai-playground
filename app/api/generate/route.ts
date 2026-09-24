import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, toolType } = await req.json();

    let systemPrompt = "You are a helpful and witty AI assistant.";

    if (toolType === 'roast') {
      systemPrompt = "You are a hilarious and brutal social media roaster. Roast the user's input concisely with sharp humor.";
    } else if (toolType === 'caption') {
      systemPrompt = "You are an expert social media manager. Generate 3 engaging Instagram/TikTok captions with hashtags for the given topic.";
    } else if (toolType === 'code') {
      systemPrompt = "You are a senior software developer. Explain the provided code clearly and concisely in simple terms, highlighting what it does and key parts.";
    } else if (toolType === 'meme') {
      systemPrompt = "You are a creative meme creator. Provide 3 funny meme concepts (Visual Idea + Top Text + Bottom Text) based on the user's topic.";
    } else if (toolType === 'summary') {
      systemPrompt = "You are an expert editor. Summarize the user's text into clear, bullet-pointed key takeaways, followed by a 1-sentence summary.";
    }

    // Dynamic model fetching
    const allModels = await groq.models.list();
    
    const validModels = allModels.data.filter(m => 
      !m.id.includes('guard') && 
      !m.id.includes('whisper') && 
      !m.id.includes('distil') && 
      !m.id.includes('safetensors')
    );

    if (validModels.length === 0) {
      throw new Error("No valid text generation model found.");
    }

    let completion = null;
    let lastError = null;

    for (const modelObj of validModels) {
      try {
        completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          model: modelObj.id,
        });
        if (completion) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!completion) {
      throw lastError || new Error("Failed to generate response with available models.");
    }

    const responseText = completion.choices[0]?.message?.content || "No response generated.";

    return NextResponse.json({ result: responseText });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}