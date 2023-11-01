import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";
import { TableNames } from "../../utils/constants";

const client = new DynamoDBClient({});

/*
AILLA_CLIENT Table
{
  code: { S: "localhost:3000" },
  language: { S: "ja" },
  name: { S: "Ailla" },
  situations: { L: [{ S: "1" }, { S: "2" }] },
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const code = process.env.CLIENT_CODE || req.headers.host as string;
    console.log(code);
  
    if (req.method === "PUT" || req.method === "POST") {
      const Item = {
        code: { S: req.body.code },
        language: { S: req.body.language },
        name: { S: req.body.name },
        situations: { SS: req.body.situations },
      };
      await client.send(
        new PutItemCommand({
          TableName: TableNames.clients,
          Item,
        })
      );
  
      return res.status(201).json(Item);
    }

    if (req.method === "GET") {
      const { Item } = await client.send(
        new GetItemCommand({
          TableName: TableNames.clients,
          Key: {
            code: { S: code as string },
          },
        })
      );
      console.log(Item);
  
      return res.status(200).json(Item);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
