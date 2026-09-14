# Poured Article Spec (binding for every post, human or agent)

## Length and structure
- 1,500+ words. If the topic can't carry it, the topic is wrong — pick another.
- Title: keyword-first, under 60 chars, no clickbait. Good: "Epoxy Resin Cure Times: How Long to Wait". Bad: "You Won't Believe This Resin Trick".
- Lede: 2 sentences max. What the guide covers, who it's for.
- H2 sections that each answer one question. No orphan H3s.
- Close with a "Bottom Line" (3 sentences max, the takeaway for skimmers).

## Every article must contain
- At least 3 specific, verifiable details (measurements, times, temperatures, grits, ratios, prices). Vague advice ("be careful", "take your time") doesn't count as content.
- A troubleshooting or mistakes section, unless the topic genuinely has no failure modes.
- 3+ internal links to other Poured guides (relative links, real slugs).
- An FAQ block (3–5 Q&As) at the end, before Bottom Line. These target People-Also-Ask boxes.
- One hero cover from `src/assets/covers/`. New topics reuse the closest-fit existing cover; never the same cover as the previous post.

## Voice
- Dry, compressed, practical. Second person. No exclamation marks. No "delve", "tapestry", "game-changer", "in today's fast-paced world".
- Never invent products, prices, or brand claims. If you don't know a fact, cut it — don't pad around it.

## Affiliate slots
- Buyer-intent posts ($) get a "What to buy" section with named product categories (not fake brand endorsements). Link placeholders: `[AFFILIATE: category]` inline — replaced with real tags later.
- Max one affiliate block per post. Content first, always.

## Frontmatter
```yaml
title: '...'
description: '...'   # 140-155 chars, includes the keyword, no truncation games
pubDate: 'Sep 15 2026'
heroImage: '../../assets/covers/<name>.png'
```
