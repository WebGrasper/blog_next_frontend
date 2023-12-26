import { useRouter } from 'next/router';

function Article() {
  const router = useRouter();
  const { title } = router.query;

  console.log({ title });

  return (
    <>
      <h1>{`${title}`}</h1>
    </>
  );
}

export default Article;
