import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res
    .status(200)
    .json({
      say: "AILLA is good app!",
      status: "ok",
      render: process.env.RENDER,
      is_pull_request: process.env.IS_PULL_REQUEST,
      env: process.env.NODE_ENV,
    });
}
