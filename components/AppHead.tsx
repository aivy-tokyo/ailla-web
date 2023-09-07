import { buildUrl } from "@/utils/buildUrl";
import Head from "next/head";
import { avatars } from "../utils/constants";
export const AppHead = () => {
  const title = "AILLA";
  const description = "英会話AI";
  const imageUrl = `${process.env.NEXT_PUBLIC_SITE_DOMAIN}/ogp.png`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/urara_favicon.png"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      {avatars.map((avatar) => (
        <link key={avatar.path} rel="preload" href={avatar.path} as="fetch" />
      ))}
    </Head>
  );
};
