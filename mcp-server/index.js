/**
 * Vedic Chant MCP Server
 *
 * Exposes a single tool `generate_vedic_chant` that transforms plain text into
 * one of the eight traditional Vedic chanting styles:
 *   Jata | Mala | Sikha | Rekha | Dhvaja | Dhanda | Ratha | Ghana
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Core chanting logic (ported from Veda.js)
// ---------------------------------------------------------------------------

const MISSING = "_";
const SPACE = " ";
const SEP = " ~ ";
const NL = "\n";

function get(words, i) {
  if (i < 0) return MISSING;
  if (i < words.length) return words[i];
  return MISSING;
}

function between(words, from, to) {
  let sb = "";
  const N = words.length;
  if (from < to) {
    for (let i = from; i <= to; i++) {
      if (i - 1 >= N) continue;
      sb += get(words, i - 1) + SPACE;
    }
  } else {
    for (let i = from; i >= to; i--) {
      if (i - 1 >= N) continue;
      sb += get(words, i - 1) + SPACE;
    }
  }
  return sb;
}

function from(words, f, n) {
  return between(words, f, f - Math.abs(n));
}

function filter(words) {
  return words.filter((w) => w.trim() !== "");
}

const patterns = {
  Jata: {
    name: "jaṭā జట",
    minLength: 2,
    getStream(_words) {
      const words = filter(_words);
      const N = words.length;
      if (N < this.minLength) return "";
      let sb = "";
      for (let I = 0; I <= N - 1; I++) {
        sb +=
          get(words, I) + SPACE + get(words, I + 1) + SPACE +
          get(words, I + 1) + SPACE + get(words, I) + SPACE +
          get(words, I) + SPACE + get(words, I + 1) + SEP + NL;
      }
      return sb;
    },
  },

  Mala: {
    name: "mālā మాల",
    minLength: 2,
    getStream(_words) {
      const words = filter(_words);
      const N = words.length;
      if (N < this.minLength) return "";
      let sb = "";
      for (let I = 0; I <= N - 1; I++) {
        sb +=
          get(words, I) + SPACE + get(words, I + 1) + SEP +
          get(words, I + 1) + SPACE + get(words, I) + SEP +
          get(words, I) + SPACE + get(words, I + 1) + SEP + NL;
      }
      return sb;
    },
  },

  Sikha: {
    name: "śikhā శిఖ",
    minLength: 3,
    getStream(_words) {
      const words = filter(_words);
      const N = words.length;
      if (N < this.minLength) return "";
      let sb = "";
      for (let I = 0; I <= N - 1; I++) {
        sb +=
          get(words, I) + SPACE + get(words, I + 1) + SEP +
          get(words, I + 1) + SPACE + get(words, I) + SEP +
          get(words, I) + SPACE + get(words, I + 1) + SPACE + get(words, I + 2) + SEP + NL;
      }
      return sb;
    },
  },

  Rekha: {
    name: "rekhā రేఖ",
    minLength: 4,
    getStream(_words) {
      const words = filter(_words);
      const N = words.length;
      if (N < this.minLength) return "";
      let sb = "";
      for (let I = 1; I <= N; I++) {
        sb +=
          between(words, I, I + I) + SEP +
          between(words, I + I, I) + SEP +
          get(words, I - 1) + SPACE + get(words, I) + SEP + NL;
      }
      return sb;
    },
  },

  Dhvaja: {
    name: "dhvaja ధ్వజ",
    minLength: 4,
    getStream(_words) {
      const words = filter(_words);
      const N = words.length;
      if (N < this.minLength) return "";
      let sb = "";
      for (let I = 1; I <= N; I++) {
        sb +=
          get(words, I - 1) + SPACE + get(words, I) + SEP +
          get(words, N - I - 1) + SPACE + get(words, N - I) + SEP + NL;
      }
      return sb;
    },
  },

  Dhanda: {
    name: "daṇḍa దండ",
    minLength: 4,
    getStream(_words) {
      const words = filter(_words);
      const N = words.length;
      if (N < this.minLength) return "";
      let sb = "";
      for (let I = 0; I <= N - 1; I++) {
        sb +=
          get(words, I) + SPACE + get(words, I + 1) + SEP +
          get(words, I + 1) + SPACE + get(words, I) + SEP +
          get(words, I) + SPACE + get(words, I + 1) + SEP +
          get(words, I + 1) + SPACE + get(words, I + 2) + SEP +
          get(words, I + 2) + SPACE + get(words, I + 1) + SPACE + get(words, I) + SEP +
          get(words, I) + SPACE + get(words, I + 1) + SEP +
          get(words, I + 1) + SPACE + get(words, I + 2) + SEP +
          get(words, I + 2) + SPACE + get(words, I + 3) + SEP +
          get(words, I + 3) + SPACE + get(words, I + 2) + SPACE + get(words, I + 1) + SPACE + get(words, I) + SEP +
          get(words, I) + SPACE + get(words, I + 1) + SEP + NL;
      }
      return sb;
    },
  },

  Ratha: {
    name: "ratha రధ",
    minLength: 5,
    getStream(_words) {
      const words = filter(_words);
      const N = words.length;
      if (N < this.minLength) return "";
      let sb = "";
      for (let I = 1; I <= N; I++) {
        sb +=
          get(words, I - 1) + SPACE + get(words, I) + SEP +
          get(words, I + 3) + SPACE + get(words, I + 4) + SEP +
          between(words, I + 1, 1) + SEP +
          from(words, I + 5, -1 * I) + SEP;
        for (let J = 0; J < I; J++) {
          sb +=
            get(words, J) + SPACE + get(words, J + 1) + SEP +
            get(words, J + 4) + SPACE + get(words, J + 5) + SEP;
        }
        sb += NL;
      }
      return sb;
    },
  },

  Ghana: {
    name: "ghana ఘణ",
    minLength: 3,
    getStream(_words) {
      const words = filter(_words);
      const N = words.length;
      if (N < this.minLength) return "";
      let sb = "";
      for (let I = 0; I <= N - 1; I++) {
        sb +=
          get(words, I) + SPACE + get(words, I + 1) + SPACE +
          get(words, I + 1) + SPACE + get(words, I) + SPACE +
          get(words, I) + SPACE + get(words, I + 1) + SPACE +
          get(words, I + 2) + SPACE + get(words, I + 2) + SPACE +
          get(words, I + 1) + SPACE + get(words, I) + SPACE +
          get(words, I) + SPACE + get(words, I + 1) + SPACE +
          get(words, I + 2) + SEP + NL;
      }
      return sb;
    },
  },
};

const STYLE_IDS = Object.keys(patterns);

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "vedic-chant",
  version: "1.0.0",
});

server.tool(
  "generate_vedic_chant",
  "Transform input text into one of the eight traditional Vedic chanting recitation styles.",
  {
    text: z.string().min(1).describe(
      "The source text (space-separated words) to be transformed, e.g. 'om namo narayanaya'"
    ),
    style: z
      .enum(STYLE_IDS)
      .describe(
        `Chanting style ID. One of: ${STYLE_IDS.join(", ")}. ` +
        "Jata=jaṭā, Mala=mālā, Sikha=śikhā, Rekha=rekhā, " +
        "Dhvaja=dhvaja, Dhanda=daṇḍa, Ratha=ratha, Ghana=ghana"
      ),
  },
  ({ text, style }) => {
    const pattern = patterns[style];
    const words = filter(text.trim().split(/\s+/));
    const result = pattern.getStream(words);

    if (!result) {
      return {
        content: [
          {
            type: "text",
            text:
              `The style "${style}" (${pattern.name}) requires at least ` +
              `${pattern.minLength} words, but only ${words.length} were provided.`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Style: ${style} (${pattern.name})\n\n${result}`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
