import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/article.module.css";
import Renderer from "@/utils/renderer";
import { addComment, resetACState } from "@/store/commentSlice";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import moment from "moment";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs for comments

export const getServerSideProps = async (context) => {
  const { title } = context.query;
  const response = await fetch(
    `https://blog-zo8s.vercel.app/app/v2/getSingleArticle/${title}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  let { success, article } = data;
  article.description = JSON.parse(article?.description);

  const article_creator = await fetch(
    `https://blog-zo8s.vercel.app/app/v1/getSingleUserDetails?` +
      new URLSearchParams({
        creatorID: article?.createdBy,
      }),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let final_article_creator = await article_creator.json();

  let articleID = article?._id;

  const comments_res = await fetch(
    `https://blog-zo8s.vercel.app/app/v2/getComments?` +
      new URLSearchParams({
        articleID: articleID,
      }),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let final_comments_res = await comments_res.json();

  // Extract commenter IDs
  const commenterIds = final_comments_res?.comments.map(
    (comment) => comment.commenterID
  );

  // Fetch commenter details
  const commentersRes = await fetch(
    `https://blog-zo8s.vercel.app/app/v1/getCommenters`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commenterIds }),
    }
  );

  const commentersData = await commentersRes.json();
  const commenters = commentersData?.commenters;

  // Combine comments with commenter details
  final_comments_res = final_comments_res.comments.map((comment) => {
    const commenter = commenters.find((c) => c._id === comment.commenterID);
    let commenterName = commenter?.username;
    let commenterImage = undefined;
    if (
      commenter &&
      typeof commenter.avatar === "string" &&
      commenter.avatar.startsWith("http")
    ) {
      commenterImage = commenter.avatar;
    }

    // Calculate human-readable time
    let timeAgo = moment(comment.commentedAt).fromNow();

    return {
      ...comment,
      commenterName,
      commenterImage,
      timeAgo,
    };
  });

  // Calculate human-readable time for the article
  let articleTimeAgo = moment(article.createdAt).fromNow();

  // Append current time to the JSON response
  article.currentTime = moment().toISOString();
  article.timeAgo = articleTimeAgo;

  return {
    props: {
      article,
      final_comments_res: final_comments_res.reverse(),
      final_article_creator,
    },
  };
};

function Article({ article, final_comments_res, final_article_creator }) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize useRouter
  const [isSubmit, setSubmit] = useState(false);
  const state = useSelector((state) => state.addComment);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [comments, setComments] = useState(final_comments_res); // Use state to manage comments

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Cookies.get("token")) {
      router.push("/login");
    } else {
      const formData = new FormData(event.target); // Get form data
      const { commentBody } = Object.fromEntries(formData.entries()); // Convert FormData to plain object
      let articleID = article?._id;
      setSubmit(true);
      let token = cookies.token;
      let response = await dispatch(
        addComment({ articleID, token, commentBody })
      );
      if (response?.payload?.success) {
        const newComment = {
          _id: uuidv4(), // Generate a unique ID for the new comment
          commenterName: Cookies.get("username"), // Replace with actual username if available
          commenterImage: Cookies.get("avatar"), // Replace with actual image URL if available
          commentBody: commentBody,
          commentedAt: new Date().toISOString(),
        };

        setComments((prevComments) => [newComment, ...prevComments]);
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(async() => {
      const response = await fetch(
        `https://blog-zo8s.vercel.app/app/v2/viewsIncrementer?` +
          new URLSearchParams({
            articleID: article?._id,
          }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let FR = await response.json();
      console.log(FR);
    }, 30000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (state?.data?.success) {
      enqueueSnackbar(state?.data?.message, {
        autoHideDuration: 2000,
        variant: "success",
      });
    }
    if (!state?.data?.success && state?.data?.message) {
      enqueueSnackbar(state?.data?.message, {
        autoHideDuration: 2000,
        variant: "error",
      });
    }
    dispatch(resetACState());
  }, [state?.data?.success]);

  //Check for token presence
  const [isToken, setToken] = useState(false);
  useEffect(() => {
    if (Cookies.get("token")) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, []);


  return (
    <div>
      <Head>
        <title>{article.title}</title>
        <meta
          name="description"
          content={article?.description?.slice(0, 150)}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={article.title} />
        <meta
          property="og:description"
          content={article?.description?.slice(0, 150)}
        />

        <meta
          property="og:image"
          content={
            article?.articleImage?.[0] || "https://picsum.photos/1200/630"
          }
        />

        <link
          rel="canonical"
          href={`https://webgrasper.vercel.app/${article.title.replace(
            /\s+/g,
            "-"
          )}`}
        />

        <meta property="og:image" content="https://techamaan.com/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>
      <div className={styles.articlePageSupremeContainer}>
        <div className={styles.articleMainContainer}>
          <div className={styles.articleContainer}>
            <h1>{article.title}</h1>
            <div className={styles.creatorMainContainer}>
              <div className={styles.creatorContainer}>
                <Image
                  className={styles.creatorImage}
                  src={final_article_creator?.user?.avatar}
                  alt={"Article creator image"}
                  width={44}
                  loading="lazy"
                  height={44}
                  objectFit="contain"
                />
                <div className={styles.creatorDetailsContainer}>
                  <h6>{final_article_creator?.user?.username}</h6>
                  <div className={styles.articleTimePeriod}>
                    <p>
                      Published in <span>{article?.category}</span>
                    </p>
                    <p>{article.timeAgo}</p>
                  </div>
                </div>
              </div>
              <div className={styles.articleStatsContainer}>
                <div className={styles.viewsContainer}>
                  <Image
                    className={styles.eyeIcon}
                    src={'/eye-icon.png'}
                    alt={"Eye icon"}
                    width={25}
                    loading="lazy"
                    height={25}
                    objectFit="contain"
                  />
                  <p>{article?.impressions}</p>
                </div>
                <div className={styles.commentCountContainer}>
                <Image
                    className={styles.eyeIcon}
                    src={'/comment-icon.png'}
                    alt={"Comment icon"}
                    width={25}
                    loading="lazy"
                    height={25}
                    objectFit="contain"
                  />
                  <p>{comments?.length}</p>
                </div>
              </div>
            </div>
            <Image
              className={styles.articleImage}
              src={article.articleImage?.[0]}
              alt={article.title}
              width={800}
              loading="lazy"
              height={600}
              layout="responsive"
              objectFit="cover"
            />
            <h2>Description</h2>
            <div className={styles.dynamicHtmlContent}>
              {article?.description.map((ptr, index) => Renderer(ptr, index))}
            </div>
          </div>
          <div className={styles.commentsContainer}>
            <h5>Comments</h5>
            {comments.map((comment) => (
              <div key={comment._id} className={styles.commenterContainer}>
                <Link href={"#"} className={styles.commenterImage}>
                  <Image
                    width={40}
                    height={40}
                    loading="lazy"
                    src={comment.commenterImage}
                    alt="commenters profile image"
                  />
                </Link>
                <div className={styles.commenterDetails}>
                  <div className={styles.commenterSubDetails}>
                    <h6 className={styles.commenterName}>
                      {comment.commenterName}
                    </h6>
                    <p className={styles.commentTime}>{comment.timeAgo}</p>
                  </div>
                  <p className={styles.comment}>{comment.commentBody}</p>
                </div>
              </div>
            ))}
            <form className={styles.commentForm} onSubmit={handleSubmit}>
              <input
                type="text"
                className="form__field"
                placeholder="Leave your comment"
                name="commentBody"
                id="commentBody"
                required={isToken ? true : false}
              />
              <button type="submit">{isToken ? "Submit" : "Login"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
