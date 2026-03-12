// ─────────────────────────────────────────────────────────────────
// CMS POST LOADER
// Reads markdown files from content/posts/ (written by Decap CMS)
// and converts them into the same format as posts.js objects
// so the rest of the app works without any changes
// ─────────────────────────────────────────────────────────────────

// Vite's import.meta.glob eagerly loads all markdown files
const mdFiles = import.meta.glob('/content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// Parse frontmatter and body from a raw markdown string
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: raw }

  const frontmatterStr = match[1]
  const body = match[2].trim()
  const frontmatter = {}

  frontmatterStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key   = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (key) frontmatter[key] = value
  })

  return { frontmatter, body }
}

// Convert a markdown body string into content blocks
// that PostContent.jsx understands
function markdownToBlocks(markdown) {
  if (!markdown) return []
  const blocks = []
  const lines  = markdown.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) { i++; continue }

    // h2
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3) })
      i++; continue
    }

    // h3
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4) })
      i++; continue
    }

    // blockquote
    if (line.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: line.slice(2) })
      i++; continue
    }

    // unordered list — collect consecutive list items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''))
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    // paragraph — strip basic markdown bold/italic
    const text = line
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g,     '$1')
      .replace(/`(.+?)`/g,       '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')

    blocks.push({ type: 'p', text })
    i++
  }

  return blocks
}

// Build a post object from a raw markdown file
function buildPost(raw, filename) {
  const { frontmatter, body } = parseFrontmatter(raw)

  const slug = frontmatter.slug
    || filename.replace(/^.*\//, '').replace(/\.md$/, '')

  return {
    slug,
    title:    frontmatter.title    || 'Untitled',
    date:     frontmatter.date     || '2026-01-01',
    tag:      frontmatter.tag      || 'Solar',
    tagColor: frontmatter.tagColor || 'solar',
    readTime: frontmatter.readTime || '5 min',
    image:    frontmatter.image    || null,
    excerpt:  frontmatter.excerpt  || '',
    content:  markdownToBlocks(body),
    _fromCMS: true,
  }
}

// Export all CMS posts as an array, sorted newest first
export function getCMSPosts() {
  return Object.entries(mdFiles)
    .map(([filename, raw]) => buildPost(raw, filename))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}
