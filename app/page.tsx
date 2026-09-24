'use client';

import { useState } from 'react';

type ToolType = 'roast' | 'caption' | 'code' | 'meme' | 'summary';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [toolType, setToolType] = useState<ToolType>('roast');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const tools = [
    { id: 'roast', label: '🔥 Roast Engine', placeholder: 'Enter a post, text, or bio to roast...' },
    { id: 'caption', label: '✨ Caption Generator', placeholder: 'What is your photo or video about?' },
    { id: 'code', label: '💻 Code Explainer', placeholder: 'Paste your code here to explain...' },
    { id: 'meme', label: '🎭 Meme Ideas', placeholder: 'Enter a topic or situation for meme ideas...' },
    { id: 'summary', label: '📝 Summarizer', placeholder: 'Paste long text or essay to summarize...' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, toolType }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setResult('Error: ' + (data.error || 'Failed to generate content.'));
      }
    } catch (err) {
      setResult('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const activeTool = tools.find((t) => t.id === toolType);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          ⚡ AI Playground
        </h1>

        {/* Tool Selection Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setToolType(t.id as ToolType);
                setResult('');
              }}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                toolType === t.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={activeTool?.placeholder}
            className="w-full h-36 p-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              Generating...
            </>
          ) : (
            'Generate Magic ✨'
          )}
        </button>

        {/* Output Area */}
        {result && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Output:</p>
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}