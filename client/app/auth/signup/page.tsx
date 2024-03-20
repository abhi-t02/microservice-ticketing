"use client";

import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import useRequest from "@/app/hooks/use-request";

export default function signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/v1/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: (data: any) => router.push(`/`),
  });

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await doRequest();

    // console.log(data);

    setEmail("");
    setPassword("");
  };

  return (
    <div className="container-sm w-25">
      <form
        className="d-flex flex-column gap-3"
        onSubmit={(e) => submitHandler(e)}
      >
        <h1>Sign Up</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-control"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors && (
          <div className="alert alert-danger">
            <ul className="my-0">
              {(errors as any).map((err: any, index: any) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>
          </div>
        )}

        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}
