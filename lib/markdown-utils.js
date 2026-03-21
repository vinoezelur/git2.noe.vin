import { marked } from 'marked';

// Convert simple footnote markdown ([^1]: ...) into HTML anchors
export function convertFootnotes(markdown) {
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

// Convert admonition tokens like:
// [!CAUTION]
// followed by a paragraph into a styled HTML block.
export function convertAdmonitions(markdown) {
    const lines = markdown.split('\n');
    const out = [];
    let i = 0;
    const typeMap = {
        'CAUTION': { klass: 'warning', title: 'Caution', icon: '⚠️' },
        'WARNING': { klass: 'warning', title: 'Warning', icon: '⚠️' },
        'TIP': { klass: 'tip', title: 'Tip', icon: '💡' },
        'INFO': { klass: 'info', title: 'Info', icon: 'ℹ️' },
        'ALERT': { klass: 'alert', title: 'Alert', icon: '🚨' },
        'ERROR': { klass: 'error', title: 'Error', icon: '⛔' }
    };

    while (i < lines.length) {
        const line = lines[i];
        const m = line.match(/^\s*\[!(\w+)\]\s*(.*)$/);
        if (m) {
            const key = m[1].toUpperCase();
            const meta = typeMap[key] || { klass: key.toLowerCase(), title: key, icon: 'ℹ️' };

            // collect following paragraph lines until an empty line
            i++;
            const contentLines = [];
            while (i < lines.length && lines[i].trim() !== '') {
                contentLines.push(lines[i]);
                i++;
            }

            const innerMarkdown = contentLines.join('\n');
            const innerHtml = marked.parse(innerMarkdown || '');

            const block = `\n<div class="admonition admonition-${meta.klass}">\n  <div class="admonition-inner">\n    <span class="admonition-icon">${meta.icon}</span>\n    <div class="admonition-body">\n      <div class="admonition-title">${meta.title}</div>\n      <div class="admonition-content">${innerHtml}</div>\n    </div>\n  </div>\n</div>\n`;

            out.push(block);
            // skip the blank line (if any)
            if (i < lines.length && lines[i].trim() === '') i++;
            continue;
        }
        out.push(line);
        i++;
    }

    return out.join('\n');
}
