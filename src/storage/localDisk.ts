import { mkdir, writeFile } from "fs/promises";
import { join, extname, basename } from "path";
import { randomUUID } from "crypto";

const mediaDir = process.env.MEDIA_DIR || "/home/ubuntu/ugfvc-media";
const baseUrl = (process.env.MEDIA_BASE_URL || "").replace(/\/+$/, "");

// Keeps the original name readable but guarantees uniqueness, so re-uploading
// a file called image.png does not overwrite an earlier one.
function uniqueName(originalName: string) {
  const ext = extname(originalName);
  const stem = basename(originalName, ext)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  return `${stem}-${randomUUID().slice(0, 8)}${ext.toLowerCase()}`;
}

export async function uploadToLocalDisk(
  data: Buffer,
  originalName: string,
  _mimeType: string,
) {
  await mkdir(mediaDir, { recursive: true });
  const filename = uniqueName(originalName);
  await writeFile(join(mediaDir, filename), data);
  return { url: `${baseUrl}/${filename}`, filename };
}
