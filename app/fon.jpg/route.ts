import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "fon.jpg");
    const file = await readFile(filePath);
    return new Response(file, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch {
    return new Response("fon.jpg not found in repository root", { status: 404 });
  }
}
