export interface RedditPost {
  kind: string
  data: {
    approved_at_utc: null | number
    subreddit: string
    selftext: string
    author_fullname: string
    saved: boolean
    mod_reason_title: null | string
    gilded: number
    clicked: boolean
    title: string
    link_flair_richtext: Array<{
      e: string
      t: string
    }>
    subreddit_name_prefixed: string
    hidden: boolean
    pwls: number
    link_flair_css_class: string
    downs: number
    top_awarded_type: null | string
    hide_score: boolean
    media_metadata: {
      [key: string]: {
        status: string
        e: string
        m: string
        p: Array<{
          y: number
          x: number
          u: string
        }>
        s: {
          y: number
          x: number
          u: string
        }
        id: string
      }
    }
    name: string
    quarantine: boolean
    link_flair_text_color: null | string
    upvote_ratio: number
    author_flair_background_color: string
    subreddit_type: string
    ups: number
    total_awards_received: number
    media_embed: { content: string; height: number; width: number } | null
    author_flair_template_id: null | string
    is_original_content: boolean
    user_reports: Array<unknown>
    secure_media: null | unknown
    is_reddit_media_domain: boolean
    is_meta: boolean
    category: null | string
    secure_media_embed: Record<string, unknown>
    link_flair_text: string
    can_mod_post: boolean
    score: number
    approved_by: null | string
    is_created_from_ads_ui: boolean
    author_premium: boolean
    thumbnail: string
    edited: boolean | number
    author_flair_css_class: string
    author_flair_richtext: Array<{
      e: string
      t: string
    }>
    gildings: Record<string, number>
    content_categories: null | string
    is_self: boolean
    mod_note: null | string
    created: number
    link_flair_type: string
    wls: number
    removed_by_category: null | string
    banned_by: null | string
    author_flair_type: string
    domain: string
    allow_live_comments: boolean
    selftext_html: null | string
    likes: null | boolean
    suggested_sort: null | string
    banned_at_utc: null | number
    view_count: null | number
    archived: boolean
    no_follow: boolean
    is_crosspostable: boolean
    pinned: boolean
    over_18: boolean
    all_awardings: Array<unknown>
    awarders: Array<unknown>
    media_only: boolean
    link_flair_template_id: null | string
    can_gild: boolean
    spoiler: boolean
    locked: boolean
    author_flair_text: string
    treatment_tags: Array<unknown>
    visited: boolean
    removed_by: null | string
    num_reports: null | number
    distinguished: null | string
    subreddit_id: string
    author_is_blocked: boolean
    mod_reason_by: null | string
    removal_reason: null | string
    link_flair_background_color: string
    id: string
    is_robot_indexable: boolean
    report_reasons: null | string
    author: string
    discussion_type: null | string
    num_comments: number
    send_replies: boolean
    whitelist_status: string
    contest_mode: boolean
    mod_reports: Array<unknown>
    author_patreon_flair: boolean
    author_flair_text_color: string
    permalink: string
    parent_whitelist_status: string
    stickied: boolean
    url: string
    subreddit_subscribers: number
    created_utc: number
    num_crossposts: number
    media?: {
      [key: string]: any
    }
    is_video: boolean
    url_overridden_by_dest?: string
    is_gallery?: boolean
  }
}

export interface RedditPostNormalized {
  urlOverriddenByDest?: string
  approvedAtUtc: null | number
  subreddit: string
  selftext: string
  authorFullname: string
  saved: boolean
  modReasonTitle: null | string
  gilded: number
  clicked: boolean
  title: string
  linkFlairRichtext: Array<{
    e: string
    t: string
  }>
  subredditNamePrefixed: string
  hidden: boolean
  pwls: number
  linkFlairCssClass: string
  downs: number
  topAwardedType: null | string
  hideScore: boolean
  mediaMetadata: {
    [key: string]: {
      status: string
      e: string
      m: string
      p: Array<{
        y: number
        x: number
        u: string
      }>
      s: {
        y: number
        x: number
        u: string
      }
      id: string
    }
  }
  name: string
  quarantine: boolean
  linkFlairTextColor: null | string
  upvoteRatio: number
  authorFlairBackgroundColor: string
  subredditType: string
  ups: number
  totalAwardsReceived: number
  mediaEmbed: { content: string; height: number; width: number } | null
  authorFlairTemplateId: null | string
  isOriginalContent: boolean
  userReports: Array<unknown>
  secureMedia?: null | unknown
  isRedditMediaDomain: boolean
  isMeta: boolean
  category: null | string
  secureMediaEmbed: Record<string, unknown>
  linkFlairText: string
  canModPost: boolean
  score: number
  approvedBy: null | string
  isCreatedFromAdsUi: boolean
  authorPremium: boolean
  thumbnail: string
  edited: boolean | number
  authorFlairCssClass: string
  authorFlairRichtext: Array<{
    e: string
    t: string
  }>
  gildings: Record<string, number>
  contentCategories: null | string
  isSelf: boolean
  modNote: null | string
  created: number
  linkFlairType: string
  wls: number
  removedByCategory: null | string
  bannedBy: null | string
  authorFlairType: string
  domain: string
  allowLiveComments: boolean
  selftextHtml: null | string
  likes: null | boolean
  suggestedSort: null | string
  bannedAtUtc: null | number
  viewCount: null | number
  archived: boolean
  noFollow: boolean
  isCrosspostable: boolean
  pinned: boolean
  over18: boolean
  allAwardings: Array<unknown>
  awarders: Array<unknown>
  mediaOnly: boolean
  linkFlairTemplateId: null | string
  canGild: boolean
  spoiler: boolean
  locked: boolean
  authorFlairText: string
  treatmentTags: Array<unknown>
  visited: boolean
  removedBy: null | string
  numReports: null | number
  distinguished: null | string
  subredditId: string
  authorIsBlocked: boolean
  modReasonBy: null | string
  removalReason: null | string
  linkFlairBackgroundColor: string
  id: string
  isRobotIndexable: boolean
  reportReasons: null | string
  author: string
  discussionType: null | string
  numComments: number
  sendReplies: boolean
  whitelistStatus: string
  contestMode: boolean
  modReports: Array<unknown>
  authorPatreonFlair: boolean
  authorFlairTextColor: string
  permalink: string
  parentWhitelistStatus: string
  stickied: boolean
  url: string
  subredditSubscribers: number
  createdUtc: number
  numCrossposts: number
  media?: {
    [key: string]: any
  }
  isVideo: boolean
  isGallery?: boolean
}

export interface RedditListResponse {
  kind: string // "Listing"
  data: RedditListResponseData
}

export interface RedditListResponseData {
  after: string // e.g., "t5_2cneq"
  dist: number // e.g., 25
  modhash: string // e.g., "jlcigr7w5562475bd3f4b2dc52541fd4980469f4f0c5b2d7f2"
  product_filter: string // e.g., ""
  children: RedditListResponseItem[]
}

export interface RedditListResponseItem {
  data: {
    user_flair_background_color: string | null // e.g., null
    submit_text_html: string | null // e.g., null
    restrict_posting: boolean // e.g., true
    user_is_banned: boolean // e.g., false
    free_form_reports: boolean // e.g., true
    wiki_enabled: boolean | null // e.g., null
    user_is_muted: boolean // e.g., false
    user_can_flair_in_sr: boolean | null // e.g., null
    display_name: string // e.g., "Home"
    header_img: string | null // e.g., null
    title: string // e.g., "Home"
    allow_galleries: boolean // e.g., true
    icon_size: number[] | null // e.g., null or [256, 256]
    primary_color: string // e.g., ""
    active_user_count: number | null // e.g., null
    icon_img: string // e.g., ""
    display_name_prefixed: string // e.g., "r/Home"
    accounts_active: number | null // e.g., null
    public_traffic: boolean // e.g., false
    subscribers: number // e.g., 248758
    user_flair_richtext: any[] // e.g., []
    videostream_links_count: number // e.g., 0
    name: string // e.g., "t5_2qs0k"
    quarantine: boolean // e.g., false
    hide_ads: boolean // e.g., false
    prediction_leaderboard_entry_type: number // e.g., 2
    emojis_enabled: boolean // e.g., false
    advertiser_category: string // e.g., ""
    public_description: string // e.g., ""
    comment_score_hide_mins: number // e.g., 0
    allow_predictions: boolean // e.g., false
    user_has_favorited: boolean // e.g., false
    user_flair_template_id: string | null // e.g., null
    community_icon: string // e.g., ""
    banner_background_image: string // e.g., ""
    original_content_tag_enabled: boolean // e.g., false
    community_reviewed: boolean // e.g., true
    submit_text: string // e.g., ""
    description_html: string // e.g., "...HTML description..."
    spoilers_enabled: boolean // e.g., true
    comment_contribution_settings: {
      allowed_media_types: string | null // e.g., null
    }
    allow_talks: boolean // e.g., false
    header_size: number | null // e.g., null
    user_flair_position: string // e.g., "right"
    all_original_content: boolean // e.g., false
    has_menu_widget: boolean // e.g., false
    is_enrolled_in_new_modmail: boolean | null // e.g., null
    key_color: string // e.g., ""
    can_assign_user_flair: boolean // e.g., true
    created: number // e.g., 1232850357
    wls: number // e.g., 6
    show_media_preview: boolean // e.g., true
    submission_type: string // e.g., "any"
    user_is_subscriber: boolean // e.g., false
    allowed_media_in_comments: any[] // e.g., []
    allow_videogifs: boolean // e.g., true
    should_archive_posts: boolean // e.g., false
    user_flair_type: string // e.g., "text"
    allow_polls: boolean // e.g., true
    collapse_deleted_comments: boolean // e.g., false
    emojis_custom_size: number | null // e.g., null
    public_description_html: string | null // e.g., null
    allow_videos: boolean // e.g., true
    is_crosspostable_subreddit: boolean // e.g., true
    suggested_comment_sort: string | null // e.g., null
    should_show_media_in_comments_setting: boolean // e.g., true
    can_assign_link_flair: boolean // e.g., true
    accounts_active_is_fuzzed: boolean // e.g., false
    allow_prediction_contributors: boolean // e.g., false
    submit_text_label: string // e.g., ""
    link_flair_position: string // e.g., "right"
    user_sr_flair_enabled: boolean | null // e.g., null
    user_flair_enabled_in_sr: boolean // e.g., false
    allow_discovery: boolean // e.g., true
    accept_followers: boolean // e.g., true
    user_sr_theme_enabled: boolean // e.g., true
    link_flair_enabled: boolean // e.g., true
    disable_contributor_requests: boolean // e.g., false
    subreddit_type: string // e.g., "public"
    notification_level: string | null // e.g., null
    banner_img: string // e.g., ""
    user_flair_text: string | null // e.g., null
    banner_background_color: string // e.g., ""
    show_media: boolean // e.g., true
    id: string // e.g., "2qs0k"
    user_is_contributor: boolean // e.g., false
    over18: boolean // e.g., false
    header_title: string // e.g., ""
    description: string // e.g., "Everything home related..."
    submit_link_label: string // e.g., ""
    user_flair_text_color: string | null // e.g., null
    restrict_commenting: boolean // e.g., false
    user_flair_css_class: string | null // e.g., null
    allow_images: boolean // e.g., true
    lang: string // e.g., "en"
    whitelist_status: string // e.g., "all_ads"
    url: string // e.g., "/r/Home/"
    created_utc: number // e.g., 1232850357
    banner_size: number | null // e.g., null
    mobile_banner_image: string // e.g., ""
    user_is_moderator: boolean // e.g., false
    allow_predictions_tournament: boolean // e.g., false
  }
  kind: string
}

export interface RedditListResponseItemNormalized {
  userFlairBackgroundColor: string | null // e.g., null
  submitTextHtml: string | null // e.g., null
  restrictPosting: boolean // e.g., true
  userIsBanned: boolean // e.g., false
  freeFormReports: boolean // e.g., true
  wikiEnabled: boolean | null // e.g., null
  userIsMuted: boolean // e.g., false
  userCanFlairInSr: boolean | null // e.g., null
  displayName: string // e.g., "Home"
  headerImg: string | null // e.g., null
  title: string // e.g., "Home"
  allowGalleries: boolean // e.g., true
  iconSize: number[] | null // e.g., null or [256, 256]
  primaryColor: string // e.g., ""
  activeUserCount: number | null // e.g., null
  iconImg: string // e.g., ""
  displayNamePrefixed: string // e.g., "r/Home"
  accountsActive: number | null // e.g., null
  publicTraffic: boolean // e.g., false
  subscribers: number // e.g., 248758
  userFlairRichtext: any[] // e.g., []
  videostreamLinksCount: number // e.g., 0
  name: string // e.g., "t5_2qs0k"
  quarantine: boolean // e.g., false
  hideAds: boolean // e.g., false
  predictionLeaderboardEntryType: number // e.g., 2
  emojisEnabled: boolean // e.g., false
  advertiserCategory: string // e.g., ""
  publicDescription: string // e.g., ""
  commentScoreHideMins: number // e.g., 0
  allowPredictions: boolean // e.g., false
  userHasFavorited: boolean // e.g., false
  userFlairTemplateId: string | null // e.g., null
  communityIcon: string // e.g., ""
  bannerBackgroundImage: string // e.g., ""
  originalContentTagEnabled: boolean // e.g., false
  communityReviewed: boolean // e.g., true
  submitText: string // e.g., ""
  descriptionHtml: string // e.g., "...HTML description..."
  spoilersEnabled: boolean // e.g., true
  commentContributionSettings: {
    allowedMediaTypes: string | null // e.g., null
  }
  allowTalks: boolean // e.g., false
  headerSize: number | null // e.g., null
  userFlairPosition: string // e.g., "right"
  allOriginalContent: boolean // e.g., false
  hasMenuWidget: boolean // e.g., false
  isEnrolledInNewModmail: boolean | null // e.g., null
  keyColor: string // e.g., ""
  canAssignUserFlair: boolean // e.g., true
  created: number // e.g., 1232850357
  wls: number // e.g., 6
  showMediaPreview: boolean // e.g., true
  submissionType: string // e.g., "any"
  userIsSubscriber: boolean // e.g., false
  allowedMediaInComments: any[] // e.g., []
  allowVideogifs: boolean // e.g., true
  shouldArchivePosts: boolean // e.g., false
  userFlairType: string // e.g., "text"
  allowPolls: boolean // e.g., true
  collapseDeletedComments: boolean // e.g., false
  emojisCustomSize: number | null // e.g., null
  publicDescriptionHtml: string | null // e.g., null
  allowVideos: boolean // e.g., true
  isCrosspostableSubreddit: boolean // e.g., true
  suggestedCommentSort: string | null // e.g., null
  shouldShowMediaInCommentsSetting: boolean // e.g., true
  canAssignLinkFlair: boolean // e.g., true
  accountsActiveIsFuzzed: boolean // e.g., false
  allowPredictionContributors: boolean // e.g., false
  submitTextLabel: string // e.g., ""
  linkFlairPosition: string // e.g., "right"
  userSrFlairEnabled: boolean | null // e.g., null
  userFlairEnabledInSr: boolean // e.g., false
  allowDiscovery: boolean // e.g., true
  acceptFollowers: boolean // e.g., true
  userSrThemeEnabled: boolean // e.g., true
  linkFlairEnabled: boolean // e.g., true
  disableContributorRequests: boolean // e.g., false
  subredditType: string // e.g., "public"
  notificationLevel: string | null // e.g., null
  bannerImg: string // e.g., ""
  userFlairText: string | null // e.g., null
  bannerBackgroundColor: string // e.g., ""
  showMedia: boolean // e.g., true
  id: string // e.g., "2qs0k"
  userIsContributor: boolean // e.g., false
  over18: boolean // e.g., false
  headerTitle: string // e.g., ""
  description: string // e.g., "Everything home related..."
  submitLinkLabel: string // e.g., ""
  userFlairTextColor: string | null // e.g., null
  restrictCommenting: boolean // e.g., false
  userFlairCssClass: string | null // e.g., null
  allowImages: boolean // e.g., true
  lang: string // e.g., "en"
  whitelistStatus: string // e.g., "all_ads"
  url: string // e.g., "/r/Home/"
  createdUtc: number // e.g., 1232850357
  bannerSize: number | null // e.g., null
  mobileBannerImage: string // e.g., ""
  userIsModerator: boolean // e.g., false
  allowPredictionsTournament: boolean // e.g., false
}
