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
import { v4 as uuidv4 } from "uuid";
import { openModal } from "@/store/authUISlice";
import { Send } from "lucide-react";
import { articleService } from "@/services/articleService";
import { userService } from "@/services/userService";
import { commentService } from "@/services/commentService";
import { articleUtils } from "@/utils/articleUtils";

export const getServerSideProps = async (context) => {
    const { title } = context.query;

    try {
        const data = await articleService.getSingleArticle(title);

        if (data.success === false || (!data.article && !data.title)) {
            return { notFound: true };
        }

        let article = data.article || data;

        // Handle description parsing
        if (article && article.description && typeof article.description === "string") {
            try {
                article.description = JSON.parse(article.description);
            } catch { /* Stay as HTML string */ }
        }

        // Fetch creator, comments, and commenters in parallel
        const articleID = article?._id;
        const [final_article_creator, commentsData] = await Promise.all([
            userService.getSingleUserDetails(article?.createdBy),
            commentService.getComments(articleID)
        ]);

        const rawComments = commentsData?.comments || [];
        const commenterIds = [...new Set(rawComments.map(c => c.commenterID))];
        
        let commenters = [];
        if (commenterIds.length > 0) {
            commenters = await commentService.getCommenters(commenterIds);
        }

        const processedComments = articleUtils.processComments(rawComments, commenters);

        // Article formatting
        article.currentTime = moment().toISOString();

        return {
            props: {
                article,
                final_comments_res: processedComments.reverse(),
                final_article_creator,
            },
        };
    } catch (error) {
        console.error("ArticleDetail: getServerSideProps error:", error);
        return { notFound: true };
    }
};

function Article({ article, final_comments_res, final_article_creator }) {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const dispatch = useDispatch();
    const router = useRouter(); // Initialize useRouter
    const [isSubmit, setSubmit] = useState(false);
    const state = useSelector((state) => state.addComment);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [comments, setComments] = useState(final_comments_res);
    const [timeAgo, setTimeAgo] = useState(null);

    useEffect(() => {
        setTimeAgo(moment(article.createdAt).fromNow());
    }, [article.createdAt]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!Cookies.get("token")) {
            dispatch(openModal("login"));
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
                event.target.reset(); // Reset form fields
            }
            setSubmit(false); // End loading state
        }
    };

    useEffect(() => {
        const timeout = setTimeout(async () => {
            try {
                const response = await commentService.incrementViews(article?._id);
                console.log("Views incremented:", response);
            } catch (error) {
                console.error("Failed to increment views:", error);
            }
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

    const profileState = useSelector((state) => state.profile);
    const [isToken, setToken] = useState(false);

    useEffect(() => {
        if (Cookies.get("token")) {
            setToken(true);
        } else {
            setToken(false);
        }
    }, [profileState.data]); // Re-run when profile data changes (login/logout)


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
                                    src={final_article_creator?.user?.avatar || "https://ik.imagekit.io/94nzrpaat/images/resize.jpg"}
                                    alt={"Article creator image"}
                                    width={44}
                                    loading="lazy"
                                    height={44}
                                    style={{ objectFit: 'contain' }}
                                />
                                <div className={styles.creatorDetailsContainer}>
                                    <h6>{final_article_creator?.user?.username}</h6>
                                    <div className={styles.articleTimePeriod}>
                                        <p>
                                            Published in <span>{article?.category}</span>
                                        </p>
                                        <p>{timeAgo || "..."}</p>
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
                                        style={{ objectFit: 'contain' }}
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
                                        style={{ objectFit: 'contain' }}
                                    />
                                    <p>{comments?.length}</p>
                                </div>
                            </div>
                        </div>
                        <Image
                            className={styles.articleImage}
                            src={article.articleImage?.[0] || "https://ik.imagekit.io/94nzrpaat/images/pixelcut-export%20(4).png"}
                            alt={article.title || "article image"}
                            width={800}
                            loading="lazy"
                            height={600}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                        <h2>Description</h2>
                        <div className={styles.dynamicHtmlContent}>
                            <Renderer content={article?.description} />
                        </div>
                    </div>
                    <div className={styles.commentsContainer}>
                        <div className={styles.commentsHeading}>
                            <h5>Comments</h5>
                            <span className={styles.commentCountBadge}>{comments?.length}</span>
                        </div>

                        <form className={styles.commentForm} onSubmit={handleSubmit}>
                            <textarea
                                className={styles.commentTextArea}
                                placeholder="What are your thoughts?"
                                name="commentBody"
                                id="commentBody"
                                required={isToken ? true : false}
                                rows={3}
                            />
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.submitBtn}>
                                    {isToken ? (
                                        <>
                                            Submit <Send size={14} style={{ marginLeft: '6px' }} />
                                        </>
                                    ) : "Login to comment"}
                                </button>
                            </div>
                        </form>

                        <div className={styles.commentDivider} />

                        <div className={styles.commentList}>
                            {comments.map((comment) => (
                                <div key={comment._id} className={styles.commenterContainer}>
                                    <Link href={"#"} className={styles.commenterImage}>
                                        <Image
                                            width={40}
                                            height={40}
                                            loading="lazy"
                                            src={comment.commenterImage || 'https://ik.imagekit.io/94nzrpaat/images/default-avatar.png'}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Article;
