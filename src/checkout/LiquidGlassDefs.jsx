import React from 'react'

/**
 * SVG filter defs for the liquid-glass effect.
 * Inspired by rdev/liquid-glass-react — adapted to vanilla SVG + backdrop-filter.
 *
 * Two filters are provided so different surface scales feel right:
 *  - #liquid-glass-strong → modal shell (more refraction, softer blur)
 *  - #liquid-glass-soft   → merchant cards (subtle)
 *
 * Technique:
 *   1. feTurbulence generates slow, organic noise (baseFrequency ~ 0.004)
 *   2. feGaussianBlur softens the noise so refraction is smooth, not grainy
 *   3. Per-channel feDisplacementMap with slightly different scales per channel
 *      produces chromatic aberration at the edges of refracted shapes
 *   4. feBlend screens the channels back together
 *
 * Must be mounted once at the app root so backdrop-filter url() can reference it.
 */
export default function LiquidGlassDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* ── Strong variant (modal, full surfaces) ───────────────────── */}
        <filter id="liquid-glass-strong" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.008"
            numOctaves="2"
            seed="17"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="6" result="softNoise" />

          {/* Red channel isolated + displaced */}
          <feColorMatrix
            in="SourceGraphic"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="red"
          />
          <feDisplacementMap
            in="red"
            in2="softNoise"
            scale="32"
            xChannelSelector="R"
            yChannelSelector="G"
            result="redShift"
          />

          {/* Green channel isolated + displaced (slightly less) */}
          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="green"
          />
          <feDisplacementMap
            in="green"
            in2="softNoise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
            result="greenShift"
          />

          {/* Blue channel isolated + displaced (least) */}
          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
            result="blue"
          />
          <feDisplacementMap
            in="blue"
            in2="softNoise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
            result="blueShift"
          />

          {/* Recombine channels via screen blend */}
          <feBlend in="redShift" in2="greenShift" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueShift" mode="screen" result="rgb" />

          {/* Final smoothing so refraction has a creamy, liquid feel */}
          <feGaussianBlur in="rgb" stdDeviation="0.4" />
        </filter>

        {/* ── Soft variant (merchant cards, buttons) ──────────────────── */}
        <filter id="liquid-glass-soft" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.01"
            numOctaves="2"
            seed="5"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="4" result="softNoise" />

          <feColorMatrix
            in="SourceGraphic"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="r"
          />
          <feDisplacementMap in="r" in2="softNoise" scale="16" xChannelSelector="R" yChannelSelector="G" result="rd" />

          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="g"
          />
          <feDisplacementMap in="g" in2="softNoise" scale="15" xChannelSelector="R" yChannelSelector="G" result="gd" />

          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="b"
          />
          <feDisplacementMap in="b" in2="softNoise" scale="14" xChannelSelector="R" yChannelSelector="G" result="bd" />

          <feBlend in="rd" in2="gd" mode="screen" result="rg" />
          <feBlend in="rg" in2="bd" mode="screen" result="rgb" />

          <feGaussianBlur in="rgb" stdDeviation="0.3" />
        </filter>
      </defs>
    </svg>
  )
}
