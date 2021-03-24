import * as React from 'react';
import type { GetStaticPropsContext } from 'next'
import dynamic from 'next/dynamic';
import { getConfig } from '@bigcommerce/storefront-data-hooks/api'
import getAllPages from '@bigcommerce/storefront-data-hooks/api/operations/get-all-pages'
import { embedCheckout } from '@bigcommerce/checkout-sdk';
import useCart from '@bigcommerce/storefront-data-hooks/cart/use-cart'
import {nanoid} from 'nanoid';

import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { Bag } from '@components/icons'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })
  const { pages } = await getAllPages({ config, preview })
  return {
    props: { pages },
  }
}

function Embedded() {

}

export default function Checkout() {
  const { data } = useCart();
  const [checkoutLoaded, setCheckoutLoaded] = React.useState(false);

  const containerId = "checkout";
  // console.log('data', data)
  React.useEffect(() => {
      const handleEmbed = async () => {
          const resp1 = await fetch('/api/bigcommerce/checkout')
          const resp = await resp1.json()
          const url = resp?.embedded_checkout_url;
          // console.log('url', url, resp)

          try {
              await embedCheckout({
                  containerId,
                  url,
                  onError: (err) => console.error('error', err),
                  onFrameError: (err) => console.error('fram', err),
                  onComplete: (ev) => console.log('complee', ev),
                  onLoad: (ev) => console.log('load', ev),
              });
              setCheckoutLoaded(true);
          } catch (err) {
              console.error(err);
          }
      };

      if (data && !checkoutLoaded) handleEmbed();
  }, [data]);
  return (
    <Container>
      <Text variant="pageHeading">Checkout</Text>
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          No Checkout found
        </h2>
        <p className="text-accents-6 px-10 text-center pt-2">
          Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
        </p>
      </div>
      <div id={containerId} />
    </Container>
  )
}

Checkout.Layout = Layout
