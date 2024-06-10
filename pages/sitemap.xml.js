export async function getServerSideProps(context) {
  let response = await fetch(
    "https://blog-zo8s.vercel.app/app/v2/getArticles",
    { method: "GET" }
  );
  let data = await response.json();
  let { success, article } = data;

  const xml = await generateSiteMap({ article });
  context.res.end(xml);

  return {
    props: {},
  };
}

async function generateSiteMap({ article }) {
  try {
    // Generate dynamic sitemap
    let currentDate = new Date().toISOString();
    let baseUrl = "https://webgrasper.vercel.app";

    let urls = article.map((article, index) => ({
      loc: `${baseUrl}/article/${encodeURIComponent(
        article.title.replace(/ /g, "-")
      )}`,
      lastmod: currentDate,
      priority: 0.8,
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url>
          <loc>${baseUrl}</loc>
          <lastmod>${currentDate}</lastmod>
          <priority>0.9</priority>
        </url>
        <url>
          <loc>${baseUrl}/portfolio</loc>
          <lastmod>${currentDate}</lastmod>
          <priority>0.7</priority>
        </url>
        <url>
          <loc>${baseUrl}/article-page?name=Politics</loc>
          <lastmod>${currentDate}</lastmod>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>${baseUrl}/article-page?name=Technology</loc>
          <lastmod>${currentDate}</lastmod>
          <priority>0.8</priority>
        </url>
        <url>
        <loc>${baseUrl}/article-page?name=Cricket</loc>
        <lastmod>${currentDate}</lastmod>
        <priority>0.8</priority>
        </url>
        <url>
        <loc>${baseUrl}/article-page?name=Railway</loc>
        <lastmod>${currentDate}</lastmod>
        <priority>0.8</priority>
        </url>
        <url>
        <loc>${baseUrl}/article-page?name=Stocks</loc>
        <lastmod>${currentDate}</lastmod>
        <priority>0.8</priority>
        </url>
        <url>
        <loc>${baseUrl}/article-page?name=Crypto</loc>
        <lastmod>${currentDate}</lastmod>
        <priority>0.8</priority>
        </url>
        <url>
          <loc>${baseUrl}/terms-and-conditions</loc>
          <lastmod>${currentDate}</lastmod>
          <priority>0.7</priority>
        </url>
        <url>
          <loc>${baseUrl}/about-us</loc>
          <lastmod>${currentDate}</lastmod>
          <priority>0.7</priority>
        </url>
        <url>
          <loc>${baseUrl}/contact-us</loc>
          <lastmod>${currentDate}</lastmod>
          <priority>0.7</priority>
        </url>
            ${urls
              .map(
                ({ loc, lastmod, priority }) => `
                  <url>
                    <loc>${loc}</loc>
                    <lastmod>${lastmod}</lastmod>
                    <priority>${priority}</priority>
                  </url>
                `
              )
              .join("")}
          </urlset>`;
    return xml;
  } catch (error) {
    // Handle errors here
    console.error("Error generating sitemap:", error);
    return error;
  }
}

export default function Sitemap() {
  return null;
}
