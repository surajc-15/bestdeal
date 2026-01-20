// // prisma.config.ts
// import { defineConfig } from "prisma/config";

// export default defineConfig({
//     migrations: {
//         path: "prisma/migrations",
//     },
//     db: {
//         adapter: "postgresql",
//         url: process.env.DATABASE_URL!,
//     },
// });
import { defineConfig } from "prisma/config";

export default defineConfig({
    migrations: {
        path: "prisma/migrations",
    },
});
