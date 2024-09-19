import fs from 'fs/promises';
import path from 'path/posix';
import parse from './markdown';

const POSTS_FOLDER_PATH = './src/app/_posts';

export interface Post {
  date: string;
  title: string;
  key: string;
}

export async function readRawPosts() {
  const contentPath = path.resolve(POSTS_FOLDER_PATH);

  try {
    const files = await fs.readdir(contentPath);

    const fileAbstract: Post[] = [];

    for(const file of files) {
      const filepath = `${contentPath}/${file}`;
      const filestat = await fs.stat(filepath);
      if (filestat.isDirectory()) {
        continue;
      }
      const mtime = filestat.mtime;
      const fileContent = await fs.readFile(filepath, {
        encoding: 'utf-8',
      });
      const lines = fileContent.split(/\r?\n/);

      let title = '';

      for (const line of lines) {
        if (line.startsWith('#') && !line.includes('##')) {
          title = line.replace('#', '').trim();
          break;
        }
      }

      fileAbstract.push({
        date: `${mtime.getFullYear()}-${mtime.getMonth() + 1}-${mtime.getDate()}`,
        title,
        key: file,
      });
    }
    return fileAbstract;
  } catch (error) {
    console.log('Read raw post error', error);
    return [];
  }
}

export async function getPostContent(fileName: string) {
  const filePath = path.resolve(`${POSTS_FOLDER_PATH}/${fileName}`);

  try {
    let content = await fs.readFile(filePath, {
      encoding: 'utf-8'
    });

    content = applyGithubPath(content);
    const result = await parse(content);
    return result;
  } catch(error) {
    console.log('Get post html content error', error);
    return null;
  }
}

function applyGithubPath(content: string) {
  if (process.env.GITHUB_PAGE_BASE_PATH) {
    const prefix = process.env.GITHUB_PAGE_BASE_PATH;
    return content.replaceAll('(/assets/', `(${prefix}/assets/`);
  }
  return content;
}
