import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";
import { TableNames } from "../../utils/constants";

const client = new DynamoDBClient({});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: TableNames.clients,
        Key: {
          id: { S: req.query.id as string },
        },
      })
    );

    return res.status(200).json(Item);
  }
}
