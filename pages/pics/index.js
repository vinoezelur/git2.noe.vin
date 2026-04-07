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
                    posts.map(({ id, title, date, contentHtml, url, caption }, index) => (
                        <article key={id} id={id} className={utilStyles.picsArticle}>
                            <div className={`${utilStyles.picsFlexContainer} ${index % 2 === 1 ? utilStyles.even : ''}`}>
                                <div className={utilStyles.picsImageContainer}>
                                    <img src={url} alt={title} className={utilStyles.picsImage} />
                                    <div className={utilStyles.picsDate}>
                                        <Date dateString={date} />
                                    </div>
                                    <div className={utilStyles.picsCaption}>
                                        <p>{caption}</p>
                                    </div>
                                </div>
                                <div className={utilStyles.picsContent} dangerouslySetInnerHTML={{ __html: contentHtml }} />
                            </div>
                            <hr className={utilStyles.borderLine} />
                        </article>
                    ))
                )}
            </div>
        </Layout>
    );
}
