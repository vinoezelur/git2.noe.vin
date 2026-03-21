import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getPostData } from '../lib/posts';

export async function getStaticProps() {
  const postData = await getPostData('_about');
  return {
    props: { postData },
  };
}

export default function Home({ postData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </section>
    </Layout>
  );
}
