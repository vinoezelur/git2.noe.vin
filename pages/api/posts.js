import { getSortedPostsData } from '../../lib/posts';

export default function handler(req, res) {
    try {
        const allPostsData = getSortedPostsData();
        res.status(200).json(allPostsData);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}
