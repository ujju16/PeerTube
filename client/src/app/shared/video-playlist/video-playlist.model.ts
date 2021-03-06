import {
  VideoChannelSummary,
  VideoConstant,
  VideoPlaylist as ServerVideoPlaylist,
  VideoPlaylistPrivacy,
  VideoPlaylistType
} from '../../../../../shared/models/videos'
import { AccountSummary, peertubeTranslate } from '@shared/models'
import { Actor } from '@app/shared/actor/actor.model'
import { getAbsoluteAPIUrl } from '@app/shared/misc/utils'

export class VideoPlaylist implements ServerVideoPlaylist {
  id: number
  uuid: string
  isLocal: boolean

  displayName: string
  description: string
  privacy: VideoConstant<VideoPlaylistPrivacy>

  thumbnailPath: string

  videosLength: number

  type: VideoConstant<VideoPlaylistType>

  createdAt: Date | string
  updatedAt: Date | string

  ownerAccount: AccountSummary
  videoChannel?: VideoChannelSummary

  thumbnailUrl: string

  ownerBy: string
  ownerAvatarUrl: string

  videoChannelBy?: string
  videoChannelAvatarUrl?: string

  private thumbnailVersion: number
  private originThumbnailUrl: string

  constructor (hash: ServerVideoPlaylist, translations: {}) {
    const absoluteAPIUrl = getAbsoluteAPIUrl()

    this.id = hash.id
    this.uuid = hash.uuid
    this.isLocal = hash.isLocal

    this.displayName = hash.displayName

    this.description = hash.description
    this.privacy = hash.privacy

    this.thumbnailPath = hash.thumbnailPath

    if (this.thumbnailPath) {
      this.thumbnailUrl = absoluteAPIUrl + hash.thumbnailPath
      this.originThumbnailUrl = this.thumbnailUrl
    } else {
      this.thumbnailUrl = window.location.origin + '/client/assets/images/default-playlist.jpg'
    }

    this.videosLength = hash.videosLength

    this.type = hash.type

    this.createdAt = new Date(hash.createdAt)
    this.updatedAt = new Date(hash.updatedAt)

    this.ownerAccount = hash.ownerAccount
    this.ownerBy = Actor.CREATE_BY_STRING(hash.ownerAccount.name, hash.ownerAccount.host)
    this.ownerAvatarUrl = Actor.GET_ACTOR_AVATAR_URL(this.ownerAccount)

    if (hash.videoChannel) {
      this.videoChannel = hash.videoChannel
      this.videoChannelBy = Actor.CREATE_BY_STRING(hash.videoChannel.name, hash.videoChannel.host)
      this.videoChannelAvatarUrl = Actor.GET_ACTOR_AVATAR_URL(this.videoChannel)
    }

    this.privacy.label = peertubeTranslate(this.privacy.label, translations)

    if (this.type.id === VideoPlaylistType.WATCH_LATER) {
      this.displayName = peertubeTranslate(this.displayName, translations)
    }
  }

  refreshThumbnail () {
    if (!this.originThumbnailUrl) return

    if (!this.thumbnailVersion) this.thumbnailVersion = 0
    this.thumbnailVersion++

    this.thumbnailUrl = this.originThumbnailUrl + '?v' + this.thumbnailVersion
  }
}
