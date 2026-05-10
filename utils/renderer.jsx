import styles from "@/styles/article.module.css";
import React from 'react';

// Helper to parse HTML properties string into a dictionary
function parseAttributes(attrsString) {
    const attrs = {};
    const attrRegex = /([a-zA-Z\-]+)\s*=\s*(?:'([^']*)'|"([^"]*)"|([^ \t\r\n\f>]+))/g;
    let match;
    
    while ((match = attrRegex.exec(attrsString)) !== null) {
        let name = match[1];
        let value = match[2] ?? match[3] ?? match[4];
        
        // Map DOM attributes to React camelCase ones
        if (name === 'class') name = 'className';
        if (name === 'colspan') name = 'colSpan';
        if (name === 'rowspan') name = 'rowSpan';
        
        attrs[name] = value;
    }
    return attrs;
}

// Ensure html entities are somewhat properly decoded
const unescapeHTML = (str) => {
    return str.replace(/&nbsp;/g, '\u00A0')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .replace(/&#39;/g, "'");
};

// Mini custom HTML to React component parser AST builder
function HTMLToReact({ html }) {
    if (!html) return null;
    
    const result = [];
    const stack = [];
    // Automatically close void elements like img, br so they don't break AST hierarchy
    const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

    // Matches tags <foo bar="baz">, </foo>, or text
    const elementRegex = /(<([^>]+)>)|([^<]+)/g;
    let match;
    let keyCounter = 0;

    while ((match = elementRegex.exec(html)) !== null) {
        if (match[1]) { 
            // It's a tag
            let innerTag = match[2].trim();
            
            if (innerTag.startsWith('/')) { 
                // Closing Tag
                let tagName = innerTag.substring(1).trim().split(/\s+/)[0].toLowerCase();
                let index = stack.length - 1;
                // Pop back to find matching parent tag
                while (index >= 0 && stack[index].type !== tagName) index--;
                
                if (index >= 0) {
                    let node = stack[index];
                    stack.length = index; // pops the matched tag and anything unclosed inside 
                    
                    let ReactElement = React.createElement(node.type, { ...node.props, key: keyCounter++ }, node.children.length > 0 ? node.children : null);
                    
                    if (stack.length > 0) stack[stack.length - 1].children.push(ReactElement);
                    else result.push(ReactElement);
                }
            } else { 
                // Opening Tag
                let parts = innerTag.match(/^([a-zA-Z0-9\-]+)(.*)$/);
                if (!parts) continue;
                
                let tagName = parts[1].toLowerCase();
                let attrsStr = parts[2] || '';
                
                let isSelfClosing = attrsStr.endsWith('/') || voidElements.has(tagName);
                if (attrsStr.endsWith('/')) attrsStr = attrsStr.slice(0, -1);
                
                let props = parseAttributes(attrsStr);
                let node = { type: tagName, props, children: [] };
                
                if (isSelfClosing) {
                    let ReactElement = React.createElement(node.type, { ...node.props, key: keyCounter++ });
                    if (stack.length > 0) stack[stack.length - 1].children.push(ReactElement);
                    else result.push(ReactElement);
                } else {
                    stack.push(node);
                }
            }
        } else if (match[3]) { 
            // Text Node
            let text = unescapeHTML(match[3]);
            if (stack.length > 0) stack[stack.length - 1].children.push(text);
            else result.push(text);
        }
    }
    
    // Flush any unclosed tags
    while (stack.length > 0) {
        let node = stack.pop();
        let ReactElement = React.createElement(node.type, { ...node.props, key: keyCounter++ }, node.children.length > 0 ? node.children : null);
        if (stack.length > 0) stack[stack.length - 1].children.push(ReactElement);
        else result.push(ReactElement);
    }

    return <>{result}</>;
}


const Renderer = ({ content }) => {
    if (!content) return null;

    // Backward compatibility for legacy articles (Array of Objects) format
    if (Array.isArray(content)) {
        return content.map((ptr, index) => {
            return ptr.selfClosing === "false" ? (
                <ptr.type
                  className={styles[ptr.className]} 
                  key={index}
                >
                  {ptr.data}
                </ptr.type>
            ) : (
                <ptr.type
                  className={styles[ptr.className]} 
                  key={index}
                />
            );
        });
    }

    // New format with proper SSR String rendering capability
    if (typeof content === "string") {
        let cleanHtml = content;
        try {
            // Check if string is double stringified JSON (usually TipTap JSON str)
            const parsed = JSON.parse(content);
            if (typeof parsed === "string") {
                cleanHtml = parsed;
            } else if (Array.isArray(parsed)) {
                return <Renderer content={parsed} />;
            }
        } catch {
           // Proceed with standard HTML parsed tree
        }

        return <HTMLToReact html={cleanHtml} />;
    }

    return null;
}

export default Renderer;