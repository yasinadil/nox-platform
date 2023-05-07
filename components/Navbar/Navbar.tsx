"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../../assets/user.png";
import "react-toastify/dist/ReactToastify.css";
import notification from "../../public/assets/notification.png";
import newNotification from "../../public/assets/newNotification.png";
import { useSession } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";

import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";

export const NotificationCard = (props: any) => {
  const router = useRouter();

  const updateNotification = async (tokenIdentity: Number) => {
    fetch("/api/updateNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docID: tokenIdentity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message != "Error Ocurred") {
          console.log(data.message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <li>
      <div
        className="cursor-pointer"
        onClick={async () => {
          updateNotification(props.tokenID);
          router.push(`/token/${props.tokenID}`);
        }}
      >
        <DocumentScannerOutlinedIcon />
        {props.message}
        {!props.read && (
          <div className="badge badge-primary bg-blue-500 float-right">NEW</div>
        )}
      </div>
    </li>
  );
};

function Navbar() {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect();
  const [notifications, setNotifications] = useState([]);
  const [notiRead, setNotiRead] = useState(true);

  useEffect(() => {
    if (isConnected && address != undefined) {
      setUserAddress(address);
      const getNotifications = async () => {
        fetch("/api/readNotifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: address,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            if (data.message != "No Notifications Found") {
              console.log(data.message);
              const allnotifications = data.message;
              allnotifications.map((noti) => {
                if (!noti.read) {
                  setNotiRead(false);
                }
              });

              setNotifications(data.message);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      };
      getNotifications();
    }
  }, [isConnected, address]);

  return (
    <div className="navbar bg-[#120F22] desktop:pt-8 desktop:px-8 laptop:pt-8 laptop:px-8 mobile:pt-8 mobile:px-2 ">
      <div className="flex-1">
        <Link
          href="/"
          className="title desktop:text-6xl laptop:text-5xl mobile:text-3xl"
        >
          Nox
        </Link>
      </div>
      <div className=" gap-2">
        <Link
          href="/signin"
          className="hide-mobile desktop:mr-2 mobile:mr-0 text-center bg-[#FF7A01] px-4 py-2 rounded-lg text-white font-bold"
        >
          Launch DApp
        </Link>

        {session && (
          <Link
            href={`/api/auth/signout`}
            className="desktop:mr-2 mobile:mr-0 text-center bg-[#FF7A01] px-4 py-2 rounded-lg text-white font-bold"
            onClick={(e) => {
              e.preventDefault();
              disconnect();
              signOut();
            }}
          >
            Sign out
          </Link>
        )}

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="m-1">
            {notiRead ? (
              <Image
                className="cursor-pointer w-10 h-10"
                src={notification}
                alt="noti"
              />
            ) : (
              <Image
                className="cursor-pointer w-10 h-10"
                src={newNotification}
                alt="noti"
              />
            )}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-[#145365] rounded-box w-96"
          >
            {notifications.length > 0 ? (
              notifications.map((noti: any, index) => {
                return (
                  <NotificationCard
                    key={index}
                    message={noti.message}
                    tokenID={noti.docID}
                    read={noti.read}
                  />
                );
              })
            ) : (
              <li>No new notifications!</li>
            )}
          </ul>
        </div>

        <div className="avatar online cursor-pointer">
          <div className=" rounded-full">
            {isConnected ? (
              <Link className="w-60 h-60" href={`/account/${userAddress}`}>
                <Image src={Avatar} alt="avatar" priority={true} />
              </Link>
            ) : (
              <Link className="w-60 h-60" href={`/account`}>
                <Image src={Avatar} alt="avatar" priority={true} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
