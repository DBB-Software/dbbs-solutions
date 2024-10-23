import { Avatar as MUIAvatar, AvatarProps, AvatarGroup as MUIAvatarGroup, AvatarGroupProps } from '@mui/material'

const Avatar = (props: AvatarProps) => <MUIAvatar {...props} />

const AvatarGroup = (props: AvatarGroupProps) => <MUIAvatarGroup {...props} />

export { Avatar, AvatarGroup }
