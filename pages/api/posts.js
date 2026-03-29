import { getSortedPostsData, getSortedPostsByCategory } from '../../lib/posts';

export default function handler(req, res) {
    try {
        const category = req.query.category;

        let allPostsData;
        if (category) {
            allPostsData = getSortedPostsByCategory(category);
        } else {
            allPostsData = getSortedPostsData();
        }

        res.status(200).json(allPostsData);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}
