#!/usr/bin/env python3
"""
Transcreve audio em chunks pequenos (word-level) para sincronização de legendas.
Saída: JSON com {t0, t1, text} por chunk (3-6 palavras cada).

Uso: python3 transcribe-words.py <audio.mp3> <output.json>
Deve rodar no env 'chatterbox' (torch + whisper).
"""

import json
import sys
from pathlib import Path
import whisper
import torch


def chunk_words(words, max_chars=32, max_gap=0.4):
    """Agrupa palavras em chunks curtos (para caption pacing)."""
    chunks = []
    cur = {'t0': None, 't1': None, 'text': ''}
    for w in words:
        if cur['t0'] is None:
            cur['t0'] = w['start']
        gap_too_big = cur['t1'] is not None and (w['start'] - cur['t1']) > max_gap
        would_overflow = len(cur['text']) + len(w['word']) > max_chars
        if gap_too_big or would_overflow:
            cur['text'] = cur['text'].strip()
            if cur['text']:
                chunks.append(cur)
            cur = {'t0': w['start'], 't1': None, 'text': ''}
        cur['text'] += w['word']
        cur['t1'] = w['end']
    if cur['text'].strip():
        cur['text'] = cur['text'].strip()
        chunks.append(cur)
    return chunks


def main():
    audio = sys.argv[1]
    out_json = sys.argv[2]
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f'[whisper] device={device} loading large-v3...', flush=True)
    model = whisper.load_model('large-v3', device=device)
    result = model.transcribe(
        audio, language='pt', fp16=(device == 'cuda'),
        word_timestamps=True, verbose=False,
    )
    words = []
    for seg in result['segments']:
        for w in seg.get('words', []):
            words.append({
                'start': round(w['start'], 3),
                'end': round(w['end'], 3),
                'word': w['word'],
            })
    chunks = chunk_words(words, max_chars=28, max_gap=0.4)
    output = {'language': result.get('language', 'pt'), 'chunks': chunks, 'words': words}
    Path(out_json).write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'[whisper] {len(words)} palavras -> {len(chunks)} chunks -> {out_json}', flush=True)


if __name__ == '__main__':
    main()
