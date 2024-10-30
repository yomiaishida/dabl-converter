"use client";

import { useAccount, useBalance, useEnsAvatar, useEnsName } from "wagmi";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";
import Image from "next/image";
import SendEthModal from "./sendEthModal";
import SendErc20Modal from "./sendErc20Modal";

export function Account() {
  const [isMounted, setIsMounted] = useState(false);
  const { address, chain, chainId, isConnected } = useAccount();
  const accountBalance = useBalance({
    address,
  });

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName!,
    chainId: mainnet.id,
  });

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  if (!isConnected) {
    return (
      <div>
        <p className="text-lg">Not connected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center gap-y-4">
      {ensAvatar && ensName && isMounted && (
        <>
          <div className="flex items-center gap-x-2">
            <Image
              alt="ENS Avatar"
              src={ensAvatar}
              className="h-16 w-16 rounded-full"
              height={64}
              width={64}
            />
            {ensName && <span className="text-2xl">{ensName}</span>}
          </div>
        </>
      )}
      {address && isMounted && (
        <>
          <p className="text-lg">{address}</p>
        </>
      )}
      <div className="flex flex-col gap-y-2">
        {accountBalance && isMounted && (
          <p className="text-xl">
            Balance: {accountBalance.data?.decimals} ETH
          </p>
        )}
        {chain && chainId && isMounted && (
          <>
            <p className="text-lg">Chain: {chain.name}</p>
            <p className="text-lg">Chain Id: {chainId}</p>
          </>
        )}
      </div>

      <div className="flex justify-center gap-x-8">
        <div className="w-2/5">
          <SendEthModal />
        </div>
        <div className="w-2/5">
          <SendErc20Modal userAddress={address} />
        </div>
      </div>
    </div>
  );
}
