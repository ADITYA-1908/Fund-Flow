import express from "express";
import fs from "fs";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger options for generating spec from JSDoc comments
const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FundFlow API",
      version: "1.0.0",
      description:
        "A comprehensive RESTful API for the FundFlow mutual funds platform",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://api.fundflow.com"
            : "https://fund-flow-backend.onrender.com",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js", "./server.js"], // Scan your route and server files
};

// Generate default spec from comments
const swaggerSpecFallback = swaggerJsdoc(swaggerOptions);

// Try loading custom swagger.json from /swagger directory
let swaggerDocument;
try {
  const swaggerPath = path.join(__dirname, "..", "swagger", "swagger.json");
  const swaggerContent = fs.readFileSync(swaggerPath, "utf8");
  swaggerDocument = JSON.parse(swaggerContent);

  // Update server URLs dynamically
  swaggerDocument.servers = [
    {
      url:
        process.env.NODE_ENV === "production"
          ? "https://api.fundflow.com"
          : "https://fund-flow-backend.onrender.com",
      description:
        process.env.NODE_ENV === "production"
          ? "Production server"
          : "Development server",
    },
  ];
} catch (error) {
  console.warn("⚠️ Failed to load swagger.json. Using fallback spec.");
  swaggerDocument = swaggerSpecFallback;
}

// Swagger UI options
const swaggerUiOptions = {
  customCss: `
  .swagger-ui .topbar {
    display: none;
  }

  .swagger-ui .info {
    background-color: #f9fafb;
    border-left: 6px solid #2563eb;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .swagger-ui .info .title {
    font-size: 2.25rem !important;
    font-weight: 700;
    color: #1d4ed8 !important;
    margin-bottom: 6px;
  }

  .swagger-ui .info .version {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 16px;
  }

  .swagger-ui .info .description {
    font-size: 1rem;
    color: #374151;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .swagger-ui .info a {
    color: #2563eb !important;
    text-decoration: none;
  }

  .swagger-ui .info a:hover {
    text-decoration: underline;
    color: #1e40af !important;
  }

  .swagger-ui .scheme-container {
    background: #f1f5f9;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
  }

  .swagger-ui .opblock.opblock-post {
    border-color: #22c55e;
  }

  .swagger-ui .opblock.opblock-get {
    border-color: #3b82f6;
  }

  .swagger-ui .opblock.opblock-delete {
    border-color: #ef4444;
  }

  .swagger-ui .btn.authorize {
    background-color: #2563eb;
    border-color: #2563eb;
  }

  .swagger-ui .btn.authorize:hover {
    background-color: #1d4ed8;
  }
`,

  customSiteTitle: "FundFlow API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: "list",
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  },
};

// Serve Swagger UI at /api/docs
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument, swaggerUiOptions));

// Serve raw JSON spec at /api/docs/json
router.get("/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

// Serve YAML spec at /api/docs/yaml
router.get("/yaml", (req, res) => {
  try {
    const yamlPath = path.join(__dirname, "..", "swagger", "swagger.yaml");
    const yamlContent = fs.readFileSync(yamlPath, "utf8");
    res.setHeader("Content-Type", "text/yaml");
    res.send(yamlContent);
  } catch (error) {
    res.status(404).json({ message: "YAML file not found" });
  }
});

export default router;
