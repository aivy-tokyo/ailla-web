import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";
import { TableNames } from "../../utils/constants";

const client = new DynamoDBClient({});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const origin = req.headers.origin;
  console.log("req.headers.origin", origin);

  if (req.method === "PUT") {
    const Item = {
      id: { S: req.body.id },
      name: { S: req.body.name },
      prefecture: { S: req.body.prefecture },
      birthdate: { S: req.body.birthdate },
      gender: { S: req.body.gender },
    };
    await client.send(
      new PutItemCommand({
        TableName: TableNames.users,
        Item,
      })
    );

    return res.status(201).json(Item);
  }

  if (req.method === "GET") {
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: TableNames.users,
        Key: {
          id: { S: req.query.id as string },
        },
      })
    );

    return res.status(200).json(Item);
  }

  if (req.method === "POST") {
    const { Attributes } = await client.send(
      new UpdateItemCommand({
        TableName: TableNames.users,
        Key: {
          id: { S: req.body.id },
        },
        UpdateExpression:
          "set #nameAttr = :n, prefecture = :p, birthdate = :b ,gender = :g",
        ExpressionAttributeValues: {
          ":n": { S: req.body.name },
          ":p": { S: req.body.prefecture },
          ":b": { S: req.body.birthdate },
          ":g": { S: req.body.gender },
        },
        ExpressionAttributeNames: {
          "#nameAttr": "name",
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return res.status(200).json(Attributes);
  }

  if (req.method === "DELETE") {
    await client.send(
      new DeleteItemCommand({
        TableName: TableNames.users,
        Key: {
          id: { S: req.body.id },
        },
      })
    );

    return res.status(204).json({});
  }
}
