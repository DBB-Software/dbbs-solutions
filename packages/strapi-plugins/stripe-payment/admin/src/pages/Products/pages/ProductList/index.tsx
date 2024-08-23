import React, { useState, useEffect } from 'react'
import { request, useNotification } from '@strapi/helper-plugin'
import { Button } from '@strapi/design-system/Button'
import { Box } from '@strapi/design-system/Box'
import { Flex } from '@strapi/design-system/Flex'
import { Table, Thead, Tbody, Tr, Th, Td } from '@strapi/design-system/Table'
import { Typography } from '@strapi/design-system/Typography'
import { IconButton } from '@strapi/design-system/IconButton'
import Trash from '@strapi/icons/Trash'
import Pencil from '@strapi/icons/Pencil'
import Plus from '@strapi/icons/Plus'
import { useHistory } from 'react-router-dom'

import AddProductModal from '../../../../components/modals/AddProductModal'
import DeleteConfirmModal from '../../../../components/modals/DeleteConfirmModal'
import { Product } from '../../../../types'

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const history = useHistory()
  const toggleNotification = useNotification()

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await request('/stripe-payment/admin/products', { method: 'GET' })
      setProducts(data)
    }

    fetchProducts()
  }, [])

  const handleAddProduct = () => {
    setShowAddModal(true)
  }

  const handleSaveProduct = async () => {
    const newProduct = await request('/stripe-payment/admin/products', {
      method: 'POST',
      body: { name: newProductName }
    })
    setProducts((prevProducts) => [...prevProducts, newProduct])
    setShowAddModal(false)
    setNewProductName('')
    toggleNotification({
      type: 'success',
      message: 'Product added successfully'
    })
  }

  const handleDeleteProduct = async () => {
    if (deleteProductId) {
      await request(`/stripe-payment/admin/products/${deleteProductId}`, { method: 'DELETE' })
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== deleteProductId))
      setShowDeleteConfirm(false)
      setDeleteProductId(null)
      toggleNotification({
        type: 'success',
        message: 'Product deleted successfully'
      })
    }
  }

  const handleViewProduct = (id: string) => {
    history.push(`/settings/stripe-payment/products/${id}`)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
  }

  const handleShowDeleteConfirm = (id: string) => {
    setDeleteProductId(id)
    setShowDeleteConfirm(true)
  }

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <Box padding={8}>
      <Flex justifyContent="space-between">
        <Box>
          <Typography variant="beta" as="h1">
            Products
          </Typography>
          <Typography variant="omega" textColor="neutral600">
            List of products
          </Typography>
        </Box>
        <Button onClick={handleAddProduct} startIcon={<Plus />}>
          Add New Product
        </Button>
      </Flex>

      <Box marginTop={8}>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Name</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Actions</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product: Product) => (
              <Tr key={product.id}>
                <Td>
                  <Typography textColor="neutral800" onClick={() => handleViewProduct(product.id)}>
                    {product.name}
                  </Typography>
                </Td>
                <Td>
                  <Flex>
                    <IconButton onClick={() => handleViewProduct(product.id)} label="Edit" icon={<Pencil />} noBorder />
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => handleShowDeleteConfirm(product.id)}
                        label="Delete"
                        icon={<Trash />}
                        noBorder
                      />
                    </Box>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <AddProductModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        productName={newProductName}
        setProductName={setNewProductName}
        onSave={handleSaveProduct}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteProduct}
      />
    </Box>
  )
}

export default ProductList
