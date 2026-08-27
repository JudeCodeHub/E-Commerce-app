'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import Loading from './Loading'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 5
    const products = useSelector(state => state.product.list )
    const loading = useSelector(state => state.product.loading)

    return (
        <div className='px-6 my-30 max-w-[1600px] mx-auto'>
            <Title title='Best Selling' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            {loading ? (
                <Loading fullScreen={false} />
            ) : (
                <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap justify-center gap-6'>
                    {products.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default BestSelling