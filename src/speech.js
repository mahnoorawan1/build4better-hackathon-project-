/**
 * Text-to-speech helpers.
 * English: browser speechSynthesis.
 * Urdu: pre-recorded MP3s from /audio/ur/{id}.mp3
 */

import { urduAudioUrl } from './audioCatalog'

const ENGLISH_LANGS = ['en-US', 'en-GB', 'en']

let activeAudio = null
let speakGeneration = 0

function getVoicesSafe() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  return window.speechSynthesis.getVoices() || []
}

export function ensureVoicesLoaded() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([])
      return
    }

    getVoicesSafe()
    const existing = getVoicesSafe()
    if (existing.length > 0) {
      window.setTimeout(() => resolve(getVoicesSafe()), 120)
      return
    }

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      window.speechSynthesis.removeEventListener('voiceschanged', finish)
      resolve(getVoicesSafe())
    }

    window.speechSynthesis.addEventListener('voiceschanged', finish)
    window.setTimeout(finish, 1200)
  })
}

function pickVoice(voices, preferredLangs) {
  for (const pref of preferredLangs) {
    const exact = voices.find(
      (voice) => voice.lang && voice.lang.toLowerCase() === pref.toLowerCase()
    )
    if (exact) return exact
  }
  for (const pref of preferredLangs) {
    const prefix = pref.split('-')[0].toLowerCase()
    const partial = voices.find(
      (voice) => voice.lang && voice.lang.toLowerCase().startsWith(prefix)
    )
    if (partial) return partial
  }
  return null
}

function normalizeSpeechPayload(payload) {
  if (!payload) return { en: '', ur: '', urAudio: null }
  if (typeof payload === 'string') {
    const hasUrdu = /[\u0600-\u06FF]/.test(payload)
    return hasUrdu
      ? { en: '', ur: payload, urAudio: null }
      : { en: payload, ur: '', urAudio: null }
  }
  return {
    en: payload.en || '',
    ur: payload.ur || '',
    urAudio: payload.urAudio || null,
  }
}

export function buildSpeechQueue(payload, language) {
  const { en, ur, urAudio } = normalizeSpeechPayload(payload)
  const chunks = []

  if (language === 'en' && en.trim()) {
    chunks.push({ kind: 'en', text: en.trim() })
  }
  if (language === 'ur') {
    const audioSrc = urduAudioUrl(urAudio)
    if (audioSrc) {
      chunks.push({ kind: 'ur-audio', src: audioSrc, id: urAudio })
    } else if (ur.trim()) {
      // No clip mapped — skip silent failure by noting empty for UI.
      chunks.push({ kind: 'ur-missing', text: ur.trim() })
    }
  }

  if (chunks.length === 0 && language !== 'ur' && en.trim()) {
    chunks.push({ kind: 'en', text: en.trim() })
  }

  return chunks
}

function stopActiveAudio() {
  if (!activeAudio) return
  try {
    activeAudio.onended = null
    activeAudio.onerror = null
    activeAudio.pause()
    activeAudio.removeAttribute('src')
    activeAudio.load()
  } catch {
    // ignore
  }
  activeAudio = null
}

export function stopAllSpeech() {
  speakGeneration += 1
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  stopActiveAudio()
}

function playAudioSrc(src, generation) {
  return new Promise((resolve, reject) => {
    if (generation !== speakGeneration) {
      resolve({ stopped: true })
      return
    }

    stopActiveAudio()
    const audio = new Audio(src)
    activeAudio = audio
    let settled = false

    const finish = (fn, value) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      if (activeAudio === audio) activeAudio = null
      fn(value)
    }

    const timeoutId = window.setTimeout(() => {
      try {
        audio.pause()
      } catch {
        // ignore
      }
      finish(reject, new Error('audio-timeout'))
    }, 120000)

    audio.onended = () => finish(resolve, { stopped: false })
    audio.onerror = () => finish(reject, new Error('audio-error'))

    const playPromise = audio.play()
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch((err) => finish(reject, err))
    }
  })
}

function speakEnglish(text, voices, generation) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve({ ok: false, stopped: false, reason: 'unsupported' })
      return
    }
    if (generation !== speakGeneration) {
      resolve({ ok: false, stopped: true })
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    const voice = pickVoice(voices, ENGLISH_LANGS)
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    } else {
      utterance.lang = 'en-US'
    }

    let finished = false
    const finish = (payload) => {
      if (finished) return
      finished = true
      resolve(payload)
    }

    utterance.onend = () => finish({ ok: true, stopped: false })
    utterance.onerror = (event) => {
      const errorType = event?.error || ''
      if (errorType === 'interrupted' || errorType === 'canceled' || generation !== speakGeneration) {
        finish({ ok: false, stopped: true })
        return
      }
      finish({ ok: false, stopped: false, reason: 'error' })
    }

    window.setTimeout(() => {
      if (generation !== speakGeneration) {
        finish({ ok: false, stopped: true })
        return
      }
      try {
        window.speechSynthesis.resume()
        window.speechSynthesis.speak(utterance)
      } catch {
        finish({ ok: false, stopped: false, reason: 'error' })
      }
    }, 40)
  })
}

/**
 * Speak English via TTS or Urdu via pre-recorded MP3.
 */
export async function speakSpeechPayload(payload, language, { onStart, onEnd, onError } = {}) {
  if (typeof window === 'undefined') {
    return { ok: false, reason: 'unsupported' }
  }

  const chunks = buildSpeechQueue(payload, language)
  if (chunks.length === 0) {
    return { ok: false, reason: 'empty' }
  }

  if (chunks.some((chunk) => chunk.kind === 'ur-missing')) {
    return { ok: false, reason: 'missing-audio' }
  }

  stopAllSpeech()
  const generation = speakGeneration
  const voices = language === 'en' ? await ensureVoicesLoaded() : []

  if (generation !== speakGeneration) {
    return { ok: false, reason: 'stopped' }
  }

  if (onStart) onStart()

  try {
    for (const chunk of chunks) {
      if (generation !== speakGeneration) {
        return { ok: false, reason: 'stopped' }
      }

      if (chunk.kind === 'ur-audio') {
        try {
          const result = await playAudioSrc(chunk.src, generation)
          if (result.stopped || generation !== speakGeneration) {
            return { ok: false, reason: 'stopped' }
          }
        } catch {
          if (onError) onError()
          return { ok: false, reason: 'error' }
        }
        continue
      }

      const spoken = await speakEnglish(chunk.text, voices, generation)
      if (spoken.stopped || generation !== speakGeneration) {
        return { ok: false, reason: 'stopped' }
      }
      if (!spoken.ok) {
        if (onError) onError()
        return { ok: false, reason: spoken.reason || 'error' }
      }
    }

    if (generation !== speakGeneration) {
      return { ok: false, reason: 'stopped' }
    }

    if (onEnd) onEnd()
    return { ok: true }
  } catch {
    if (onError) onError()
    return { ok: false, reason: 'error' }
  }
}
