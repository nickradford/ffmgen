# ffmgen

AI-powered ffmpeg command generator. Describe what you want to do with your video or audio, and get the exact ffmpeg command instantly.

![ffmgen](public/ffmgen-banner.png)

## Features

- **Natural language input** — Describe your video/audio task in plain English
- **AI-generated commands** — Uses OpenRouter to generate optimal ffmpeg commands
- **Command history** — Save and reuse previously generated commands
- **One-click copy** — Copy commands to clipboard instantly
- **Downvote & regenerate** — Get alternative commands if the first isn't right
- **Rate limiting** — Built-in protection against abuse
- **URL-shareable prompts** — Share commands via query parameters

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + shadcn/ui components
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/) + [OpenRouter](https://openrouter.ai/)
- **State Management**: [nuqs](https://nuqs.47ng.com/) for URL state
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- OpenRouter API key

### Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd ffmpeg-ai
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
MODEL=z-ai/glm-4.5-air:free  # Optional: defaults to free model
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Enter a description of your video/audio task (e.g., "convert mov to mp4 and compress")
2. Press Enter or click the arrow button
3. Copy the generated ffmpeg command
4. Run it in your terminal

## Example Prompts

- "Convert a mov file to mp4 and compress it"
- "Extract audio from a video as mp3"
- "Trim a video from 00:30 to 01:30"
- "Resize video to 1080p and add a watermark"
- "Convert video to GIF with 15fps"

## Scripts

- `pnpm dev` — Start development server with Turbo
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint

## Project Structure

```
app/
├── api/generate/      # API route for AI command generation
├── home-content.tsx   # Main application logic
├── page.tsx           # Root page component
├── layout.tsx         # Root layout with providers
└── globals.css        # Global styles

components/
├── prompt-input.tsx   # User input component
├── command-display.tsx # Command output with actions
├── command-history.tsx # Saved commands list
├── example-chips.tsx  # Example prompt buttons
└── ui/                # shadcn/ui components

lib/
├── sanitize.ts        # Input sanitization
├── rate-limit.ts      # Rate limiting logic
├── localstorage.ts    # History persistence
└── prompt-cache.ts    # Caching utilities
```

## Environment Variables

| Variable             | Description                 | Required |
| -------------------- | --------------------------- | -------- |
| `OPENROUTER_API_KEY` | Your OpenRouter API key     | Yes      |
| `MODEL`              | OpenRouter model identifier | No       |

## License

MIT
