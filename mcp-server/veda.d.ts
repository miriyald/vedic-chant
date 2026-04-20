/**
 * Type declarations for the Veda chanting namespace.
 *
 * The implementation lives in ../Veda.ts and ../Veda.js — no logic is
 * duplicated here. This file only describes the shape of the namespace so
 * that TypeScript can type-check the MCP server code.
 */
declare namespace Veda {
    namespace Chanting {
        class PatternUtil {
            static Missing: string;
            static Space: string;
            static Seperator: string;
            static NewLine: string;
            static Filter(words: string[]): string[];
            static Get(words: string[], I: number): string;
            static Between(words: string[], from: number, to: number): string;
            static From(words: string[], from: number, n: number): string;
        }
        class Jata   { Identifier: string; Name: string; MinLength: Number; GetStream(words: string[]): string; }
        class Mala   { Identifier: string; Name: string; MinLength: Number; GetStream(words: string[]): string; }
        class Sikha  { Identifier: string; Name: string; MinLength: Number; GetStream(words: string[]): string; }
        class Rekha  { Identifier: string; Name: string; MinLength: Number; GetStream(words: string[]): string; }
        class Dhvaja { Identifier: string; Name: string; MinLength: Number; GetStream(words: string[]): string; }
        class Dhanda { Identifier: string; Name: string; MinLength: Number; GetStream(words: string[]): string; }
        class Ratha  { Identifier: string; Name: string; MinLength: Number; GetStream(words: string[]): string; }
        class Ghana  { Identifier: string; Name: string; MinLength: Number; GetStream(words: string[]): string; }
    }
}
