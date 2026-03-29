import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { convertAdmonitions, convertFootnotes } from './markdown-utils';

const postsDirectory = path.join(process.cwd(), 'posts');

function collectPostFiles(directory) {
    let files = [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    entries.forEach(entry => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(collectPostFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const relativeDir = path.relative(postsDirectory, directory);
            const category = relativeDir === '' ? null : relativeDir.split(path.sep)[0];
            const id = entry.name.replace(/\.md$/, '');
            files.push({ id, fullPath, category });
        }
    });

    return files;
}

export function getSortedPostsData() {
    const postFiles = collectPostFiles(postsDirectory).filter(post => !post.id.startsWith('_'));

    const allPostsData = postFiles.map(({ id, fullPath, category }) => {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id,
            category,
            ...matterResult.data,
        };
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getSortedPostsByCategory(category) {
    const postsDir = path.join(postsDirectory, category);
    if (!fs.existsSync(postsDir)) {
        return [];
    }

    let files = [];
    const entries = fs.readdirSync(postsDir, { withFileTypes: true });

    entries.forEach(entry => {
        if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
            files.push({
                id: entry.name.replace(/\.md$/, ''),
                fullPath: path.join(postsDir, entry.name),
                category,
            });
        }
    });

    const allPostsData = files.map(({ id, fullPath, category }) => {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id,
            category,
            ...matterResult.data,
        };
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getSortedPostsByCategoryWithContent(category) {
    const postsDir = path.join(postsDirectory, category);
    if (!fs.existsSync(postsDir)) {
        return [];
    }

    let files = [];
    const entries = fs.readdirSync(postsDir, { withFileTypes: true });

    entries.forEach(entry => {
        if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
            files.push({
                id: entry.name.replace(/\.md$/, ''),
                fullPath: path.join(postsDir, entry.name),
                category,
            });
        }
    });

    const allPostsData = files.map(({ id, fullPath, category }) => {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        const admonitionProcessed = convertAdmonitions(matterResult.content);
        const markdownWithFootnotes = convertFootnotes(admonitionProcessed);
        const contentHtml = marked.parse(markdownWithFootnotes);

        return {
            id,
            category,
            contentHtml,
            ...matterResult.data,
        };
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}


export function getAllPostIds() {
    const postFiles = collectPostFiles(postsDirectory).filter(post => !post.id.startsWith('_'));

    return postFiles.map(({ id }) => ({
        params: { id },
    }));
}

export async function getPostData(id) {
    const postFiles = collectPostFiles(postsDirectory);
    const postFile = postFiles.find((file) => file.id === id);

    if (!postFile) {
        throw new Error(`Post with id ${id} not found`);
    }

    const fileContents = fs.readFileSync(postFile.fullPath, 'utf8');

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