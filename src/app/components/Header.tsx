import Link from "next/link";
import Image from 'next/image'
import githubImg from 'public/assets/github.png';

const myGithubPage = process.env.MY_GITHUB_PAGE || '';

export default function Header() {
  return (
    <header className="h-14 bg-navbar flex items-center gap-6 justify-stretch px-10 shrink-0">
      <div className="md:w-1/5"></div>
      <nav className="flex-auto flex items-center gap-6">
        <Link href="/" className="text-xl text-textcolor">首页</Link>
        <Link href="/about" className="text-xl text-textcolor">关于我</Link>
      </nav>
      <Link href={myGithubPage} className="">
        <Image src={githubImg} alt="Picture of github"></Image>
      </Link>

    </header>
  );
}