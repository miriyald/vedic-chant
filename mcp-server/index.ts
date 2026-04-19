/**
 * Vedic Chant MCP Server
 *
 * Exposes `generate_vedic_chant` — transforms text into one of eight
 * traditional Vedic chanting recitation styles.
 *
 * The chanting logic is reused directly from ../Veda.js (source: ../Veda.ts)
 * without any code duplication. Types are declared in ./veda.d.ts.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Load the Veda namespace from the root Veda.js (CommonJS module).
// Veda.js exports itself (module.exports = Veda) when running in Node.js.
// The path is resolved relative to this compiled file's location:
//   dist/index.js  →  ../../Veda.js  →  repo-root/Veda.js
const _require = createRequire(import.meta.url);
const VedaNS = _require(
    fileURLToPath(new URL("../../Veda.js", import.meta.url))
) as typeof Veda;

// ---------------------------------------------------------------------------
// Build pattern registry from the reused Veda.Chanting classes
// ---------------------------------------------------------------------------

const PATTERNS = {
    Jata:   new VedaNS.Chanting.Jata(),
    Mala:   new VedaNS.Chanting.Mala(),
    Sikha:  new VedaNS.Chanting.Sikha(),
    Rekha:  new VedaNS.Chanting.Rekha(),
    Dhvaja: new VedaNS.Chanting.Dhvaja(),
    Dhanda: new VedaNS.Chanting.Dhanda(),
    Ratha:  new VedaNS.Chanting.Ratha(),
    Ghana:  new VedaNS.Chanting.Ghana(),
};

type StyleId = keyof typeof PATTERNS;
const STYLE_IDS = Object.keys(PATTERNS) as [StyleId, ...StyleId[]];

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
        style: z.enum(STYLE_IDS).describe(
            `Chanting style ID. One of: ${STYLE_IDS.join(", ")}. ` +
            "Jata=jaṭā, Mala=mālā, Sikha=śikhā, Rekha=rekhā, " +
            "Dhvaja=dhvaja, Dhanda=daṇḍa, Ratha=ratha, Ghana=ghana"
        ),
    },
    ({ text, style }) => {
        const pattern = PATTERNS[style as StyleId];
        const words = VedaNS.Chanting.PatternUtil.Filter(text.trim().split(/\s+/));
        const result = pattern.GetStream(words);

        if (!result) {
            return {
                content: [{
                    type: "text",
                    text:
                        `The style "${style}" (${pattern.Name}) requires at least ` +
                        `${pattern.MinLength} words, but only ${words.length} were provided.`,
                }],
                isError: true,
            };
        }

        return {
            content: [{
                type: "text",
                text: `Style: ${style} (${pattern.Name})\n\n${result}`,
            }],
        };
    }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
