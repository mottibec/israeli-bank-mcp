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

## Usage

The server provides three main functionalities:

1. List available banks and their required credentials:
```
GET banks://list
```
Response example:
```json
{
  "banks": [
    {
      "id": "bankId",
      "name": "BankName",
      "requiredCredentials": ["username", "password", "userCode"]
    }
  ]
}
```

2. Fetch transactions from a bank:
```
POST fetch-transactions
{
  "bankId": <bank_id>,
  "credentials": {
    "username": "<username>",  // Optional, depends on bank
    "password": "<password>",
    "userCode": "<user_code>", // Optional, depends on bank
    "id": "<id>",             // Optional, depends on bank
    "num": "<num>",           // Optional, depends on bank
    "card6Digits": "<digits>", // Optional, depends on bank
    "nationalID": "<id>",     // Optional, depends on bank
    "longTermTwoFactorAuthToken": "<token>" // Optional, for 2FA
  },
  "startDate": "<YYYY-MM-DD>", // Optional
  "combineInstallments": false, // Optional
  "showBrowser": false         // Optional
}
```

3. Handle Two-Factor Authentication:
```
POST two-factor-auth
{
  "bankId": <bank_id>,
  "phoneNumber": "<phone_number>",
  "action": "trigger" | "get-token",
  "otpCode": "<code>" // Required only for "get-token" action
}
```

### Two-Factor Authentication Flow

1. First, trigger the 2FA code to be sent:
```json
{
  "bankId": "onezero",
  "phoneNumber": "0501234567",
  "action": "trigger"
}
```

2. After receiving the code, get a long-term token:
```json
{
  "bankId": "onezero",
  "phoneNumber": "0501234567",
  "action": "get-token",
  "otpCode": "123456"
}
```

3. Use the long-term token in subsequent transactions:
```json
{
  "bankId": "onezero",
  "credentials": {
    "username": "user",
    "password": "pass",
    "longTermTwoFactorAuthToken": "eyJraWQiOiJiNzU3OGM5Yy0wM2YyLTRkMzktYjBm..."
  }
}
```

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