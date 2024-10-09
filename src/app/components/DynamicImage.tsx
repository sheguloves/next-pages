import Image from "next/image";

export default async function DynamicImage({ src, alt }: {
  src: string;
  alt: string;
}) {

  const image = await import(`public/assets/${src}`);

  return (
    <Image src={image.default} alt={alt}></Image>
  );
}