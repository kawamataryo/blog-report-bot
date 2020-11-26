export interface NoteUser {
  id: number;
  name: string;
  urlname: string;
  nickname: string;
  userProfileImagePath: string;
  customDomain?: any;
  disableSupport: boolean;
  likeAppealText: string;
  likeAppealImage?: any;
  purchaseAppealTextNote?: any;
  twitterNickname: string;
}

export interface NoteContent {
  id: number;
  type: string;
  status: string;
  name: string;
  description?: any;
  price: number;
  key: string;
  slug: string;
  publishAt: string;
  thumbnailExternalUrl: string;
  eyecatch: string;
  user: NoteUser;
  canRead: boolean;
  isAuthor: boolean;
  externalUrl?: any;
  customDomain?: any;
  body: string;
  isLimited: boolean;
  isTrial: boolean;
  canUpdate: boolean;
  tweetText: string;
  isRefund: boolean;
  commentCount: number;
  likes: any[];
  likeCount: number;
  anonymousLikeCount: number;
  isLiked: boolean;
  disableComment: boolean;
  twitterShareUrl: string;
  facebookShareUrl: string;
  pictures: any[];
  limitedMessage?: any;
  priorSale?: any;
  canMultipleLimitedNote: boolean;
  hasEmbeddedContent: boolean;
  isPinned: boolean;
  pinnedUserNoteId?: number;
  isTreasuredNote: boolean;
  spEyecatch: string;
  enableBacktoDraft: boolean;
  notificationMessages: any[];
  isProfiled: boolean;
  isForWork: boolean;
  isCircleDescription: boolean;
  noteDraft?: any;
  url: string;
}

export interface NoteContentsResponseData {
  contents: NoteContent[];
  isLastPage: boolean;
  totalCount: number;
}

export interface NoteContentsResponse {
  data: NoteContentsResponseData;
}

export interface NoteUserResponseData {
  id: number;
  nickname: string;
  urlname: string;
  profile: string;
  noteCount: number;
  magazineCount: number;
  followingCount: number;
  followerCount: number;
  isFollowing: boolean;
  isFollowed: boolean;
  isMyself: boolean;
  originalHeaderImageUrl: string;
  headerImageUrl: string;
  headerImageKey: string;
  profileImageUrl: string;
  profileImageKey: string;
  isBlocked: boolean;
  isAdmin: boolean;
  isOfficial: boolean;
  showFollowCount: boolean;
  disableSupport: boolean;
  hasStore: boolean;
  hasCircle: boolean;
  customDomain?: any;
  followAppealText?: any;
  isCreatorLikesTabEnabled: boolean;
  isCreatorMagazinesTabEnabled: boolean;
  isCreatorCirclesTabEnabled: boolean;
  isCreatorArchivesTabEnabled: boolean;
  isCreatorProfileTabEnabled: boolean;
  isCreatorJobOfferTabEnabled: boolean;
  isCreatorFollowNumberDisplayed: boolean;
  style: string;
  proUserId?: any;
  tlMagazines: any[];
  isMedia: boolean;
}

export interface NoteUserResponse {
  data: NoteUserResponseData;
}
