import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { convertAdmonitions, convertFootnotes } from './markdown-utils';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory).filter(fileName => !fileName.startsWith('_')); // Exclude files that start with '_'
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            ...matterResult.data,
        };
    });
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory).filter(fileName => !fileName.startsWith('_')); // Exclude files that start with '_'

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    // Helper converters are defined in lib/markdown-utils.js and imported above

    // Use remark to convert markdown into HTML string
    // First convert admonitions (inject HTML), then footnotes, then render
    const admonitionProcessed = convertAdmonitions(matterResult.content);
    const markdownWithFootnotes = convertFootnotes(admonitionProcessed);
    // Use `marked` to convert markdown to HTML (keeps our injected admonition/footnote HTML intact)
    const contentHtml = marked.parse(markdownWithFootnotes);

    // Combine the data with the id
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
}