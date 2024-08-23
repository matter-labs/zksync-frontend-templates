'use client'

import { useEthereum } from './Context';

export function Account() {
  const { account } = useEthereum();
  
  return (
    <div>
      {account.address}
    </div>
  )
}
