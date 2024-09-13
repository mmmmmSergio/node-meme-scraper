import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const url = 'https://memegen-link-examples-upleveled.netlify.app';

const downloadImage = async (imageUrl, filepath) => {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(filepath, buffer);
};

const fetchImages = async () => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const root = parse(html);
    const imgTags = root.querySelectorAll('img');
    const imageUrls = imgTags
      .slice(0, 10)
      .map((img) => img.getAttribute('src'));

    const memesDir = join(process.cwd(), 'memes');
    await mkdir(memesDir, { recursive: true });

    await Promise.all(
      imageUrls.map(async (imageUrl, index) => {
        const filename = `${String(index + 1).padStart(2, '0')}.jpg`;
        const filepath = join(memesDir, filename);
        console.log(`Downloading: ${imageUrl} -> ${filename}`);
        await downloadImage(imageUrl, filepath);
      }),
    );

    console.log('YEAH!');
  } catch (error) {
    console.error('Error:', error);
  }
};

await fetchImages();
