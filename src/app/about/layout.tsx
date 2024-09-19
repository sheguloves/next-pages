export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full md:w-3/5 pt-8 md:px-12 self-center">
      {children}
    </div>
  );
}