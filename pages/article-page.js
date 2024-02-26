import ArticleCard from "@/components/articleCard";

function ArticlePage({ articles }) {
  console.log(articles)
  return (
    <>
      {articles && articles.map((article, index)=>(
        <ArticleCard article={article} key={index} />
      ))}
    </>
  );
}

export const getServerSideProps = async (context) => {
  const name = context.query.name;
  const response = await fetch(
    `https://blog-zo8s.vercel.app/app/v2/search?name=${name}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  let { success, articles } = data;
  return {
    props: {
      articles,
    },
  };
};

export default ArticlePage;
