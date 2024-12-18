import { Button, Card, Typography } from '@dbbs/mui-components'
import { useState } from 'react'
import PaymentModal from '../../modals/paymentModal/PaymentModal'

interface PurchesesCardProps {
  orhanizatioName: string
  planId: number
  price: number
}

const PurcheseCard = ({ orhanizatioName, planId, price }: PurchesesCardProps) => {
  const [open, setOpen] = useState(false)

  const nameOrganization = orhanizatioName.length > 20 ? `${orhanizatioName.slice(0, 20)}...` : orhanizatioName

  const toggleModal = () => {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <Card
        sx={{
          justifyContent: 'space-around',
          minHeight: '300px',
          minWidth: '200px',
          padding: '30px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography fontSize={'24px'} textAlign={'center'}>
          {nameOrganization}
        </Typography>
        <Typography>Price: ${price}</Typography>
        <Button variant="contained" onClick={toggleModal}>
          Buy
        </Button>
      </Card>
      <PaymentModal planId={planId} open={open} handleClose={toggleModal} />
    </>
  )
}

export default PurcheseCard
