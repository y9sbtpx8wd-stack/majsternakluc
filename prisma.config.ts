import { defineConfig } from '@prisma/client/runtime/library';

export default {
  schema: 'apps/api/prisma/schema.prisma',
  datasource: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
};
