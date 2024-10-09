import DynamicImage from "@/app/components/DynamicImage";
import PostList from "@/app/components/Posts";
import { getPostContent, readRawPosts } from "@/app/utils/file-util";
import parse, { Element } from 'html-react-parser';

export async function generateStaticParams() {
  const posts = await readRawPosts();

  return posts.map((post) => ({
    post: post.key,
  }));
}

export default async function Post({ params }: { params: { post: string } }) {

  const contentResult = await getPostContent(params.post);

  if (contentResult) {

    const artical = parse(contentResult.article, {
      replace(domNode) {
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'img') {
          return <DynamicImage src={domNode.attribs.src} alt={domNode.attribs.alt}></DynamicImage>
        }
      },
    });

    const tableOfContent = parse(contentResult.tableOfContent);

    return (
      <div className="flex flex-row w-full pt-0">
        <aside className="hidden md:block md:w-1/5 pl-6 max-h-[90vh] h-full overflow-auto sticky top-16 left-0 mt-6">
          <PostList></PostList>
        </aside>
        <div className="w-full md:w-3/5 md:px-12 px-8">
          <article className="post-article">
            {artical}
          </article>
        </div>
        <div className="hidden lg:flex flex-col justify-start md:w-1/5 pr-6">
          <div className="sticky top-16 right-0 mt-6">
            {tableOfContent}
          </div>
        </div>
      </div>
    )
  }
  return <></>
}