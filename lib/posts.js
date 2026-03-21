import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

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
    // Convert simple footnote markdown ([^1]: ...) into HTML anchors
    function convertFootnotes(markdown) {
        const lines = markdown.split('\n');
        const defs = {};
        const keep = [];

        // collect single-line footnote definitions of the form: [^id]: text
        for (let i = 0; i < lines.length; i++) {
            const m = lines[i].match(/^\[\^([^\]]+)\]:\s*(.*)$/);
            if (m) {
                defs[m[1]] = m[2];
            } else {
                keep.push(lines[i]);
            }
        }

        let content = keep.join('\n');

        const ids = Object.keys(defs);
        if (ids.length === 0) return content;

        // Determine order of first appearance of footnote references
        const order = [];
        content.replace(/\[\^([^\]]+)\]/g, (match, id) => {
            if (!order.includes(id)) order.push(id);
            return match;
        });

        // replace references [^id] with superscript numeric links
        content = content.replace(/\[\^([^\]]+)\]/g, (match, id) => {
            const idx = order.indexOf(id);
            if (idx !== -1) {
                const number = idx + 1;
                return `<sup><a href="#fn:${id}" id="fnref:${id}" class="footnote-ref">${number}</a></sup>`;
            }
            return match;
        });

        // append footnotes block in order of appearance
        const footItems = order.map(id => `\n<li id="fn:${id}"> ${defs[id]} <a href="#fnref:${id}" class="footnote-backref">↩︎</a></li>`).join('\n');

        content += `\n\n<div class="footnotes">\n<hr/>\n<ol>${footItems}\n</ol>\n</div>`;
        return content;
    }

    // Use remark to convert markdown into HTML string
    const markdownWithFootnotes = convertFootnotes(matterResult.content);
    // Use `marked` to convert markdown to HTML (keeps our injected footnote HTML intact)
    const contentHtml = marked.parse(markdownWithFootnotes);

    // Combine the data with the id
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
}