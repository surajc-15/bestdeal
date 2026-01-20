import Link from "next/link";
import { auth } from "@/auth";
import HomeClient from "./HomeClient";

// Server Component Wrapper to fetch auth
export default async function Home() {
  const session = await auth();
  return <HomeClient session={session} />;
}
