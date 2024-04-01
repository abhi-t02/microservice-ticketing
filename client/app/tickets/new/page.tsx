"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import useRequest from "@/app/hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/v1/tickets/",
    method: "post",
    body: {
      title,
      price: Number.parseFloat(price),
    },
    onSuccess: () => router.push("/"),
  });

  const onBlur = function (e: FormEvent) {
    const value = Number.parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const submitHandler = function (e: FormEvent) {
    e.preventDefault();
    doRequest();
  };

  return (
    <div className="container-sm w-25">
      <h1>Create a Ticket</h1>
      <form className="d-flex flex-column gap-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
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
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
