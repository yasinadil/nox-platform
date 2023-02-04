import { useEffect, useState } from "react";
import Image from "next/image";
import qs from "qs";
import { ethers, BigNumber } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";
import { useAccount, useBalance } from "wagmi";
import { noxTokenAddress, WETH_TokenAddress } from "../../Config";
import arrow from "../../assets/arrow.png";

const ERC20ABI = require("../ABI/ABI.json");

function Buy() {
  const { address, isConnected } = useAccount();
  const [noxTokenBalance, setNoxTokenBalance] = useState("0");
  const [userBalance, setUserBalance] = useState("0");
  const [holdup, setHold] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState(0);
  const [swapValue, setSwapValue] = useState("");
  const [estGas, setEstGas] = useState("0");
  const [liqProvider, setLiqProvider] = useState("Not detected")
  const [approving, setApproving] = useState(false)
  const [swapping, setSwapping] = useState(false)
  let zeroxapi = "https://goerli.api.0x.org";

  const settings = {
    apiKey: process.env.alchemyAPI,
    network: Network.ETH_GOERLI,
  };

  const alchemy = new Alchemy(settings);

  useEffect(() => {
    if (isConnected) {
      getNOXBalance();
      getWETHBalance();
    }
  }, [isConnected]);

  const getNOXBalance = async () => {
    if(address != undefined){
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
    if(address != undefined){
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

  async function getPrice(wethAmount: string) {
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
    } catch (error) {
      setLiqProvider("Pool Not Available");
    }
    var rawvalue = swapOrders.buyAmount / 10 ** 18;
    var value = rawvalue.toFixed(2);
    setSwapValue(value.toString())
    setEstGas(swapPriceJSON.estimatedGas);
  }

  async function swapit() {
  
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const params = {
      sellToken: WETH_TokenAddress,
      buyToken: noxTokenAddress,
      sellAmount: fromAmount,
    }
  
    const getquote = await fetch(zeroxapi + `/swap/v1/quote?${qs.stringify(params)}`);
    var quote = await getquote.json()
    var proxy = quote.allowanceTarget
    const ERC20Contract = new ethers.Contract(WETH_TokenAddress, ERC20ABI, signer);
    const approval = await ERC20Contract.approve(proxy, fromAmount)
    setApproving(true)
    await approval.wait()
    const txParams = {
      ...quote,
      from: address,
      to: quote.to,
      value: (quote.value).toString(16),
      gasPrice: null,
      gas: quote.gas,
    }
    setApproving(false)
    //@ts-ignore
    const response = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [txParams],
    });
    setSwapping(true)
    const wait = await provider.waitForTransaction(response);
    setSwapping(false)
    }
  

  return (
    <div className="pt-48 pb-24 flex justify-center">
      <div className="bg-[#1F1C32] border-4 border-[#8E00FE] desktop:px-24 mobile:px-0 desktop:py-24 mobile:py-16 rounded-3xl">
        <p className="text-center pb-8 font-semibold text-2xl">
          Buy Nox Tokens
        </p>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Enter amount</span>
          </label>
          <label className="input-group">
            <input
              type="number"
              step={0.000001}
              placeholder="Enter amount"
              className="input input-bordered text-black"
              onChange={(e) => {
                if (e.target.value != "" && Number(e.target.value) > 0) {
                  const val = e.target.value;
                  const valBig = ethers.utils.parseEther(val);
                  setFromAmount(valBig.toString())
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
              className="input input-bordered text-black"
            />
            <span className="text-gray-700">&nbsp;NOX&nbsp;</span>
          </label>
          <label className="label">
            <span className="label-text-alt text-white">
              Balance: {noxTokenBalance}
            </span>
          </label>
        </div>
        <div className="flex justify-center mt-8">
          
   

{approving && (<button className="btn loading">Approving...</button>)}
{swapping && (<button className="btn loading">Swapping...</button>)}
{!swapping && !approving && (<button className="px-16 py-3 bg-white text-black rounded-xl text-center"
          onClick={swapit}>
            {" "}
            Buy{" "}
          </button>)}




          
        </div>
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
  );
}

export default Buy;
