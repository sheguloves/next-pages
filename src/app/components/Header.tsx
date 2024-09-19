import Link from "next/link";
import Image from 'next/image'
import githubImg from 'public/assets/github.png';

const myGithubPage = process.env.MY_GITHUB_PAGE || '';

export default function Header() {
  return (
    <header className="h-14 bg-navbar flex items-center gap-6 justify-stretch px-10 shrink-0 sticky top-0 z-20">
      <div className="md:w-1/5"></div>
      <nav className="flex-auto flex items-center gap-6 font-medium">
        <Link href="/" className="text-xl">首页</Link>
        <Link href="/about" className="text-xl">关于我</Link>
      </nav>
      <Link href={myGithubPage} target="_blank">
        <Image src={githubImg} alt="Picture of github"></Image>
      </Link>

    </header>
  );
}