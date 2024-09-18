export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="md:w-3/5 block">
      { children }
    </section>
  );
}