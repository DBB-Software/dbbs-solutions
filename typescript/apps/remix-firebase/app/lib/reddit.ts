import type { RedditListResponseItem, RedditListResponseItemNormalized, RedditPost, RedditPostNormalized } from "../types/reddit";
import toCamelCase from 'lodash.camelcase'
import sanitizeHtml from 'sanitize-html';
import { load as cheerioLoad } from 'cheerio'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformSnakeCaseToCamelCaseObject = <T extends Record<string, any>, V extends Record<string, any>>(obj: T): V => {
    return Object.keys(obj).reduce((prev: V, curr: string) => {
        const newKey = toCamelCase(curr)
        const value = obj[curr]

        if (!value) return prev

        if (Array.isArray(value)) {
            return {
                ...prev,
                [newKey]: value.map(transformSnakeCaseToCamelCaseObject) 
            }
        } else if (typeof value === 'object') {
            return {
                ...prev,
                [newKey]: transformSnakeCaseToCamelCaseObject(value)
            }
        }

        return {
            ...prev,
            [newKey]: value
        }
    }, {} as V)
}

const transformPostDescription = (description?: string | null, medias: RedditPostNormalized['mediaMetadata'] = {}) => {
    if (!description) return ''

    const sanitized = cheerioLoad(sanitizeHtml(description)).text()
    const $ = cheerioLoad(sanitized)

    Object.values(medias).forEach(media => {
        const url = cheerioLoad(media.s.u).text()
        $(`a[href="${url}"]`)?.html(`<img src="${url}" class="max-h-[440px]" />`)
    })
    
    return $.html()
}

export const normalizeRedditPosts = (redditPosts: RedditPost[]): RedditPostNormalized[] => {
    return redditPosts.map((post) => transformSnakeCaseToCamelCaseObject<RedditPost['data'], RedditPostNormalized>(post.data)).map(post => {

        const transformedMediaMetadata = Object.keys(post.mediaMetadata || {}).reduce((prev, curr) => {
            const mediaValue = post.mediaMetadata[curr]
            prev[curr] = {
                ...mediaValue,
                s: {
                    ...mediaValue.s,
                    u: cheerioLoad(mediaValue.s.u).text()
                }
            }

            return prev
        }, {} as RedditPostNormalized['mediaMetadata'])

        return {
            ...post,
            mediaMetadata: transformedMediaMetadata,
            selftextHtml: transformPostDescription(post.selftextHtml, transformedMediaMetadata),
            mediaEmbed: post?.mediaEmbed?.content ? { ...post.mediaEmbed, content: cheerioLoad(post.mediaEmbed.content).text() } : null,
            linkFlairText: post?.linkFlairText ? cheerioLoad(post.linkFlairText).text() : ''
        }
    })
}

export const normalizeRedditsList = (redditsList: RedditListResponseItem[]): RedditListResponseItemNormalized[] => {
    return redditsList.map((item) => transformSnakeCaseToCamelCaseObject<RedditListResponseItem['data'], RedditListResponseItemNormalized>(item.data)).filter(i => !!i.publicDescriptionHtml).map(i => ({
        ...i,
        descriptionHtml: transformPostDescription(i.descriptionHtml),
        publicDescriptionHtml: transformPostDescription(i.publicDescriptionHtml),
    }))
}