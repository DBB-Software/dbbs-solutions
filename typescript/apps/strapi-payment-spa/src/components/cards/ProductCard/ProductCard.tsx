import { Button, Card, Typography } from '@dbbs/mui-components'
import { Subscription, Products } from '../../../interfaces'

interface ProductCardProps {
  data: Products
  buttonHandler: (id: Subscription['id']) => void
}

const ProductCard = ({ data: { name, id }, buttonHandler }: ProductCardProps) => {
  const nameSubscription = name.length > 20 ? `${name.slice(0, 20)}...` : name

  const handleClick = () => buttonHandler(id)

  return (
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
      <Typography textAlign={'center'} variant="h4">
        {nameSubscription}
      </Typography>

      <Button variant="contained" onClick={handleClick}>
        Show plans
      </Button>
    </Card>
  )
}

export default ProductCard
