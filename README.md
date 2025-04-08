# Israeli Bank MCP

A project for managing Israeli bank accounts and transactions using the Model Context Protocol (MCP).

## Features

- List available Israeli banks and credit card companies with their required credentials
- Fetch transactions from any supported bank
- Support for all major Israeli banks and credit card companies
- Secure credential handling
- Flexible transaction date ranges
- Two-factor authentication support

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Connect to MCP Clients

## Connecting to MCP Clients

The server can be connected to any MCP-compatible client. Here's how to configure it:

### Example Configuration

For clients that support configuration files (like Claude), add the following to your configuration:

```json
{
    "mcpServers": {
        "israeli-bank-mcp": {
            "command": "node",
            "args": [
                "/path/to/israeli-bank-mcp/build/server.js"
            ]
        }
    }
}
```
## Resources

- **Banks** (`banks://list`)
  - List available banks and their required credentials

## Tools

- **Fetch transactions** (`fetch-transactions`)
  - Fetch transactions from a bank
    
- **2FA** (`two-factor-auth`)
    - 2FA authentication for banks that require that


## Supported Banks

The server supports all major Israeli banks and credit card companies through the [israeli-bank-scrapers](https://github.com/eshaham/israeli-bank-scrapers) library:

- Bank Hapoalim
- Leumi Bank
- Discount Bank
- Mercantile Bank
- Mizrahi Bank
- Otsar Hahayal Bank
- Visa Cal
- Max (Formerly Leumi Card)
- Isracard
- Amex
- Union Bank
- Beinleumi
- Massad
- Yahav
- Beyhad Bishvilha
- OneZero (Experimental)
- Behatsdaa

## Security

- Please do not attempt this at home (I honestly don't know, it's probably not a good idea, but it's really cool)

## License

MIT 
