"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import React, { useEffect, useState } from "react";

function Sign() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userExists, setUserExists] = useState<boolean>(true);
  const [userNameValid, setUserNameValid] = useState<boolean>(false);
  console.log(status);

  useEffect(() => {
    if (isConnected) {
      const headers = {
        "Content-Type": "application/json",
      };
      fetch("/api/searchUser", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          walletAddress: address,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "User not found") {
            setUserExists(false);
          }
        });
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isConnected && session) {
      fetch("/api/create/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          walletAddress: address,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "User already exists") {
            router.replace("/swap");
          } else if (data.message === "User created successfully") {
            router.replace("/swap");
          }
        });
    }
  }, [isConnected, address, session]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl: `/swap`,
      });

      // router.replace("/swap");
    } catch (error) {
      console.log(error);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="hero min-h-screen bg-[#120F22]">
        <div className="hero-content text-center bg-transparent">
          <p className="text-purple-800">Loading </p>
          <progress className="progress w-56"></progress>
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen bg-[#120F22]">
      <div className="hero-content text-left h-80">
        <div className="max-w-md h-80">
          <h1 className="text-5xl font-bold text-center">Hello there</h1>
          <p className="py-6">
            It looks like you are not signed in with your wallet, please connect
            your wallet to access the Nox Application.
          </p>
          <div className="text-left">
            <form onSubmit={(e) => handleLogin(e)}>
              {isConnected && !userExists && (
                <input
                  type="text"
                  placeholder="Enter your name here..."
                  className="input input-bordered input-primary w-full my-2 bg-transparent"
                  onChange={(e) => {
                    const val = e.target.value;
                    setUserName(val);
                    if (val.length >= 4) {
                      setUserNameValid(true);
                    }
                  }}
                  required
                />
              )}

              {userName.length <= 3 && isConnected && !userExists && (
                <div className="alert alert-warning shadow-lg desktop:h-3 laptop:h-3 tablet:h-3 mobile:h-18">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="text-sm">
                      Warning: Name must be atleast 4 characters long!
                    </span>
                  </div>
                </div>
              )}
              {isConnected && !session && (
                <button
                  className={`${userExists && "bg-[#FF7A01]"} ${
                    userNameValid && !userExists && "bg-gray-300"
                  } px-4 py-2 mt-5 rounded-xl float-right`}
                  type="submit"
                  disabled={!userNameValid && !userExists}
                >
                  {" "}
                  Sign In{" "}
                </button>
              )}
            </form>
            {!isConnected && (
              <div className="float-right mt-5">
                <ConnectButton label="Connect Wallet" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sign;
