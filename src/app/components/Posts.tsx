import Link from "next/link";
import { readRawPosts } from "../utils/file-util";

export default async function PostList() {

  const posts = await readRawPosts();

  return (
    <ul>
      {
        posts.map(item => item).map(item => {
          return (
          <li key={item.key}>
            <div className="flex gap-10">
              <span className="post-date hidden sm:block shrink-0">{item.date}</span>
              <Link href={`/posts/${item.key}`}>{item.title}</Link>
            </div>
          </li>)
        })
      }
    </ul>
  );
}