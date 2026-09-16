---
title: Instrument sample credits
description: Where the piano, guitar, violin, flute and trumpet samples came from, and the licence that requires them to be credited.
created: 2026-08-14
tags: [music, licensing, attribution]
---

# Instrument sample credits

These samples come from
**[tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments)** by
Nicholaus Brosowsky, released under
**[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)**. Upstream
describes them as drawn "from a variety of public domain sources" and edited for
consistency; `sample-source-info.txt` in that repository has the per-instrument
detail.

CC BY requires the credit to travel with the work, which means it has to be
visible in the app and not only here. It is rendered in
`app/components/Footer.tsx`.

## How this was established

Nothing in this repository recorded where the samples came from — they arrived
in a bulk reorganisation commit with no provenance, and no licence file came
with them. The identification is not a guess:

- `lib/types/audio.ts` says, in its own comment, "Map our instrument types to
  **tonejs-instruments** folder names".
- The folder layout matches that library exactly, down to `guitar-acoustic`
  rather than `guitar`.
- Every note ships as an `.mp3`, `.ogg` and `.wav` triplet, which is that
  library's packaging.

The licence was then read from the upstream repository rather than recalled.

If you replace or add samples, update this file **and** the footer. A credit
that silently goes stale is worse than one that was never written, because it
now asserts something untrue about someone else's work.
