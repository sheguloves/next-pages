import PostList from "./components/Posts";

export default async function Home() {

  return (
    <div className="flex flex-col w-full md:w-3/5 pt-8 px-12 self-center">
      <section className="posts-top">
        <h1>老席的代码仓库</h1>
        <p className="mt-4 mb-4">一个码农, 热爱搬砖, 热爱技术</p>
      </section>
      <PostList></PostList>
    </div>
  );
}
