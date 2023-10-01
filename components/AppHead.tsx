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
      <meta name="apple-mobile-web-app-capable" content="yes" />t
      {avatars.map((avatar) => (
        <link key={avatar.path} rel="preload" href={avatar.path} as="fetch" />
      ))}

      <script dangerouslySetInnerHTML={{ __html: `
        (function(d) {
          var config = {
          kitId: 'zmw3nec',
          scriptTimeout: 3000,
          async: true
          },
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
      })(document);
    ` }}/>
    </Head>
    
  );
};
