import fs from 'fs/promises';
import path from 'path/posix';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';

const POSTS_FOLDER_PATH = './src/app/_posts';

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (error) {
        // TODO: jump to error page
        console.log(error);
      }
    }

    return ''; // use external default escaping
  }
});

export async function readRawPosts() {
  const contentPath = path.resolve(POSTS_FOLDER_PATH);

  try {
    const files = await fs.readdir(contentPath);
    return files;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPostContent(fileName: string) {
  const filePath = path.resolve(`${POSTS_FOLDER_PATH}/${fileName}`);

  try {
    const content = await fs.readFile(filePath, {
      encoding: 'utf-8'
    });
    return md.render(content);
  } catch(error) {
    console.log(error);
    return [];
  }
}
