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
    default:
      return <ComingSoonIllustration />;
  }
}

/**
 * Uteki: Trading/quantitative — candlestick bars + connected agent nodes + hand squiggle
 * Bold terracotta fills, thick cream strokes. Like Anthropic agents page style.
 */
function UtekiIllustration() {
  return (
    <svg viewBox="0 0 500 520" className={styles.illustration} fill="none">
      <defs>
        <filter id="sk-u" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" seed="7" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="sk-u2" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="3" seed="3" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>

      {/* === Candlestick chart area === */}
      <g filter="url(#sk-u)" className={styles.illustrationFloat}>
        {/* Candlestick 1 — bearish (body filled) */}
        <path d="M108 160 C109 140, 111 125, 110 110" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>
        <path d="M95 130 C98 125, 120 124, 125 130 C126 150, 127 165, 124 175 C120 180, 98 181, 96 175 C93 165, 94 140, 95 130Z" fill="#d97757"/>
        <path d="M110 175 C109 190, 111 200, 110 210" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>

        {/* Candlestick 2 — bullish (hollow) */}
        <path d="M170 190 C171 170, 169 155, 170 140" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>
        <path d="M157 170 C160 165, 180 164, 184 170 C185 185, 186 200, 183 210 C179 215, 160 216, 158 210 C155 200, 156 180, 157 170Z"
              stroke="#d97757" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M170 210 C169 225, 171 235, 170 245" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>

        {/* Candlestick 3 — bullish tall */}
        <path d="M230 140 C231 120, 229 100, 230 85" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>
        <path d="M217 105 C220 100, 240 99, 244 105 C245 125, 246 148, 243 162 C239 167, 220 168, 218 162 C215 148, 216 115, 217 105Z"
              stroke="#d97757" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M230 162 C229 175, 231 185, 230 195" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>

        {/* Candlestick 4 — bearish small */}
        <path d="M290 130 C291 115, 289 105, 290 95" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>
        <path d="M278 108 C281 103, 300 102, 303 108 C304 120, 305 132, 302 140 C298 145, 282 146, 280 140 C277 132, 277 115, 278 108Z" fill="#d97757"/>
        <path d="M290 140 C289 155, 291 168, 290 180" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>
      </g>

      {/* === Connected agent nodes below chart === */}
      <g filter="url(#sk-u)" className={styles.illustrationFloat}>
        {/* Triangle network */}
        {/* Edges — double stroke */}
        <path d="M128 290 C165 278, 230 268, 285 282" stroke="#d97757" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
        <path d="M130 294 C168 282, 232 272, 288 286" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>

        <path d="M288 286 C260 318, 230 345, 210 368" stroke="#d97757" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
        <path d="M285 282 C258 315, 228 342, 208 365" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>

        <path d="M208 365 C178 345, 148 320, 128 290" stroke="#d97757" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
        <path d="M210 368 C180 348, 150 323, 130 294" stroke="#d97757" strokeWidth="3" strokeLinecap="round"/>

        {/* Cross connections */}
        <path d="M130 292 C168 310, 190 330, 208 366" stroke="#d97757" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M286 284 C260 300, 240 320, 210 368" stroke="#d97757" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>

        {/* Nodes — imperfect circles */}
        <path d="M128 276 C140 274, 148 282, 147 294 C146 306, 138 314, 126 312 C114 310, 108 302, 110 290 C112 278, 120 274, 128 276Z" fill="#d97757"/>
        <path d="M286 270 C298 268, 306 276, 305 288 C304 300, 296 308, 284 306 C272 304, 266 296, 268 284 C270 272, 278 268, 286 270Z" fill="#d97757"/>
        <path d="M208 352 C220 350, 228 358, 227 370 C226 382, 218 390, 206 388 C194 386, 188 378, 190 366 C192 354, 200 350, 208 352Z" fill="#d97757"/>

        {/* Connecting line up to chart */}
        <path d="M110 290 C105 260, 108 230, 110 210" stroke="#d97757" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M288 284 C292 260, 290 230, 290 180" stroke="#d97757" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </g>

      {/* === Hand squiggle — white, expressive === */}
      <g filter="url(#sk-u2)" className={styles.illustrationFloatReverse}>
        <path d="M130 410 C140 392, 148 420, 160 405 C172 390, 165 422, 180 408 C195 394, 188 420, 202 412 C210 406, 218 418, 225 410"
              stroke="rgba(255,255,255,0.9)" strokeWidth="6" strokeLinecap="round"/>
        <path d="M133 414 C143 396, 152 424, 163 408 C175 393, 168 426, 183 412"
              stroke="rgba(255,255,255,0.3)" strokeWidth="4.5" strokeLinecap="round"/>

        {/* Loop */}
        <path d="M160 430 C168 450, 188 455, 198 440 C208 425, 192 415, 178 422 C164 429, 175 448, 192 452 C209 456, 220 442, 215 428"
              stroke="rgba(255,255,255,0.85)" strokeWidth="5" strokeLinecap="round"/>

        {/* Tail — pressure decreasing */}
        <path d="M215 428 C210 445, 222 458, 235 462 C248 466, 245 478, 235 485"
              stroke="rgba(255,255,255,0.7)" strokeWidth="4" strokeLinecap="round"/>

        {/* End dot */}
        <path d="M233 488 C238 486, 242 490, 240 496 C238 502, 232 504, 229 498 C226 492, 230 488, 233 488Z" fill="#d97757"/>
      </g>
    </svg>
  );
}

/**
 * Sumi: Voice/Audio — sound wave lines + microphone shape + flowing organic line
 */
function SumiIllustration() {
  return (
    <svg viewBox="0 0 500 520" className={styles.illustration} fill="none">
      <defs>
        <filter id="sk-s" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.022" numOctaves="4" seed="12" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.8" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="sk-s2" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="3" seed="20" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>

      {/* === Microphone shape — terracotta fill + cream outline === */}
      <g filter="url(#sk-s)" className={styles.illustrationFloat}>
        {/* Mic head — rounded rectangle */}
        <path d="M195 80 C200 60, 290 58, 295 80 C300 110, 302 165, 298 195 C294 225, 200 228, 195 195 C190 165, 188 110, 195 80Z"
              fill="#d97757"/>
        {/* Outline — double stroke */}
        <path d="M190 78 C196 55, 294 53, 300 78 C306 110, 308 168, 304 200 C300 232, 194 234, 190 200 C184 168, 182 110, 190 78Z"
              stroke="rgba(255,255,255,0.85)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M192 82 C198 60, 292 58, 298 82 C304 114, 306 170, 302 202"
              stroke="rgba(255,255,255,0.3)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Mic grille lines */}
        <path d="M210 100 C230 97, 265 96, 280 100" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M208 125 C228 122, 268 121, 282 125" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M206 150 C226 147, 270 146, 284 150" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Mic stand — vertical line */}
        <path d="M247 228 C248 250, 246 275, 247 300" stroke="#d97757" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M245 230 C246 252, 244 277, 245 302" stroke="#d97757" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>

        {/* Mic base — horizontal */}
        <path d="M200 298 C220 295, 270 294, 295 298" stroke="#d97757" strokeWidth="5" strokeLinecap="round"/>
        <path d="M202 302 C222 299, 272 298, 293 302" stroke="#d97757" strokeWidth="3" strokeLinecap="round" opacity="0.35"/>
      </g>

      {/* === Sound wave arcs === */}
      <g filter="url(#sk-s)" className={styles.illustrationFloat}>
        {/* Right side waves */}
        <path d="M315 110 C340 130, 345 170, 320 195" stroke="rgba(255,255,255,0.5)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M340 90 C375 120, 380 185, 345 215" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M360 75 C405 110, 410 200, 365 235" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Left side waves */}
        <path d="M178 110 C153 130, 148 170, 173 195" stroke="rgba(255,255,255,0.5)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M155 90 C120 120, 115 185, 150 215" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M135 75 C90 110, 85 200, 130 235" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Small dots at wave tips */}
        <path d="M318 108 C322 106, 326 110, 324 114 C322 118, 316 118, 315 114 C314 110, 316 107, 318 108Z" fill="#d97757"/>
        <path d="M175 108 C179 106, 183 110, 181 114 C179 118, 173 118, 172 114 C171 110, 173 107, 175 108Z" fill="#d97757"/>
      </g>

      {/* === Bottom squiggle — voice/expression === */}
      <g filter="url(#sk-s2)" className={styles.illustrationFloatReverse}>
        <path d="M140 350 C152 332, 160 360, 174 345 C188 330, 180 362, 196 348 C212 334, 205 360, 220 352 C230 346, 240 358, 248 350"
              stroke="rgba(255,255,255,0.85)" strokeWidth="5.5" strokeLinecap="round"/>
        <path d="M143 354 C155 336, 164 364, 177 349 C191 334, 184 366, 199 352"
              stroke="rgba(255,255,255,0.25)" strokeWidth="4" strokeLinecap="round"/>

        {/* Spiral */}
        <path d="M175 372 C182 390, 200 395, 210 380 C220 365, 205 358, 192 364 C179 370, 188 390, 205 394"
              stroke="rgba(255,255,255,0.75)" strokeWidth="4.5" strokeLinecap="round"/>

        {/* Tail */}
        <path d="M205 394 C218 400, 235 395, 245 405 C255 415, 248 428, 238 432"
              stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" strokeLinecap="round"/>

        <path d="M236 435 C242 433, 246 438, 244 444 C242 450, 236 452, 233 446 C230 440, 233 436, 236 435Z" fill="#d97757"/>
      </g>
    </svg>
  );
}

/** Coming Soon: Abstract spark */
function ComingSoonIllustration() {
  return (
    <svg viewBox="0 0 400 400" className={styles.illustration} fill="none">
      <defs>
        <filter id="sk-cs" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="4" seed="30" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.8" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <g filter="url(#sk-cs)" className={styles.illustrationFloat}>
        {/* Question mark curve */}
        <path d="M170 110 C172 85, 210 70, 235 80 C260 90, 268 115, 255 135 C242 155, 210 158, 200 175 C195 185, 198 195, 200 210"
              stroke="rgba(255,255,255,0.6)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M172 114 C174 90, 212 74, 237 84 C262 94, 270 118, 257 138"
              stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" strokeLinecap="round"/>

        {/* Dot */}
        <path d="M198 235 C206 232, 212 238, 210 246 C208 254, 200 258, 195 250 C190 242, 194 234, 198 235Z" fill="#d97757"/>

        {/* Radiating sparks */}
        <path d="M145 130 C152 122, 162 118, 168 112" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M265 95 C275 88, 285 85, 295 80" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M270 155 C280 152, 290 155, 298 158" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M155 90 C148 82, 142 72, 138 65" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Small terracotta accents */}
        <path d="M138 62 C142 60, 146 64, 144 68 C142 72, 136 72, 135 68 C134 64, 136 61, 138 62Z" fill="#d97757" opacity="0.7"/>
        <path d="M298 78 C302 76, 306 80, 304 84 C302 88, 296 88, 295 84 C294 80, 296 77, 298 78Z" fill="#d97757" opacity="0.6"/>
      </g>
    </svg>
  );
}
