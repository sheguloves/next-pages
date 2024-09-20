import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import { getHeadingList, gfmHeadingId } from "marked-gfm-heading-id";

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

let tableOfContent = '';

marked.use(gfmHeadingId({prefix: 'md-'}), {
	hooks: {
		postprocess(html) {
			const headings = getHeadingList().filter(({level}) => level > 1);
      tableOfContent = '';
      if (headings.length >= 2) {
        tableOfContent = `
          <ul id="table-of-contents">
            ${headings.map(({id, raw, level}) => `<li class="ml-${(level - 2) * 4}"><a href="#${id}">${raw}</a></li>`).join('')}
          </ul>
        `;
      }
      return html;
		}
	}
});

export default async function parse(content: string) {
  const article = await marked.parse(content);
  return {
    article,
    tableOfContent,
  }
}
