'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Flame, Code2, Laugh, FileText, Copy, Check, 
  Terminal, Zap, LayoutDashboard, History, Bug, Mail, Globe, Play
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type ToolType = 'roast' | 'caption' | 'code' | 'meme' | 'summary' | 'bugfinder' | 'email';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [toolType, setToolType] = useState<ToolType>('code');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tools = [
    { id: 'code', label: 'Code Generator', icon: Code2, placeholder: 'Write a function in Python/JS to...', quick: 'Create a React button component with Tailwind hover effects' },
    { id: 'bugfinder', label: 'Bug Fixer', icon: Bug, placeholder: 'Paste buggy code to debug and fix...', quick: 'function add(a, b) { return a - b; } // fixing sum logic' },
    { id: 'roast', label: 'Roast Engine', icon: Flame, placeholder: 'Enter a post, text, or bio to roast...', quick: 'Roast my Twitter profile bio: "Always coding, coffee lover"' },
    { id: 'caption', label: 'Caption Generator', icon: Sparkles, placeholder: 'What is your photo or video about?', quick: 'A serene sunset at Mirissa beach with palm trees' },
    { id: 'meme', label: 'Meme Ideas', icon: Laugh, placeholder: 'Enter a topic for viral meme ideas...', quick: 'Debugging code in production at 3 AM' },
    { id: 'summary', label: 'Summarizer', icon: FileText, placeholder: 'Paste long text to summarize...', quick: 'Overview of Quantum Computing in simple terms...' },
    { id: 'email', label: 'Cold Email / Post', icon: Mail, placeholder: 'Describe the topic for email or LinkedIn post...', quick: 'Pitching Jay Solutions Web Design services to a client' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult('');
    setCopied(false);

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

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeTool = tools.find((t) => t.id === toolType);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-purple-500 selection:text-white">
      
      {/* TOP HEADER */}
      <header className="w-full bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2 rounded-xl shadow-lg shadow-purple-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
              AI PLAYGROUND
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">v2.5 • GROQ HIGH-SPEED ENGINE</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Groq API Active
          </span>
          <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </span>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">AI Modules</h2>
            <div className="space-y-1.5">
              {tools.map((t) => {
                const Icon = t.icon;
                const isActive = toolType === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setToolType(t.id as ToolType);
                      setResult('');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20' 
                        : 'bg-slate-950/40 text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </div>
                    {isActive && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">ACTIVE</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Preset */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Quick Preset Prompt</h3>
            <button 
              onClick={() => setPrompt(activeTool?.quick || '')}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/60 text-xs text-slate-300 hover:border-purple-500/50 transition-all truncate"
            >
              "{activeTool?.quick}"
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                {activeTool && <activeTool.icon className="w-5 h-5 text-purple-400" />}
                <h2 className="text-lg font-bold text-white">{activeTool?.label} Workspace</h2>
              </div>
              <span className="text-xs font-mono text-slate-500">PROMPT INPUT</span>
            </div>

            {/* Input Box */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTool?.placeholder}
              className="w-full h-36 p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/80 resize-none transition-all placeholder:text-slate-600 text-sm leading-relaxed font-mono"
            />

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Magic Output
                </>
              )}
            </button>

            {/* OUTPUT AREA (VS CODE & TERMINAL STYLE) */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="rounded-xl bg-[#1e1e1e] border border-slate-700/80 overflow-hidden shadow-2xl"
                >
                  {/* VS Code Window Header */}
                  <div className="bg-[#252526] px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="text-xs text-slate-400 font-mono ml-2 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-purple-400" />
                        {toolType === 'code' || toolType === 'bugfinder' ? 'output.js — VS Code' : 'terminal_output.txt'}
                      </span>
                    </div>

                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* VS Code Syntax Highlighted Output */}
                  <div className="p-2 text-sm overflow-x-auto max-h-[450px]">
                    {toolType === 'code' || toolType === 'bugfinder' ? (
                      <SyntaxHighlighter 
                        language="javascript" 
                        style={vscDarkPlus}
                        customStyle={{ background: 'transparent', padding: '1rem', margin: 0, fontSize: '0.875rem' }}
                      >
                        {result}
                      </SyntaxHighlighter>
                    ) : (
                      <pre className="p-4 text-slate-200 font-sans whitespace-pre-wrap leading-relaxed text-sm">
                        {result}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-5 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} AI Playground. Built by Jay Solutions.
        </div>
      </footer>

    </div>
  );
}