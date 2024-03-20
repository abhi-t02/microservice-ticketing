"use client";

import { useEffect } from "react";
import useRequest from "@/app/hooks/use-request";
import { useRouter } from "next/navigation";

export default function signout() {
  const router = useRouter();

  const { doRequest } = useRequest({
    url: "/api/v1/users/signout",
    method: "post",
    body: {},
    onSuccess: (data: any) => router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing you out...</div>;
}
