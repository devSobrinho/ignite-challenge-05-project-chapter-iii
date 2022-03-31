import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { BiTimeFive, BiLoaderAlt } from 'react-icons/bi';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { estimatedTimeToRead } from '../../utils/estimatedTimeToRead';
import { formateDate } from '../../utils/formatDate';
import Header from '../../components/Header';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
        type: string; //
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [postState, setPostState] = useState<Post>();
  const [timeReadState, setTimeReadState] = useState('');

  useEffect(() => {
    if (router.isFallback) {
      console.log('router.isFallback', router.isFallback);

      setLoading(true);
    }
    if (!router.isFallback) {
      console.log('router.isFallback', router.isFallback);

      setLoading(false);
    }
  }, [router, loading]);

  useEffect(() => {
    setPostState({ ...post });

    const textPost =
      post?.data.content.reduce(
        (acc: string, value) =>
          `${acc} ${value.body.map(el => el.text).join(' ')} ${value.heading}`,
        ''
      ) ?? '';
    const timeEstimed = estimatedTimeToRead(textPost);
    setTimeReadState(timeEstimed);
  }, [post]);

  /* Loading post */
  // if (router.isFallback) {
  //   return (
  //     <>
  //       <div className={styles.loading}>
  //         <span className={styles.loadingContent}>
  //           <BiLoaderAlt size={200} />
  //           <p>Carregando...</p>
  //         </span>
  //       </div>
  //     </>
  //   );
  // }

  // if (router.isFallback) {
  //   return <p>Carregando...</p>;
  // }
  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!loading) {
    return (
      <>
        <Header />
        <section className={styles.container}>
          {/* Loading post */}
          {/* {router.isFallback && (
            <>
              <div className={styles.loading}>
                <span className={styles.loadingContent}>
                  <BiLoaderAlt size={200} />
                  <p>Carregando...</p>
                </span>
              </div>
            </>
          )} */}

          {/* Post Carregado */}
          {postState && !loading && (
            <>
              <img src={post.data.banner.url} alt="banner do post" />
              <article className={styles.post}>
                <h1 className={styles.title}>Como utilizar Hooks</h1>
                <div className={styles.info}>
                  <FiCalendar size={20} />
                  <time>{formateDate(post.first_publication_date)}</time>
                  <FiUser size={20} />
                  <span>{post.data.author}</span>
                  <>
                    <BiTimeFive size={20} />
                    <span>{timeReadState}</span>
                  </>
                </div>
                {post.data.content.map((c, index) => {
                  return (
                    <div
                      className={styles.content}
                      key={`${index + 0} ${c.heading}`}
                    >
                      <h2>{c.heading}</h2>
                      <div className={styles.contentBody}>
                        {c.body.map((element, indexElement) => {
                          if (element.type === 'paragraph') {
                            return (
                              <p
                                key={`${element.type}-${element.text}-${
                                  indexElement + 0
                                }`}
                              >
                                {element.text}
                              </p>
                            );
                          }
                          if (element.type === 'list-item') {
                            return null;
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </article>
            </>
          )}
        </section>
      </>
    );
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];
  let data = null;

  try {
    // pega todos dados de postId e pega os slugs para colocar no params assim o fallback pode ficar false
    const prismic = getPrismicClient();
    data = await prismic.query(
      Prismic.predicates.at('document.type', 'posts'),
      {
        pageSize: 20,
      }
    );
    paths = data.results.map(post => ({
      params: {
        slug: post.uid,
      },
    }));
  } catch (e) {
    data = null;
  }

  if (!data || !data.results || !data.results.length) {
    paths = [];
  }

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  let post = {};
  let notFound = true;

  try {
    const prismic = getPrismicClient();
    const response = await prismic.getByUID('posts', String(slug), {});

    post = {
      uid: response.uid,
      first_publication_date: response.first_publication_date,
      data: {
        title: response.data.title,
        subtitle: response.data.subtitle,
        banner: {
          url: response.data.banner.url,
        },
        author: response.data.author,
        content: response.data.content.map(c => {
          return {
            heading: c.heading,
            body: c.body,
          };
        }),
      },
    };
    notFound = false;
  } catch (error) {
    post = {};
    notFound = true;
  }

  return {
    props: { post },
    notFound,
    revalidate: 60,
  };
};
