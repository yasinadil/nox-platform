"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";

export const NotificationCard = (props: any) => {
  const [issueeName, setIssueeName] = useState("");
  const router = useRouter();
  var created_date = new Date(props.date);

  useEffect(() => {
    const load = async () => {
      await getIssueeName(props.recipientWalletAddress);
    };
    load();
  }, []);

  const getIssueeName = async (searchWallet) => {
    const headers = {
      "Content-Type": "application/json",
    };
    fetch("/api/getUserEncKey", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        walletAddress: searchWallet,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        if (data.message === "User not found") {
          setIssueeName(searchWallet);
        } else {
          setIssueeName(data.message.name);
        }
      });
  };

  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = created_date.getFullYear();
  var month = months[created_date.getMonth()];
  var date = created_date.getDate();
  var hour = created_date.getHours();
  var min = created_date.getMinutes();
  var sec = created_date.getSeconds();
  var amOrPm = hour > 12 ? "PM" : "AM";
  var time = date + " " + month + " " + year + " " + hour + " " + amOrPm;

  return (
    <li>
      <div
        className="cursor-pointer"
        onClick={async () => {
          router.push(`/token/${props.tokenID}`);
        }}
      >
        <DocumentScannerOutlinedIcon />
        You issued a document to {issueeName} on {time}
      </div>
    </li>
  );
};

export default function HistoryDApp() {
  const [issueeName, setIssueeName] = useState("");
  const { address } = useAccount();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getAllHistory = async () => {
      await getHistory();
    };
    getAllHistory();
  }, []);

  async function getHistory() {
    fetch("/api/getUserHistory", {
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

          setNotifications(allnotifications);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="desktop:col-span-4 mobile:col-span-4 desktop:mx-auto desktop:my-auto mobile:mx-auto mobile:mt-0 desktop:w-3/4 mobile:w-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-14 text-2xl bannerHeading">
          Your Document Issuance History
        </h1>
        <div>
          <ul className="menu p-2 shadow bg-[#145365] rounded-box w-96 my-2">
            {notifications.length > 0 ? (
              notifications.map((noti: any, index) => {
                return (
                  <NotificationCard
                    key={index}
                    message={noti.message}
                    tokenID={noti.docID}
                    recipientWalletAddress={noti.recipientWalletAddress}
                    date={noti.createdAt}
                  />
                );
              })
            ) : (
              <li className="p-2">No issuance history!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
