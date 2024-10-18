import {
  ImageList as MUIImageList,
  ImageListItem as MUIImageListItem,
  ImageListItemBar as MUIImageListItemBar,
  ImageListProps,
  ImageListItemProps,
  ImageListItemBarProps
} from '@mui/material'

const ImageList = (props: ImageListProps) => <MUIImageList {...props} />

const ImageListItem = (props: ImageListItemProps) => <MUIImageListItem {...props} />

const ImageListItemBar = (props: ImageListItemBarProps) => <MUIImageListItemBar {...props} />

export { ImageList, ImageListItem, ImageListItemBar }
