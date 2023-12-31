'use client'
import Button from '@/components/ui/Button'
import Currency from '@/components/ui/currency'
import useCart from '@/hooks/use-cart'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { FC, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface SummaryProps {}

const Summary: FC<SummaryProps> = ({}) => {
  const searchParams = useSearchParams()
  const items = useCart(state => state.items)
  const removeAll = useCart(state => state.removeAll)

  const cartTotal = items.reduce((sum, item) => Number(item.price) + sum, 0)

  const onCheckOut = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      { productIds: [...items.map(item => item.id)] }
    )
    window.location = response.data.url
  }

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment Completed')
      removeAll()
    }

    if (searchParams.get('cancelled')) {
      toast.error("Something Went Wrong, payment wasn't successful")
    }
  }, [searchParams, removeAll])

  return (
    <div
      className="mt-16
  rounded-lg
  bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order Total</div>
          <Currency value={cartTotal} />
        </div>
      </div>
      <Button
        disabled={items.length <= 0}
        onClick={onCheckOut}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  )
}

export default Summary
