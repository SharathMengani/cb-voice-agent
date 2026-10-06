import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(_request, { params }) {
  const { screen } = await params;
  const number = Number(screen);
  if (!Number.isInteger(number) || number < 1 || number > 51)
    return new NextResponse('Invalid screen', { status: 404 });
  const base = path.resolve(process.cwd(), '../../design-references');
  try {
    const files = await readdir(base);
    const filename = files.find(
      (file) => Number(file.split('_')[0]) === number && file.endsWith('.png'),
    );
    if (!filename) return new NextResponse('Reference not found', { status: 404 });
    const image = await readFile(path.join(base, filename));
    return new NextResponse(image, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch {
    return new NextResponse('Reference not installed', { status: 404 });
  }
}
