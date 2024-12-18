import { Button, Card, Typography } from '@dbbs/mui-components'
import { useState } from 'react'
import SubscribeModal from '../../modals/subscribeModal/SubscribeModal'
import { Plan } from '../../../interfaces'
import { PlanType } from '../../../enums'

interface PlanCardProps {
  data: Plan
}

const PlanCard = ({ data: { price, type, id } }: PlanCardProps) => {
  const [open, setOpen] = useState(false)
  const showTextType = type === PlanType.Recurring ? 'Recurring' : 'One time'

  const toggleModal = () => {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
          minWidth: '200px',
          minHeight: '250px'
        }}
        variant="outlined"
      >
        <Typography fontSize={'24px'} textAlign={'center'}>
          Price: ${price}
        </Typography>
        <Typography>Type: {showTextType}</Typography>
        <Button variant="contained" onClick={toggleModal}>
          Buy
        </Button>
        <Typography textAlign={'end'}>30day Trial</Typography>
      </Card>
      <SubscribeModal planId={id} open={open} handleClose={toggleModal} />
    </>
  )
}

export default PlanCard
