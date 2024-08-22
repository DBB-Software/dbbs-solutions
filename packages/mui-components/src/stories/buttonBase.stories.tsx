import { Meta, StoryObj } from '@storybook/react'
import { ButtonBase, styled, Box, Typography } from '../index'

const meta: Meta<typeof ButtonBase> = {
  title: 'ButtonBase',
  component: ButtonBase,
  subcomponents: { Box, Typography },
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof ButtonBase>

export const Default: Story = {
  render: function Render() {
    const image = {
      url: 'https://github.com/shadcn.png',
      title: 'ButtonBase',
      width: '40%'
    }

    const ImageButton = styled(ButtonBase)(({ theme }) => ({
      position: 'relative',
      height: 200,
      [theme.breakpoints.down('sm')]: {
        width: '100% !important',
        height: 100
      },
      '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
          opacity: 0.15
        },
        '& .MuiImageMarked-root': {
          opacity: 0
        }
      }
    }))

    const ImageSrc = styled('span')({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%'
    })

    const Image = styled('span')(({ theme }) => ({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.white
    }))

    const ImageBackdrop = styled('span')(({ theme }) => ({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.black,
      opacity: 0.4
    }))

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
        <ImageButton
          focusRipple
          key={image.title}
          style={{
            width: image.width
          }}
        >
          <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
          <ImageBackdrop className="MuiImageBackdrop-root" />
          <Image>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              sx={{
                position: 'relative',
                p: 4,
                pt: 2,
                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`
              }}
            >
              {image.title}
            </Typography>
          </Image>
        </ImageButton>
      </Box>
    )
  }
}
