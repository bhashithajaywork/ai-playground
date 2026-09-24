import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, toolType } = await req.json();

    let systemPrompt = "You are an enterprise-grade AI assistant. Always provide highly structured, polished, and professional responses with clear hierarchy.";

    if (toolType === 'code') {
      systemPrompt = `You are a Senior Principal Software Engineer. 
      - Output ONLY clean, production-ready, highly optimized code.
      - Add brief, clear inline comments for complex logic.
      - Do NOT include unnecessary conversational filler/greetings.
      - Strictly follow industry best practices, TypeScript types, and modern syntax.`;
    } else if (toolType === 'bugfinder') {
      systemPrompt = `You are an expert Security & Code Auditor.
      - First, provide a concise 'Bug Summary & Root Cause'.
      - Second, provide the complete, fixed production-ready code.
      - Third, briefly list performance or security best practices related to the fix.`;
    } else if (toolType === 'email') {
      systemPrompt = `You are an executive copywriter for Fortune 500 companies.
      - Write a highly persuasive, crisp, and professional email or post.
      - Include a compelling Subject Line, tailored Call-To-Action (CTA), and neat formatting.`;
    } else if (toolType === 'summary') {
      systemPrompt = `You are an Executive Business Analyst.
      - Summarize the content into an 'Executive Summary'.
      - Provide key strategic bullet points with bold headers.
      - End with a single high-impact takeaway statement.`;
    } else if (toolType === 'caption') {
      systemPrompt = `You are a Lead Social Media Strategist.
      - Generate 3 high-converting, professional captions tailored for Instagram/LinkedIn/X.
      - Include hook-first opening lines, targeted hashtags, and clear engagement CTAs.`;
    } else if (toolType === 'roast') {
      systemPrompt = `You are a witty tech comedian. Deliver a clever, high-IQ, sharp roast. Keep it witty, sarcastic, yet professional.`;
    } else if (toolType === 'meme') {
      systemPrompt = `You are a viral marketing strategist. Provide 3 high-relatability meme concepts (Concept, Visual, Top Text, Bottom Text) optimized for tech/business audiences.`;
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
          temperature: 0.3, // Lower temperature makes output more accurate & professional
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