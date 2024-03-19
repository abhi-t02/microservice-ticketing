"use client";

import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import axios from "axios";

export default function signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [show, setShow] = useState(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setShow(false);
    try {
      const response = await axios.post("/api/v1/users/signup", {
        email,
        password,
      });
    } catch (err: any) {
      setShow(true);
      setErrors(err.response.data.errors);
    }

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
        {show ? (
          <div className="alert alert-danger">
            <ul className="my-0">
              {errors.map((err: any, index) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}
