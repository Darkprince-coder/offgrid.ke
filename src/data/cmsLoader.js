// ─────────────────────────────────────────────────────────────────
// CMS POST LOADER
// Reads markdown files from content/posts/ (written by Decap CMS)
// and converts them into the same format as posts.js objects
// ─────────────────────────────────────────────────────────────────

const mdFiles = import.meta.glob('/content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// Parse frontmatter and body from a raw markdown string
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: raw }

  const frontmatterStr = match[1]
  const body = match[2].trim()
  const frontmatter = {}

  frontmatterStr.split(/\r?\n/).forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key   = line.slice(0, colonIdx).trim()
    let   value = line.slice(colonIdx + 1).trim()
    // Strip surrounding quotes
    value = value.replace(/^["']|["']$/g, '')
    if (key) frontmatter[key] = value
  })

  return { frontmatter, body }
}

// Convert markdown body to content blocks for PostContent.jsx
function markdownToBlocks(markdown) {
  if (!markdown) return []
  const blocks = []
  const lines  = markdown.split(/\r?\n/)
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) { i++; continue }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3) })
      i++; continue
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4) })
      i++; continue
    }

    if (line.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: line.slice(2) })
      i++; continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''))
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    // Paragraph — strip markdown formatting
    const text = line
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g,     '$1')
      .replace(/`(.+?)`/g,       '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')

    if (text) blocks.push({ type: 'p', text })
    i++
  }

  return blocks
}

// Build a post object from a raw markdown file
function buildPost(raw, filename) {
  const { frontmatter, body } = parseFrontmatter(raw)

  const slug = frontmatter.slug
    || filename.replace(/^.*\//, '').replace(/\.md$/, '')

  // Handle image — Decap CMS saves as /images/filename.jpg
  // Empty string or missing means no image
  const rawImage = (frontmatter.image || '').trim()
  const image    = rawImage.length > 0 ? rawImage : null

  return {
    slug,
    title:    frontmatter.title    || 'Untitled',
    date:     frontmatter.date     || '2026-01-01',
    tag:      frontmatter.tag      || 'Solar',
    tagColor: frontmatter.tagColor || 'solar',
    readTime: frontmatter.readTime || '5 min',
    image,
    excerpt:  frontmatter.excerpt  || '',
    content:  markdownToBlocks(body),
    _fromCMS: true,
  }
}

// Export all CMS posts sorted newest first
export function getCMSPosts() {
  return Object.entries(mdFiles)
    .map(([filename, raw]) => buildPost(raw, filename))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}