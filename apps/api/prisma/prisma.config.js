const { defineConfig } = require("@prisma/config");

module.exports = defineConfig({
  datasources: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
    },
  },
});
