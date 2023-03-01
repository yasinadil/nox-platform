"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import qs from "qs";
import { ethers, BigNumber } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";
import { useAccount, useBalance } from "wagmi";
import { noxTokenAddress, WETH_TokenAddress } from "../../Config";
import arrow from "../../assets/arrow.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ERC20ABI = require("../ABI/ABI.json");

function Buy() {
  const [noxTokenBalance, setNoxTokenBalance] = useState("0");
  const [userBalance, setUserBalance] = useState("0");
  const [holdup, setHold] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState(0);
  const [swapValue, setSwapValue] = useState("");
  const [estGas, setEstGas] = useState("0");
  const [liqProvider, setLiqProvider] = useState("Not detected");
  const [approving, setApproving] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const { address, isConnected } = useAccount();
  const zeroxapi = "https://goerli.api.0x.org";

  const settings = {
    apiKey: process.env.NEXT_PUBLIC_AlchemyAPI,
    network: Network.ETH_GOERLI,
  };

  const alchemy = new Alchemy(settings);

  useEffect(() => {
    if (isConnected) {
      const getNOXBalance = async () => {
        if (address != undefined) {
          const balances = await alchemy.core.getTokenBalances(address, [
            noxTokenAddress,
          ]);

          balances.tokenBalances.find((item: any) => {
            const value = BigNumber.from(item.tokenBalance);
            const formatBalance = ethers.utils.formatEther(value);
            let balance = Number(formatBalance).toFixed(0);
            if (
              item.tokenBalance ===
              "0x0000000000000000000000000000000000000000000000000000000000000000"
            ) {
              setNoxTokenBalance("0");
            } else {
              setNoxTokenBalance(balance.toString());
            }
          });
        }
      };

      const getWETHBalance = async () => {
        if (address != undefined) {
          const balanceWETH = await alchemy.core.getTokenBalances(address, [
            WETH_TokenAddress,
          ]);

          balanceWETH.tokenBalances.find((item) => {
            const value = BigNumber.from(item.tokenBalance);
            const formatBalance = ethers.utils.formatEther(value);
            let balance = Number(formatBalance).toFixed(4);
            if (
              item.tokenBalance ===
              "0x0000000000000000000000000000000000000000000000000000000000000000"
            ) {
              setUserBalance("0");
            } else {
              setUserBalance(balance.toString());
            }
          });
        }
      };
      getNOXBalance();
      getWETHBalance();
    }
  }, [isConnected, address, alchemy.core]);

  const getPrice = async (wethAmount: string) => {
    const params = {
      sellToken: WETH_TokenAddress,
      buyToken: noxTokenAddress,
      sellAmount: wethAmount,
    };
    const response = await fetch(
      zeroxapi + `/swap/v1/price?${qs.stringify(params)}`
    );
    const sources = await fetch(
      zeroxapi + `/swap/v1/quote?${qs.stringify(params)}`
    );

    var swapPriceJSON = await response.json();
    var swapOrders = await sources.json();
    try {
      await swapOrders.orders.find((item) => {
        setLiqProvider(item.source);
      });
    } catch (error: any) {
      setLiqProvider("Pool Not Available");
    }
    var rawvalue = swapOrders.buyAmount / 10 ** 18;
    var value = rawvalue.toFixed(2);
    setSwapValue(value.toString());
    setEstGas(swapPriceJSON.estimatedGas);
  };

  const swap = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (Number(fromAmount) > 0) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const signer = provider.getSigner();
        const params = {
          sellToken: WETH_TokenAddress,
          buyToken: noxTokenAddress,
          sellAmount: fromAmount,
        };

        const getquote = await fetch(
          zeroxapi + `/swap/v1/quote?${qs.stringify(params)}`
        );
        var quote = await getquote.json();
        var proxy = quote.allowanceTarget;
        const ERC20Contract = new ethers.Contract(
          WETH_TokenAddress,
          ERC20ABI,
          signer
        );
        const approval = await ERC20Contract.approve(proxy, fromAmount);
        setApproving(true);
        await approval.wait();
        const txParams = {
          ...quote,
          from: address,
          to: quote.to,
          value: quote.value.toString(16),
          gasPrice: null,
          gas: quote.gas,
        };
        setApproving(false);
        //@ts-ignore
        const response = await ethereum.request({
          method: "eth_sendTransaction",
          params: [txParams],
        });
        setSwapping(true);
        const wait = await provider.waitForTransaction(response);
        setSwapping(false);
        getWETHBalance();
        getNOXBalance();
        toast.success("Successfully bought Nox Tokens", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("Cannot swap zero amount", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex justify-center">
        <div className="border-4 border-[#8E00FE] desktop:px-12 mobile:px-3 desktop:py-12 tablet:py-4 mobile:py-12 rounded-3xl">
          <p className="text-center pb-8 font-semibold desktop:text-2xl laptop:text-2xl tablet:text-xl mobile:text-xl">
            Swap WETH to NOX
          </p>
          <form onSubmit={(event) => swap(event)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Enter amount</span>
              </label>
              <label className="input-group">
                <input
                  type="number"
                  step={0.000001}
                  max={userBalance}
                  placeholder="Enter amount"
                  required
                  className="input input-bordered text-black "
                  onChange={(e) => {
                    if (e.target.value != "" && Number(e.target.value) > 0) {
                      const val = e.target.value;
                      const valBig = ethers.utils.parseEther(val);
                      setFromAmount(valBig.toString());
                      const delayDebounce = setTimeout(() => {
                        getPrice(valBig.toString());
                      }, 1000);
                    }
                  }}
                />
                <span className="text-gray-700">WETH</span>
              </label>
              <label className="label">
                <span className="label-text-alt text-white">
                  Balance: {userBalance}
                </span>
              </label>
            </div>
            <div className="flex justify-center pt-8 pb-4">
              <Image
                className=""
                style={{ width: "4vh" }}
                src={arrow}
                alt="polygon"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Enter amount</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="0"
                  value={swapValue}
                  readOnly
                  className="input input-bordered text-white glassEffect"
                />
                <span className="text-gray-500 glassEffect">
                  &nbsp;NOX&nbsp;
                </span>
              </label>
              <label className="label">
                <span className="label-text-alt text-white">
                  Balance: {noxTokenBalance}
                </span>
              </label>
            </div>
            <div className="flex justify-center mt-8">
              {approving && (
                <button className="btn loading">Approving...</button>
              )}
              {swapping && <button className="btn loading">Swapping...</button>}
              {!swapping && !approving && (
                <button
                  type="submit"
                  className="px-16 py-3 bg-white text-black rounded-xl text-center"
                >
                  {" "}
                  Buy{" "}
                </button>
              )}
            </div>
          </form>
          <div className="pt-8">
            <div>
              <span>Estimated Gas </span>
              <span className="float-right">{estGas}</span>
            </div>
            <div>
              <span>Liquidity Provider </span>
              <span className="float-right">{liqProvider}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Buy;
