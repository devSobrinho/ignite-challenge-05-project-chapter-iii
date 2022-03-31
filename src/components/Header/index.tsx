import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

function Header(): JSX.Element {
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/" passHref>
            <a>
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={172}
                height={24}
              />
            </a>
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header;
