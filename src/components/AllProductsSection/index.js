import { Component } from 'react'
import { ThreeDots } from 'react-loader-spinner' // Updated import
import Cookies from 'js-cookie'

import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import './index.css'

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    isLoading: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  updateActiveOptionId = activeOptionId => {
    this.setState(
      {
        activeOptionId,
      },
      this.getProducts,
    )
  }

  getProducts = async () => {
    const { activeOptionId } = this.state
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    }
  }

  renderProductsList = () => {
    const { productsList, activeOptionId } = this.state
    return (
      <>
        <ProductsHeader
          sortbyOptions={sortbyOptions}
          activeOptionId={activeOptionId}
          updateActiveOptionId={this.updateActiveOptionId}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <ThreeDots color="#0b69ff" height={50} width={50} /> {/* Updated usage */}
    </div>
  )

  render() {
    const { isLoading } = this.state
    return isLoading ? this.renderLoader() : this.renderProductsList()
  }
}

export default AllProductsSection
