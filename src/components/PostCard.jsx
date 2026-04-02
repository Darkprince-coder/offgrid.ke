import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDate } from '../data/posts'
import styles from '../styles/PostCard.module.css'

const topicImages = {
  solar: [
    '/images/welcome-to-offgrid.jpg',
    '/images/lead-lithium.jpg',
    '/images/3-bedroom-solar.jpg',
    '/images/how-many-solars.jpg',
  ],
  water: [
    '/images/rainwater-harvesting.jpg',
    '/images/water-tanks.jpg',
  ],
  security: [
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80',
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80',
  ],
  how: [
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  ],
}

const fallbackGradients = {
  solar:    'linear-gradient(135deg,#1a2e1a,#2c5f2e,#d4721a)',
  water:    'linear-gradient(135deg,#0d2535,#1d5c7a,#0e4a5e)',
  security: 'linear-gradient(135deg,#1a0d00,#3d1515,#7a2222)',
  how:      'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
}

const tagClass = {
  solar:    'tag-solar',
  water:    'tag-water',
  how:      'tag-how',
  security: 'tag-security',
}

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function PostCard({ post, index = 0 }) {
  const [imgError, setImgError] = useState(false)

  const images   = topicImages[post.tagColor] || topicImages.how
  const imgUrl   = post.image || images[index % images.length]
  const fallback = fallbackGradients[post.tagColor] || fallbackGradients.how

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <Link to={`/posts/${post.slug}`} className={styles.card}>

        {/* Image strip */}
        <div className={styles.imageWrap} style={{ background: fallback }}>
          {!imgError && (
            <img
              src={imgUrl}
              alt={`${post.title} — offgrid.ke`}
              loading="lazy"
              onError={() => setImgError(true)}
              className={styles.image}
            />
          )}
          <div className={styles.imageOverlay} />
          <span className={styles.tagBadge}>{post.tag}</span>
          <span className={styles.readTimeBadge}>{post.readTime}</span>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <span className={`tag ${tagClass[post.tagColor] || 'tag-how'} ${styles.tagPill}`}>
            {post.tag}
          </span>

          <h3 className={styles.title}>{post.title}</h3>

          {post.excerpt && (
            <p className={styles.excerpt}>{post.excerpt}</p>
          )}

          <div className={styles.meta}>
            <span>{post.tag}</span>
            <span className={styles.metaDot} />
            <span>{post.readTime} read</span>
            {post.date && (
              <>
                <span className={styles.metaDot} />
                <span>{formatDate(post.date)}</span>
              </>
            )}
          </div>

          <span className={styles.cta}>Read Guide →</span>
        </div>
      </Link>
    </motion.div>
  )
}
