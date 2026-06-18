# EverLetter Premium 03 - Love Letter Scroll

A scroll-reveal love letter template built with Next.js 13, TypeScript, Tailwind CSS, and Framer Motion.

## Quick Start

```bash
pnpm install
pnpm dev
```

## Customization

Edit `public/config.json` to customize your letter:

- `recipient` - Name of the recipient
- `sender` - Name of the sender
- `title` - Letter title
- `message` - Full message (separate paragraphs with `\n\n`)
- `photos` - Array of photo filenames (place in `public/`)
- `theme` - Color theme: `pink`, `lavender`, `warm`, or `dark`
- `music` - Background music filename (place in `public/`)
- `musicTitle` - Title displayed for the music
- `captions` - Captions for each photo
- `closing` - Closing message

## Deployment

```bash
pnpm build
```

Deploy to Vercel:

```bash
vercel
```

## License

MIT
