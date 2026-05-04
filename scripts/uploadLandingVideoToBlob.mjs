import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".mp4") return "video/mp4";
    if (ext === ".webm") return "video/webm";
    if (ext === ".mov") return "video/quicktime";

    return "application/octet-stream";
}

async function main() {
    const source = process.argv[2] || "public/landing/brewlotto-cta-mobile.mp4";
    const blobName = process.argv[3] || "brewlotto-cta-mobile.mp4";

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error("Missing BLOB_READ_WRITE_TOKEN");
    }

    const filePath = path.resolve(process.cwd(), source);
    const buffer = fs.readFileSync(filePath);

    const result = await put(blobName, buffer, {
        access: "public",
        contentType: getContentType(filePath),
        token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log(result.url);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
