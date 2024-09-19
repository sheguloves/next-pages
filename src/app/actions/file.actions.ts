import fs from 'fs/promises';
import path from 'path/posix';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';

const POSTS_FOLDER_PATH = './src/app/_posts';

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (error) {
        console.log('Highlight error: ', error);
      }
    }

    return ''; // use external default escaping
  }
});

export async function readRawPosts() {
  const contentPath = path.resolve(POSTS_FOLDER_PATH);

  try {
    const files = await fs.readdir(contentPath);

    const fileAbstract: {
      date: string;
      title: string;
      key: string;
    }[] = [];

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
    return md.render(content);
  } catch(error) {
    console.log('Get post html content error', error);
    return [];
  }
}

function applyGithubPath(content: string) {
  if (process.env.GITHUB_PAGE_BASE_PATH) {
    const prefix = process.env.GITHUB_PAGE_BASE_PATH;
    return content.replaceAll('(/assets/', `(${prefix}/assets/`);
  }
  return content;
}
