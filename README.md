# Anti Pay

An India-first payment gateway checkout experience — designed to feel calm, premium, and human. Built as a high-fidelity clickable prototype to rethink what a checkout can be when you stop treating trust as a badge and start treating it as information.

Most payment gateways try to get out of the user's way. Anti Pay tries to be *worth noticing* — the kind of checkout you'd screenshot and send to a friend, and the kind of modal your grandma would actually trust.

## Why this exists

Indian checkout UX has hit a ceiling. The big PSPs all ship some variation of the same flow: logo, amount, method list, pay button, spinner, receipt. Trust is signalled with identical lock icons and "256-bit encrypted" badges. Delight is absent — you close the modal and forget the gateway existed.

Anti Pay tries to break that ceiling on two axes:

1. **Trust through transparency, not theatre** — live data about who you're paying and what's protecting the transaction, not vague promises
2. **Delight through awareness, not cashback** — a checkout that knows your history, your rules, and your context

## What's in the box

### Core checkout — every major Indian payment method
- **UPI** — Intent (real deep links that open GPay / PhonePe / Paytm / BHIM / CRED / Amazon Pay on mobile), UPI ID with pre-submit VPA validation, and QR code
- **Cards** — single smart input with auto-format, BIN-based network detection, Luhn validation, inline 3D Secure OTP overlay, RBI Network Tokenization copy, saved cards list with one-tap CVV-only retry
- **Netbanking** — top-6 tiles plus a searchable list of 12 banks with real brand colors
- **Wallets** — Paytm, PhonePe, Amazon Pay, MobiKwik, Freecharge, Airtel Money
- **EMI / Pay Later** — Card EMI with real amortization math, tenure grid, live monthly calculation; BNPL with Simpl, LazyPay, ZestMoney, Snapmint

### Five features that set it apart

1. **Trust Pane** — a live dashboard (not a badge). Legal entity, GSTIN, years active, 30-day volume, dispute rate, rating, plus session security state: device fingerprint, network, tokenization provider, biometric availability, TLS version. Every row taps open to reveal how we verified it.
2. **Spend Context Card** — a single line above the amount: *"3× before · typical for you here (avg ₹1,850)"* or *"35% higher than your usual"*. Awareness, not judgement.
3. **Guardrails** — user-set rules (biometric threshold, daily caps, merchant whitelist) that fire visibly on every payment, accessible from the ⚙ icon in the Shell header. Confidence = seeing your own rules pass.
4. **Smart Retry** — when a payment fails, the failure screen suggests *which other saved card to use* based on the decline reason, with a one-tap retry. No more dumping users back at the method picker.
5. **Ownable Receipt** — the success screen IS the receipt. Designed, signed, shareable. A tiny marketing asset the user wants to screenshot.

### Design system highlights
- **Calm Confidence** aesthetic — a hybrid of Razorpay's warmth and Stripe's precision
- **Liquid Glass** surfaces — SVG displacement filter + per-channel chromatic aberration + iridescent edge rims + specular shine (inspired by `rdev/liquid-glass-react`)
- **Dark mode** via CSS variables — no `dark:` class soup, every surface themed automatically
- **Mobile bottom-sheet** — the modal slides up from the bottom on phones with a drag handle, full-screen modal on desktop, pure CSS responsive
- **Real brand marks** — hand-crafted inline SVG tiles for Google Pay, PhonePe, Paytm, CRED, Amazon Pay, Simpl, LazyPay, Zest, and more
- **Confetti + streak badges** — first-time customers get a celebratory burst, returning customers get a visible streak
- **Accessibility** — tabular numerals on all money, generous touch targets, keyboard navigation, WCAG AA contrast in both themes

## Project structure

```
src/
├── App.jsx                         # Stage router + merchant page + dev FAB
├── main.jsx                        # React entry point
├── index.css                       # Design tokens, liquid glass, bottom sheet, animations
└── checkout/
    ├── Shell.jsx                   # Modal/sheet shell with header, trust/rules icons
    ├── SummaryAndMethods.jsx       # Order summary + method picker
    ├── UPIFlow.jsx                 # UPI Apps / ID / QR tabs with deep linking
    ├── CardFlow.jsx                # Smart card input + saved cards + 3DS overlay
    ├── NetbankingFlow.jsx          # Bank grid + search
    ├── WalletsFlow.jsx             # Wallet picker
    ├── EMIFlow.jsx                 # Card EMI calculator + BNPL providers
    ├── Waiting.jsx                 # Method-aware waiting screen with ring progress
    ├── Result.jsx                  # Ownable receipt (Success) + Smart Retry (Failure)
    ├── TrustPane.jsx               # Live merchant + session dashboard
    ├── SpendContext.jsx            # Awareness line (spend history)
    ├── Guardrails.jsx              # User-set rules with pass/fail evaluation
    ├── BrandMark.jsx               # Hand-crafted brand SVG tiles
    ├── LiquidGlassDefs.jsx         # SVG displacement filter defs
    ├── Confetti.jsx                # Pure-CSS particle burst
    ├── icons.jsx                   # Line icon set
    ├── useTheme.js                 # Light/dark theme hook
    └── data.js                     # Mock merchant, user history, trust, guardrails
```

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://127.0.0.1:5173` (or next free port).

```bash
npm run build    # Production build to dist/
npm run preview  # Serve the built dist/ locally
```

## Tech stack

- **React 18** with Vite 5
- **Tailwind CSS 3** with CSS-variable-backed tokens for dark mode
- **Inter** for typography, tabular numerals on all money
- Zero runtime dependencies beyond React — no animation libraries, no icon libraries, no utility soup

Production bundle: **~70 KB gzipped JS + ~8 KB gzipped CSS** for the entire gateway with 6 payment methods, dark mode, liquid glass, confetti, and all 5 differentiator features.

## Status

This is a design prototype. All data is mocked in [`src/checkout/data.js`](src/checkout/data.js) — merchant trust metrics, user spending history, saved cards, guardrail rules, failure taxonomy. The structure mirrors what a real gateway backend would expose. Hooking it to real APIs would be straight plumbing.

The flows are all fully clickable end-to-end. You can start at the merchant page, go through any method, trigger a success, trigger a simulated failure from the 3DS OTP step, see the Smart Retry suggestion, and come back to the merchant.

## Demo toggles inside the prototype

- **Theme** — sun/moon icon in the Shell header, persisted to localStorage
- **First-time vs returning customer** — toggle on the merchant page, affects Success screen (confetti + welcome vs streak badge)
- **Simulate bank decline** — small red link on the 3DS OTP step in the Card flow
- **Simulate UPI failure** — small grey link on the Waiting screen
- **Developer drawer** — floating `< >` button bottom-right of the merchant page, shows HTML / React / REST integration snippets

## Credits

- Liquid Glass technique inspired by [`rdev/liquid-glass-react`](https://github.com/rdev/liquid-glass-react)
- Brand marks hand-crafted for this prototype; all trademarks belong to their respective owners and are used here for illustrative, non-commercial purposes

---

Built as an exploration of what an Indian payment gateway could be if it stopped treating the checkout as a toll booth.
