import { useMemo } from 'react'
import {
  Badge,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  Card,
  CardContent,
  CardTitle,
  CardHeader
} from '@dbbs/tailwind-components'

import type { RedditPostNormalized } from '../../types/reddit'

export const RedditPost = ({ post }: { post: RedditPostNormalized }) => {
  const maxAssetWidth = useMemo(
    () => Math.max(...Object.values(post.mediaMetadata ?? {}).map((m) => m.s.x)),
    [post.mediaMetadata]
  )
  return (
    <Card className="mb-4">
      <CardHeader>
        <div>
          <span className="mr-2">{post.author}</span>
          {post.authorFlairText && (
            <Badge className="border-black bg-transparent text-black hover:text-white">{post.authorFlairText}</Badge>
          )}
        </div>
        <CardTitle dangerouslySetInnerHTML={{ __html: post.title }} />
        {post.linkFlairText && (
          <Badge
            className="w-[max-content] cursor-default"
            style={{ backgroundColor: post.linkFlairBackgroundColor, color: post.linkFlairTextColor || undefined }}
          >
            {post.linkFlairText}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {post.isGallery ? (
          <Carousel style={{ maxWidth: maxAssetWidth }} className="ml-10 max-h-[440px]" opts={{ loop: true }}>
            <CarouselContent>
              {Object.values(post.mediaMetadata).map((m) => (
                <CarouselItem key={m.s.u}>
                  <img className="object-cover w-[100%] h-[100%] max-h-[440px]" src={m.s.u} alt="gallery_photo" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <>
            {post.selftextHtml && <div dangerouslySetInnerHTML={{ __html: post.selftextHtml }} />}
            {post.urlOverriddenByDest && !post.mediaEmbed?.content && !post.media && (
              <img src={post.urlOverriddenByDest} className="max-h-[440px]" alt="post_image" />
            )}
            {post.mediaEmbed?.content && <div dangerouslySetInnerHTML={{ __html: post.mediaEmbed.content }} />}
            {post.media?.redditVideo && (
              <video
                src={post.media.redditVideo.fallbackUrl}
                loop
                autoPlay
                controls
                style={{ width: post.media.redditVideo.width, height: post.media.redditVideo.height }}
              >
                <track kind="captions" src="" label="English" />
              </video>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default { RedditPost }
