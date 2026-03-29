import Layout from '../../components/layout';
import Head from 'next/head';
import { getSortedPostsByCategoryWithContent } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
import Date from '../../components/date';

export async function getStaticProps() {
    const posts = getSortedPostsByCategoryWithContent('pics');
    return {
        props: {
            posts,
        },
    };
}

export default function PicsPage({ posts }) {
    return (
        <Layout category="pics">
            <Head>
                <title>Pics | vinoe</title>
            </Head>
            <div>
                {posts.length === 0 ? (
                    <p>No pics found.</p>
                ) : (
                    posts.map(({ id, title, date, contentHtml }) => (
                        <article key={id} id={id} style={{ marginBottom: '3rem', scrollMarginTop: '80px' }}>
                            <h2 className={utilStyles.headingLg}>{title}</h2>
                            <div className={utilStyles.lightText}>
                                <Date dateString={date} />
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                            <hr className={utilStyles.borderLine} />
                        </article>
                    ))
                )}
            </div>
        </Layout>
    );
}
