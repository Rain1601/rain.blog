'use client';

import styles from './page.module.css';

interface Props {
  projectId: string;
}

export default function ProductIllustration({ projectId }: Props) {
  switch (projectId) {
    case 'uteki':
      return <UtekiIllustration />;
    case 'sumi':
      return <SumiIllustration />;
    case 'muses':
      return <MusesIllustration />;
    default:
      return <ComingSoonIllustration />;
  }
}

/**
 * Uteki: Candlestick chart + hand squiggle
 * Bold thick strokes, terracotta fills, like a quick marker sketch
 * 3 candlestick bars (recognizable trading theme) + hand motif below
 */
function UtekiIllustration() {
  return (
    <svg viewBox="0 0 420 500" className={styles.illustration} fill="none">
      {/* === Candlestick chart — bold, simple, 3 bars === */}
      <g className={styles.illustrationFloat}>
        {/* Bar 1 — bearish (filled), tall */}
        <path d="M100 55 L100 105" stroke="#d97757" strokeWidth="6" strokeLinecap="round"/>
        <path d="M80 105 C82 100, 118 100, 120 105 L120 200 C118 205, 82 205, 80 200Z" fill="#d97757"/>
        <path d="M100 200 L100 260" stroke="#d97757" strokeWidth="6" strokeLinecap="round"/>

        {/* Bar 2 — bullish (outline), medium */}
        <path d="M210 110 L210 155" stroke="#d97757" strokeWidth="6" strokeLinecap="round"/>
        <path d="M188 155 C190 150, 230 150, 232 155 L232 245 C230 250, 190 250, 188 245Z"
              stroke="#d97757" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M210 245 L210 290" stroke="#d97757" strokeWidth="6" strokeLinecap="round"/>

        {/* Bar 3 — bearish (filled), short */}
        <path d="M320 130 L320 165" stroke="#d97757" strokeWidth="6" strokeLinecap="round"/>
        <path d="M298 165 C300 160, 340 160, 342 165 L342 225 C340 230, 300 230, 298 225Z" fill="#d97757"/>
        <path d="M320 225 L320 280" stroke="#d97757" strokeWidth="6" strokeLinecap="round"/>
      </g>

      {/* === Hand squiggle — white, bold, confident === */}
      <g className={styles.illustrationFloatReverse}>
        {/* Wavy hand shape — like Anthropic's signature motif */}
        <path d="M80 340 C88 312, 100 345, 115 318 C130 291, 118 342, 138 320 C158 298, 145 340, 165 325 C178 315, 180 338, 188 330"
              stroke="rgba(255,255,255,0.92)" strokeWidth="10" strokeLinecap="round"/>
        {/* Loop */}
        <path d="M188 330 C205 345, 220 328, 215 308 C210 288, 190 295, 192 318 C194 341, 218 350, 240 338"
              stroke="rgba(255,255,255,0.88)" strokeWidth="9" strokeLinecap="round"/>
        {/* Tail curving down */}
        <path d="M240 338 C258 325, 265 355, 255 385 C245 415, 225 435, 210 450"
              stroke="rgba(255,255,255,0.82)" strokeWidth="8" strokeLinecap="round"/>
        {/* Terracotta dot at loop junction */}
        <circle cx="195" cy="318" r="13" fill="#d97757"/>
      </g>
    </svg>
  );
}

/**
 * Sumi: Microphone + hand squiggle
 * Bold terracotta mic head with thick white outline (like Image #16 browser style)
 * Sound wave arcs + hand motif below
 */
function SumiIllustration() {
  return (
    <svg viewBox="0 0 420 500" className={styles.illustration} fill="none">
      {/* === Microphone — bold, sketched object style === */}
      <g className={styles.illustrationFloat}>
        {/* Mic head — terracotta filled rounded shape */}
        <path d="M170 55 C175 30, 260 28, 265 55 L270 190 C268 220, 177 222, 172 190Z"
              fill="#d97757"/>
        {/* White outline frame — slightly offset (like Image #16 browser frame) */}
        <path d="M162 48 C168 20, 268 18, 274 48 L280 198 C277 232, 168 234, 164 198Z"
              stroke="rgba(255,255,255,0.9)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Mic grille — 3 horizontal lines */}
        <path d="M192 90 L248 90" stroke="rgba(255,255,255,0.6)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M190 125 L250 125" stroke="rgba(255,255,255,0.55)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M192 160 L248 160" stroke="rgba(255,255,255,0.5)" strokeWidth="5" strokeLinecap="round"/>

        {/* Mic stand */}
        <path d="M220 232 L220 310" stroke="#d97757" strokeWidth="8" strokeLinecap="round"/>
        {/* Base */}
        <path d="M170 308 L270 308" stroke="#d97757" strokeWidth="8" strokeLinecap="round"/>
      </g>

      {/* === Hand squiggle — white, bold === */}
      <g className={styles.illustrationFloatReverse}>
        <path d="M75 360 C85 335, 95 365, 110 342 C125 319, 115 358, 135 340 C150 325, 148 355, 162 345"
              stroke="rgba(255,255,255,0.9)" strokeWidth="9" strokeLinecap="round"/>
        {/* Small loop */}
        <path d="M162 345 C178 358, 190 342, 185 325 C180 308, 163 313, 165 332"
              stroke="rgba(255,255,255,0.85)" strokeWidth="8" strokeLinecap="round"/>
        {/* Tail */}
        <path d="M165 332 C170 355, 192 365, 208 355 C224 345, 220 370, 210 390"
              stroke="rgba(255,255,255,0.78)" strokeWidth="7" strokeLinecap="round"/>
        {/* Terracotta dot */}
        <circle cx="168" cy="332" r="12" fill="#d97757"/>
      </g>
    </svg>
  );
}

/** Muses: Letter paper + quill pen + hand squiggle */
function MusesIllustration() {
  return (
    <svg viewBox="0 0 420 500" className={styles.illustration} fill="none">
      {/* Letter paper */}
      <g className={styles.illustrationFloat}>
        <path d="M100 60 C104 52, 310 48, 316 58 L326 320 C324 330, 112 336, 106 324Z" fill="#d97757" opacity="0.2"/>
        <path d="M140 110 L280 106" stroke="#d97757" strokeWidth="5" strokeLinecap="round" opacity="0.25"/>
        <path d="M136 148 L284 144" stroke="#d97757" strokeWidth="5" strokeLinecap="round" opacity="0.2"/>
        <path d="M132 186 L240 182" stroke="#d97757" strokeWidth="5" strokeLinecap="round" opacity="0.15"/>

        {/* Quill pen — diagonal across the paper */}
        <path d="M340 28 C346 22, 352 28, 350 34 L280 178 C268 206, 248 238, 228 262 C220 272, 212 276, 214 270 L234 244 C222 240, 228 224, 240 222 L262 190 C254 186, 260 174, 272 174Z" fill="#d97757"/>
        <path d="M340 28 L228 262" stroke="#c4654a" strokeWidth="4" strokeLinecap="round"/>
        <path d="M214 274 C208 282, 202 288, 198 286 C194 282, 200 276, 206 272Z" fill="#d97757"/>
      </g>

      {/* Hand squiggle */}
      <g className={styles.illustrationFloatReverse}>
        <path d="M90 370 C98 348, 110 378, 126 358 C142 338, 130 374, 150 360 C166 348, 160 376, 178 365"
              stroke="rgba(255,255,255,0.88)" strokeWidth="9" strokeLinecap="round"/>
        <path d="M178 365 C195 380, 210 362, 205 345 C200 328, 182 334, 185 355"
              stroke="rgba(255,255,255,0.82)" strokeWidth="8" strokeLinecap="round"/>
        <path d="M185 355 C200 375, 218 368, 228 385"
              stroke="rgba(255,255,255,0.75)" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="188" cy="355" r="12" fill="#d97757"/>
      </g>
    </svg>
  );
}

/** Coming Soon: Simple question mark */
function ComingSoonIllustration() {
  return (
    <svg viewBox="0 0 300 340" className={styles.illustration} fill="none">
      <g className={styles.illustrationFloat}>
        <path d="M115 80 C115 42, 200 35, 202 82 C204 128, 158 138, 158 175"
              stroke="rgba(255,255,255,0.65)" strokeWidth="9" strokeLinecap="round"/>
        <circle cx="158" cy="212" r="13" fill="#d97757"/>
      </g>
    </svg>
  );
}
