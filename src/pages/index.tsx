import Prismic from '@prismicio/client';
import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Image from 'next/image';

import { getPrismicClient } from '../services/prismic';
import { PostExcerpt } from '../components/PostExcerpt';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formateDate } from '../utils/formatDate';
import { loadPosts } from '../services/api';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;
  const [nextPostState, setNextPostState] = useState(next_page);
  const [isNextPost, setIsNextPost] = useState(!!nextPostState);
  const [posts, setPosts] = useState<Post[]>([]);

  // Hook que controla o button "carregar mais"
  useEffect(() => {
    if (!nextPostState) {
      setIsNextPost(false);
    }
    if (nextPostState) {
      setIsNextPost(true);
    }
  }, [nextPostState]);

  // console.log('postsPagination', results);

  // Hook que controla os posts da page
  useEffect(() => {
    setPosts([...results]);
  }, [results]);

  const handleClick = async (): Promise<void> => {
    const response = await loadPosts(nextPostState);
    setPosts(prevState => [
      ...prevState,
      {
        uid: response.results[0].uid,
        data: {
          title: response.results[0].data.title,
          author: response.results[0].data.author,
          subtitle: response.results[0].data.subtitle,
        },
        first_publication_date: formateDate(
          response.results[0].first_publication_date
        ),
      },
    ]);
    setNextPostState(response.next_page);
  };

  if (!postsPagination) {
    return <h1>aqq</h1>;
  }

  return (
    <>
      <header className={commonStyles.container}>
        <div className={styles.header}>
          <a href="#home">
            <Image src="/images/logo.svg" alt="logo" width={172} height={24} />
          </a>
        </div>
      </header>
      <main className={commonStyles.container}>
        {posts.map(post => {
          return (
            <article className={styles.post} key={post.uid}>
              <PostExcerpt
                post={{
                  uid: post.uid,
                  data: post.data,
                  updatedAt: formateDate(post.first_publication_date),
                }}
              />
            </article>
          );
        })}
        {isNextPost && (
          <div className={styles.loadingPosts}>
            <button
              type="button"
              onClick={handleClick}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  console.log('keyPress', e.key);
                }
              }}
            >
              Carregar mais posts
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  let postsPagination = {};
  let notFound = false;
  try {
    const responsePosts = await prismic.query(
      Prismic.predicates.at('document.type', 'posts'),
      {
        pageSize: 1,
      }
    );

    postsPagination = {
      next_page: responsePosts.next_page,
      results: responsePosts.results.map(result => {
        return {
          uid: result.uid,
          first_publication_date: result.first_publication_date,
          data: {
            title: result.data.title,
            subtitle: result.data.subtitle,
            author: result.data.author,
          },
        };
      }),
    };
  } catch (error) {
    postsPagination = {};
    notFound = true;
  }

  return {
    props: {
      postsPagination,
    },
    notFound: false,
  };
};
