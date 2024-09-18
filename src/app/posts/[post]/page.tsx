import { getPostContent, readRawPosts } from "@/app/actions/file.actions";

export async function generateStaticParams() {
  const posts = await readRawPosts();

  return posts.map((post) => ({
    post,
  }))
}

export default async function Post({ params }: { params: { post: string } }) {

  const content = await getPostContent(params.post);
  return <div dangerouslySetInnerHTML={{ __html: content}}></div>
}