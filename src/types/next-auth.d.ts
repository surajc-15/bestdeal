import NextAuth, { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

// augment types
declare module "next-auth" {
    interface User {
        role: Role;
    }
    interface Session {
        user: {
            role: Role;
            id: String;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: Role;
        id: String;
    }
}
