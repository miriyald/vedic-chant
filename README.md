# Vedic Chanting Generation Tool (Beta)
## Details
- Read about Vendic Chanting at http://www.srimatham.com/uploads/5/5/4/9/5549439/introduction_to_vedic_chanting.pdf
- This application made based on above Specification
- Author: Dileep Miriyala
- Email : m.dileep@gmail.com
- URL   : http://vedicchant.apphb.com/
- Realted Links
-- http://www.astrojyoti.com/yajurvedamp3.htm

## Docker

A single `Dockerfile` builds two images from one source tree — no logic is duplicated.

### Web app (nginx, port 8080)

```bash
# Build
docker build --target webapp -t vedic-chant:webapp .

# Run
docker run -p 8080:8080 vedic-chant:webapp
# → open http://localhost:8080
```

Or with Docker Compose:
```bash
docker compose up webapp
```

### MCP server (stdio)

The MCP server communicates over **stdin/stdout** — it is not an HTTP service.
Launch it through your MCP client or test it manually:

```bash
# Build
docker build --target mcp -t vedic-chant:mcp .

# Test manually
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1"}}}' \
  | docker run --rm -i vedic-chant:mcp
```

**Claude Desktop / Cursor `mcpServers` config:**
```json
{
  "mcpServers": {
    "vedic-chant": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "vedic-chant:mcp"]
    }
  }
}
```

### Build both images at once

```bash
docker compose build
```

## Release Notes

### Version 0.75 Beta : 01-Apr-2017 11:19 PM EST
#### Bug Fixes
- Minor Color map bug fix

### Version 0.75 Beta : 31-Mar-2017 11:00 PM EST
#### Features
- Added values to the Source colors legend.
- Added One more sample
- Updated Related Links to Readme.
- Read me organised to have latest version in the top.
- Samples are made as configurable
- Restricting to load the default sample on page load
#### Bug Fixes
- 3 Color Map should not show gaps

### Version 0.70 Beta : 30-Mar-2017 08:36 PM EST
#### Features
- Added 3 Color Map Styles
#### Bug Fixes
- None

### Version 0.65 Beta : 30-Mar-2017 07:27 PM EST
#### Features
- Added one more Random String
- Missed Words are displayed as Underscrore
#### Bug Fixes
- Mala should use Seperator instead of Space

### Version 0.6 Beta : 30-Mar-2017 01:30 AM EST
#### Features
- Added Filter to remove words of Spaces
#### Bug Fixes
- Dhanda is not working as expected   

### Version 0.55 Beta : 30-Mar-2017 12:45 AM EST
#### Features
- Added one more  Random String
#### Bug Fixes
- Ghana is not working as expected   

### Version 0.5 Beta : 29-Mar-2017 11:50 PM EST
#### Features
- Initial Version    
- Generates a Random String from 4 Strings
- Allows Jata,Mala,Sikha,Rekha,Dhvaja,Dhanda,Ratha,Ghana

## Known Issues
- > No Sandhi Handling