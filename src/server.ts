import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CompanyTypes, createScraper, ScraperOptions, ScraperCredentials, SCRAPERS } from 'israeli-bank-scrapers';
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Israeli Bank MCP",
  version: "1.0.0"
});

// Add a resource to list available banks
server.resource(
  "banks",
  "banks://list",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: JSON.stringify({
        banks: Object.entries(CompanyTypes).map(([key, value]) => {
          const scraperInfo = SCRAPERS[value];
          return {
            id: value,
            name: key,
            requiredCredentials: scraperInfo?.loginFields || []
          };
        })
      })
    }]
  })
);

// Add a tool to fetch transactions from a bank
server.tool(
  "fetch-transactions",
  {
    bankId: z.enum(Object.values(CompanyTypes) as [string, ...string[]]),
    credentials: z.object({
      username: z.string().optional(),
      password: z.string(),
      userCode: z.string().optional(),
      id: z.string().optional(),
      num: z.string().optional(),
      card6Digits: z.string().optional(),
      nationalID: z.string().optional(),
      longTermTwoFactorAuthToken: z.string().optional()
    }),
    startDate: z.string().optional(),
    combineInstallments: z.boolean().optional(),
    showBrowser: z.boolean().optional()
  },
  async ({ bankId, credentials, startDate, combineInstallments, showBrowser }) => {
    try {
      // Ensure bankId is a valid CompanyTypes value
      const validBankIds = new Set(Object.values(CompanyTypes));
      if (!validBankIds.has(bankId as unknown as CompanyTypes)) {
        throw new Error(`Invalid bank ID: ${bankId}`);
      }

      const options: ScraperOptions = {
        companyId: bankId as unknown as CompanyTypes,
        startDate: startDate ? new Date(startDate) : new Date(),
        combineInstallments: combineInstallments ?? false,
        showBrowser: showBrowser ?? false
      };

      const scraper = createScraper(options);
      const scrapeResult = await scraper.scrape(credentials as ScraperCredentials);

      if (scrapeResult.success) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify(scrapeResult)
          }]
        };
      } else {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: scrapeResult.errorType,
              message: scrapeResult.errorMessage
            })
          }],
          isError: true
        };
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: "UNKNOWN_ERROR",
            message: error instanceof Error ? error.message : "Unknown error occurred"
          })
        }],
        isError: true
      };
    }
  }
);

// Add a tool for 2FA authentication
server.tool(
  "two-factor-auth",
  {
    bankId: z.enum(Object.values(CompanyTypes) as [string, ...string[]]),
    phoneNumber: z.string(),
    action: z.enum(["trigger", "get-token"]),
    otpCode: z.string().optional()
  },
  async ({ bankId, phoneNumber, action, otpCode }) => {
    try {
      const validBankIds = new Set(Object.values(CompanyTypes));
      if (!validBankIds.has(bankId as unknown as CompanyTypes)) {
        throw new Error(`Invalid bank ID: ${bankId}`);
      }

      const scraper = createScraper({
        companyId: bankId as unknown as CompanyTypes,
        startDate: new Date()
      });

      if (action === "trigger") {
        await scraper.triggerTwoFactorAuth(phoneNumber);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ success: true, message: "2FA code sent" })
          }]
        };
      } else if (action === "get-token" && otpCode) {
        const result = await scraper.getLongTermTwoFactorToken(otpCode);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result)
          }]
        };
      } else {
        throw new Error("Invalid action or missing OTP code");
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: "UNKNOWN_ERROR",
            message: error instanceof Error ? error.message : "Unknown error occurred"
          })
        }],
        isError: true
      };
    }
  }
);

// Start the server
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error); 