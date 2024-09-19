import PostList from "@/app/components/Posts";
import { getPostContent, readRawPosts } from "@/app/utils/file-util"

export async function generateStaticParams() {
  const posts = await readRawPosts();

  return posts.map((post) => ({
    post: post.key,
  }))
}

export default async function Post({ params }: { params: { post: string } }) {

  const contentResult = await getPostContent(params.post);
  if (contentResult) {
    return (
      <div className="flex flex-row w-full pt-0">
        <aside className="hidden md:block md:w-1/5 pl-6 max-h-[90vh] h-full overflow-auto sticky top-16 left-0 mt-6">
          <PostList></PostList>
        </aside>
        <div className="w-full md:w-3/5 px-2 md:px-12 px-4">
          <article className="post-article"
            dangerouslySetInnerHTML={{ __html: contentResult.article}}>
          </article>
        </div>
        <div className="hidden lg:flex flex-col justify-start md:w-1/5 pr-6">
          <div className="sticky top-16 right-0 mt-6" dangerouslySetInnerHTML={{ __html: contentResult.tableOfContent }}></div>
        </div>
      </div>
    )
  }
  return <></>
}