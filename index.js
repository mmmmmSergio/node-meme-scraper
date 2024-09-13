import { mkdir, writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { join } from 'path';

const url = 'https://memegen-link-examples-upleveled.netlify.app';

const downloadImage = async (url, filepath) => {
  const response = await fetch(url);
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
      imageUrls.map(async (url, index) => {
        const filename = `${String(index + 1).padStart(2, '0')}.jpg`;
        const filepath = join(memesDir, filename);
        console.log(`Downloading: ${url} -> ${filename}`);
        await downloadImage(url, filepath);
      }),
    );

    console.log('YEAH!');
  } catch (error) {
    console.error('Error:', error);
  }
};

fetchImages();
