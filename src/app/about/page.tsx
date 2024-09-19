import Image from 'next/image';
import weixinPng from 'public/assets/weixin.png';

export default function About() {
  return (
    <>
      <h1>关于我</h1>
      <p>
        一个前端手艺人
      </p>
      <h2>技能</h2>
      <ul>
        <li>
          <span className="pr-4"><strong>前端: </strong></span>
          React.js, Vue.js, Angular.js, RxJS 和 Next.js
        </li>
        <li><span className="pr-4"><strong>后端: </strong></span>Node.js 和 Express</li>
        <li><span className="pr-4"><strong>运维: </strong></span>Docker 和 Nginx</li>
      </ul>
      <h2>联系我</h2>
      <ul>
        <li>
          <span className="pr-4"><strong>邮箱: </strong></span>
          <a className="underline" href="mailto:sheguloves@hotmail.com">sheguloves@hotmail.com</a>
        </li>
        <li>
          <span className="pr-4"><strong>微信: </strong></span>
          <Image src={weixinPng} alt='weixin' width={200}></Image>
        </li>
      </ul>
      <p className='mt-8'>欢迎联系我，一起合作，一起讨论技术，一起飞</p>
    </>
  )
}