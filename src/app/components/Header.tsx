import Link from "next/link";
import Image from 'next/image'
import githubImg from 'public/assets/github.png';

const myGithubPage = process.env.MY_GITHUB_PAGE || '';

export default function Header() {
  return (
    <header className="h-14 bg-navbar text-textcolor flex items-center gap-6 justify-stretch px-10">
      <nav className="flex-auto flex items-center gap-6">
        <Link href="/" className="text-xl">首页</Link>
        <Link href="/about" className="text-xl">关于我</Link>
      </nav>
      <Link href={myGithubPage} className="">
        <Image src={githubImg} alt="Picture of github"></Image>
      </Link>

    </header>
  );
}