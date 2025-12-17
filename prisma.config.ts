import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    db: {
      url: process.env.DATABASE_URL!, // použije tvoju env premennú
    },
  },
});
