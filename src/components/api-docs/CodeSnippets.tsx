'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';

export const CodeSnippets: React.FC = () => {
  const [lang, setLang] = useState<'curl' | 'python' | 'node' | 'php'>('curl');
  const [copied, setCopied] = useState(false);

  const snippets: Record<string, string> = {
    curl: `curl -X POST https://api.clearcut.ai/v1/remove-bg \\
  -H "X-Api-Key: cc_live_YOUR_API_KEY" \\
  -F "image_file=@product.jpg" \\
  -F "format=png" \\
  -F "size=4k" \\
  -o "cutout.png"`,

    python: `import requests

response = requests.post(
    "https://api.clearcut.ai/v1/remove-bg",
    headers={"X-Api-Key": "cc_live_YOUR_API_KEY"},
    files={"image_file": open("product.jpg", "rb")},
    data={"format": "png", "size": "4k"}
)

if response.status_code == 200:
    with open("cutout.png", "wb") as f:
        f.write(response.content)
    print("Background removed successfully!")`,

    node: `import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const form = new FormData();
form.append('image_file', fs.createReadStream('product.jpg'));
form.append('format', 'png');

const res = await fetch('https://api.clearcut.ai/v1/remove-bg', {
  method: 'POST',
  headers: {
    'X-Api-Key': 'cc_live_YOUR_API_KEY',
    ...form.getHeaders()
  },
  body: form
});

const buffer = await res.buffer();
fs.writeFileSync('cutout.png', buffer);
console.log('Background removed!');`,

    php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.clearcut.ai/v1/remove-bg",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => [
    'image_file' => new CURLFile('product.jpg'),
    'format' => 'png'
  ],
  CURLOPT_HTTPHEADER => [
    "X-Api-Key: cc_live_YOUR_API_KEY"
  ],
]);

$response = curl_exec($curl);
file_put_contents("cutout.png", $response);
curl_close($curl);
?>`,
  };

  const currentCode = snippets[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setLang('curl')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              lang === 'curl'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            cURL
          </button>
          <button
            onClick={() => setLang('python')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              lang === 'python'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Python
          </button>
          <button
            onClick={() => setLang('node')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              lang === 'node'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Node.js
          </button>
          <button
            onClick={() => setLang('php')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              lang === 'php'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PHP
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-teal-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
        <code>{currentCode}</code>
      </pre>
    </div>
  );
};
