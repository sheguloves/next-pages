import { getPostContent, readRawPosts } from "@/app/actions/file.actions";

export async function generateStaticParams() {
  const posts = await readRawPosts();

  return posts.map((post) => ({
    post: post.key,
  }))
}

export default async function Post({ params }: { params: { post: string } }) {

  const content = await getPostContent(params.post);
  return (
    <article className="md:w-3/5 block">
      <div className="pb-4" dangerouslySetInnerHTML={{ __html: content}}></div>
    </article>
  )
}