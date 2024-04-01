import axios from "axios";
import { useState } from "react";

interface bodyType {
  email?: string;
  password?: string;
}

export default function useRequest<T>(params: {
  url: string;
  method: string;
  body: T | bodyType | "";
  onSuccess: Function;
}) {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await (axios as any)[params.method](
        params.url,
        params.body
      );
      params.onSuccess(response.data);
      return response.data;
    } catch (err: any) {
      setErrors(err.response.data.errors);
      throw err;
    }
  };

  return { doRequest, errors };
}
