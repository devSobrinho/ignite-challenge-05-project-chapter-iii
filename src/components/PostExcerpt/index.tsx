import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import styles from './post.module.scss';

type PostExcerptProps = {
  post: {
    uid: string;
    updatedAt: string;
    data: {
      title: string;
      subtitle: string;
      author: string;
    };
  };
};

export const PostExcerpt = ({ post }: PostExcerptProps): JSX.Element => {
  return (
    <Link key={post.uid} href={`/post/${post.uid}`} passHref>
      <a>
        <h1 className={styles.title}>{post.data.title}</h1>
        <p className={styles.subtitle}>{post.data.subtitle}</p>
        <div className={styles.info}>
          <FiCalendar size={20} />
          <time>{post.updatedAt}</time>
          <FiUser size={20} />
          <span>{post.data.author}</span>
        </div>
      </a>
    </Link>
  );
};
