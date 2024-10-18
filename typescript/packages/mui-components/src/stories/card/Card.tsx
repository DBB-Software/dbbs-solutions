import {
  Card as MUICard,
  CardProps,
  CardContent as MUICardContent,
  CardContentProps,
  CardActions as MUICardAction,
  CardActionsProps,
  CardMedia as MUICardMedia,
  CardMediaProps,
  CardHeader as MUICardHeader,
  CardHeaderProps,
  CardActionArea as MUICardActionArea,
  CardActionAreaProps
} from '../..'

const Card = (props: CardProps) => <MUICard {...props} />

const CardContent = (props: CardContentProps) => <MUICardContent {...props} />

const CardActions = (props: CardActionsProps) => <MUICardAction {...props} />

const CardMedia = (props: CardMediaProps) => <MUICardMedia {...props} />

const CardHeader = (props: CardHeaderProps) => <MUICardHeader {...props} />

const CardActionArea = (props: CardActionAreaProps) => <MUICardActionArea {...props} />

export { Card, CardContent, CardActions, CardMedia, CardHeader, CardActionArea }
