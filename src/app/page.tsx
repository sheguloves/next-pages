import Link from "next/link";
import { readRawPosts } from "./actions/file.actions";

export default async function Home() {

  const posts = await readRawPosts();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ul>
        {
          posts.map(item => item).map(item => {
            return (<li key={item}><Link href={`/posts/${item}`}>{item}</Link></li>)
          })
        }
      </ul>
    </div>
  );
}
