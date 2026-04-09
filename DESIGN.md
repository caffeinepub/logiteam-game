# Design Brief

## Direction

**BLC PPPK 2026 Team Logic Game** — High-energy interactive puzzle game celebrating group thinking and collaboration with vibrant visual feedback.

## Tone

Energetic yet professional — bold geometric typography, vivid emerald success feedback, and celebratory micro-interactions create an encouraging, game-forward atmosphere.

## Differentiation

Electric green accent for scoring moments and team achievements creates instant visual celebration; combined with indigo primary and warm amber team highlights for distinctive tri-color personality.

## Color Palette

| Token      | OKLCH           | Role                                       |
|------------|-----------------|-------------------------------------------|
| background | 0.16 0.02 280   | Dark charcoal, game canvas base            |
| foreground | 0.95 0.01 280   | Near-white text on dark                     |
| card       | 0.2 0.025 280   | Slightly elevated dark surface              |
| primary    | 0.52 0.22 265   | Deep indigo for action buttons/focus        |
| accent     | 0.68 0.25 145   | Electric emerald for success/score          |
| destructive| 0.55 0.22 25    | Red for wrong answers                       |
| muted      | 0.25 0.03 280   | Subtle UI elements, inactive state          |

## Typography

- **Display:** Space Grotesk — bold, geometric, memorable headings and score display
- **Body:** Plus Jakarta Sans — friendly, clear, modern UI labels and instructions
- **Mono:** JetBrains Mono — timer and numeric score readout
- **Scale:** Hero `text-5xl font-bold tracking-tight`, h2 `text-3xl font-bold`, label `text-sm uppercase font-semibold`, body `text-base`

## Elevation & Depth

Game HUD overlays on dark canvas with subtle card elevation; score and timer badges float with soft shadows; correct answer feedback uses scale + glow animation.

## Structural Zones

| Zone       | Background        | Border          | Notes                               |
|-----------|-------------------|-----------------|-------------------------------------|
| Canvas    | background        | —               | Full viewport, puzzle display       |
| Score Bar | card w/ elevation | primary edge    | Top-right corner, team score        |
| Timer     | secondary/muted   | primary accent  | Top-center, countdown digit         |
| Team List | card/translucent  | border/subtle   | Left side, active team members      |
| Answer UI | card elevated     | accent on focus | Center-bottom, choice buttons       |

## Spacing & Rhythm

Grid-based 8px increments; game canvas uses spacious padding for breathing room; micro-interactions use 4px spacing for button/badge padding; timer uses monospace for aligned digit animation.

## Component Patterns

- **Buttons:** Rounded-full (pill), primary indigo, scale-95 on active, opacity-90 on hover
- **Cards:** Rounded-2xl, bg-card, shadow-elevated, accent border on interactive focus
- **Badges:** Rounded-full, accent color for success/score, muted for team names/status

## Motion

- **Entrance:** Pop-in animation (0.3s bounce-out) for correct answer feedback; slide-in-left for team member join
- **Hover:** Opacity and scale shift for buttons; glow effect on interactive elements
- **Decorative:** Pulse-glow animation for active timer, count-up animation for score increment

## Constraints

- Full-viewport canvas prioritizes puzzle visibility; UI overlays must have high contrast
- Indonesian language labels ensure accessibility for target audience
- Game timer must remain readable during all animations
- Success/failure visual feedback must be unambiguous (green checkmark vs. red X)

## Signature Detail

Tri-color harmony (indigo primary + emerald accent + warm amber accent secondary) creates distinctive, celebratory game personality that rewards correct answers with immediate visual joy.
