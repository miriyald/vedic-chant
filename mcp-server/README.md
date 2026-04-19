# Vedic Chant MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes the Vedic Chanting generation functionality as a single tool.

## Tool

### `generate_vedic_chant`

Transforms input text into one of the eight traditional Vedic chanting recitation styles.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `string` | Space-separated words to transform (e.g. `"om namo narayanaya"`) |
| `style` | enum | Chanting style ID — one of the values below |

**Style IDs**

| ID | Name | Min words |
|----|------|-----------|
| `Jata` | jaṭā జట | 2 |
| `Mala` | mālā మాల | 2 |
| `Sikha` | śikhā శిఖ | 3 |
| `Rekha` | rekhā రేఖ | 4 |
| `Dhvaja` | dhvaja ధ్వజ | 4 |
| `Dhanda` | daṇḍa దండ | 4 |
| `Ratha` | ratha రధ | 5 |
| `Ghana` | ghana ఘణ | 3 |

## Usage

```bash
cd mcp-server
npm install
node index.js   # communicates over stdio (MCP standard)
```

## MCP client configuration

Add the server to your MCP client (e.g. Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "vedic-chant": {
      "command": "node",
      "args": ["/path/to/vedic-chant/mcp-server/index.js"]
    }
  }
}
```
