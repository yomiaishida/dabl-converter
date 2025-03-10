"use client";

import { useEffect, useState } from "react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatEther } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import BootcampTokenABI from "@/lib/contracts/BootcampTokenABI";
import { toast } from "react-toastify";

type SendErc20ModalProps = {
  userAddress: `0x${string}` | undefined;
};

export default function SendErc20Modal({ userAddress }: SendErc20ModalProps) {
  const [toAddress, setToAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const erc20ContractAddress =
    process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS ??
    "0xd66cd7D7698706F8437427A3cAb537aBc12c8C88";

  const [isPendingClaim, setIsPendingClaim] = useState(false);

  const { data: erc20Balance, isSuccess } = useReadContract({
    abi: BootcampTokenABI,
    address: erc20ContractAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [userAddress ?? "0x0"],
    // query: {
    //   enabled: Boolean(userAddress),
    // },
  });

  console.log(erc20Balance, erc20ContractAddress);

  // const { data: hasAddressClaimed, isSuccess: hasAddressClaimedIsSuccess } =
  //   useReadContract({
  //     abi: BootcampTokenABI,
  //     address: erc20ContractAddress as `0x${string}`,
  //     functionName: "hasAddressClaimed",
  //     args: [userAddress ?? "0x0"],
  //     // query: {
  //     //   enabled: Boolean(userAddress),
  //     // },
  //   });

  // const { data: hash, isPending, writeContractAsync } = useWriteContract();
  // const { isLoading: isConfirming, isSuccess: isConfirmed } =
  //   useWaitForTransactionReceipt({
  //     hash,
  //   });
  // async function handleClaimTokens(
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) {
  //   e.preventDefault();
  //   if (!userAddress) {
  //     toast.warning("You must connect your wallet...");
  //     return;
  //   }
  //   setIsPendingClaim(true);
  //   try {
  //     const hash = await writeContractAsync({
  //       abi: BootcampTokenABI,
  //       address: erc20ContractAddress as `0x${string}`,
  //       functionName: "claim",
  //       args: [userAddress],
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsPendingClaim(false);
  //   }
  // }

  // function submitTransferErc20() {
  //   return "placeholder function...";
  // }

  // useEffect(() => {
  //   if (!isMounted) {
  //     setIsMounted(true);
  //   }
  // }, [isMounted]);

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button>Send ERC20</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Send ERC20</DialogTitle>
          <DialogDescription>
            The amount entered will be sent to the address once you hit the Send
            button
          </DialogDescription>
        </DialogHeader>
        {isMounted ? (
          <div className="w-full">
            <div className="text-center flex flex-col">
              {isSuccess ? (
                <>
                  <h2>{parseFloat(formatEther(erc20Balance)).toFixed(2)}</h2>
                  <h4>BOOTCAMP</h4>
                  {parseFloat(formatEther(erc20Balance)) === 0 && (
                    <div className="w-full py-2">
                      <Button>
                        {isPendingClaim ? "Claiming..." : "Claim"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <form
              className="flex flex-col w-full gap-y-2"
              onSubmit={submitTransferErc20}
            >
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  name="address"
                  placeholder="0xA0Cf…251e"
                  required
                  onChange={(event) => setToAddress(event.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="value">Amount</Label>
                <Input
                  name="value"
                  placeholder="0.05"
                  required
                  onChange={(event) => setTokenAmount(event.target.value)}
                />
              </div>
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
