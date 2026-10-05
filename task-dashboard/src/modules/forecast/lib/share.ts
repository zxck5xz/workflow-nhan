import type { Inputs } from '../engine';

/** Bộ tham số được nén deflate rồi mã hoá base64url, đặt sau "#s=" trên URL. */
const PREFIX = '#s=';

function toBase64Url(bytes: Uint8Array): string {
  let s = '';
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const s = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

async function pipe(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeShareHash(inputs: Inputs): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(inputs));
  return PREFIX + toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
}

export async function decodeShareHash(hash: string): Promise<Inputs | null> {
  if (!hash.startsWith(PREFIX)) return null;
  try {
    const bytes = await pipe(
      fromBase64Url(hash.slice(PREFIX.length)),
      new DecompressionStream('deflate-raw'),
    );
    return JSON.parse(new TextDecoder().decode(bytes)) as Inputs;
  } catch {
    return null;
  }
}
