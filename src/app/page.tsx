import Link from "next/link";
import { readRawPosts } from "./actions/file.actions";

export default async function Home() {

  const posts = await readRawPosts();

  return (
    <div className="font-[family-name:var(--font-geist-sans)] flex flex-col md:w-3/5 posts">
      <section className="posts-top">
        <h1>老席的代码仓库</h1>
      </section>
      <ul>
        {
          posts.map(item => item).map(item => {
            return (
            <li key={item.key} className="flex gap-10">
              <span>{item.date}</span>
              <Link href={`/posts/${item.key}`}>{item.title}</Link>
            </li>)
          })
        }
      </ul>
    </div>
  );
}
