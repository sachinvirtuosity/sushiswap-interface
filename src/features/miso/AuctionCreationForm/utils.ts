import { AddressZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, JSBI, Price, Token } from '@sushiswap/core-sdk'
import {
  AuctionCreationFormInputFormatted,
  AuctionCreationFormInputValidated,
} from 'app/features/miso/AuctionCreationForm/index'

export const getPriceEntity = (price: string, auctionToken: Token, paymentToken: Currency) => {
  const base = CurrencyAmount.fromRawAmount(
    paymentToken,
    JSBI.BigInt(parseUnits(price, paymentToken.decimals).toString())
  )
  const quote = CurrencyAmount.fromRawAmount(auctionToken, '1')
  return new Price({ baseAmount: quote, quoteAmount: base })
}

export const formatCreationFormData = (
  data: AuctionCreationFormInputValidated,
  auctionToken: Token,
  paymentCurrency: Currency,
  account: string
): AuctionCreationFormInputFormatted => {
  const { token, paymentCurrencyAddress, startDate, endDate, operator, pointListAddress, ...rest } = data

  return {
    ...rest,
    operator: operator || account,
    pointListAddress: pointListAddress || AddressZero,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    auctionToken,
    paymentCurrency,
    tokenAmount: CurrencyAmount.fromRawAmount(
      auctionToken,
      JSBI.BigInt(parseUnits(data.tokenAmount.toString(), auctionToken.decimals).toString())
    ),
    startPrice: data.startPrice ? getPriceEntity(data.startPrice.toString(), auctionToken, paymentCurrency) : undefined,
    endPrice: data.endPrice ? getPriceEntity(data.endPrice.toString(), auctionToken, paymentCurrency) : undefined,
    minimumPrice: data.minimumPrice
      ? getPriceEntity(data.minimumPrice.toString(), auctionToken, paymentCurrency)
      : undefined,
    fixedPrice: data.fixedPrice ? getPriceEntity(data.fixedPrice.toString(), auctionToken, paymentCurrency) : undefined,
  }
}
