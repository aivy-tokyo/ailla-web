import * as uuid from 'uuid';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb';
import { NextApiRequest, NextApiResponse } from 'next';

const client = new DynamoDBClient({});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'PUT') {
    const Item = {
      id: { S: req.body.id },
      userName: { S: req.body.userName },
      userPrefecture: { S: req.body.userPrefecture },
      userBirthday: { S: req.body.userBirthday },
      userGender: { S: req.body.userGender },
    };
    await client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item,
      })
    );

    return res.status(201).json(Item);
  }

  if (req.method === 'GET') {
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: req.query.id as string}
        }
      })
    );

    return res.status(200).json(Item);
  }

  if (req.method === 'POST') {
    const { Attributes } = await client.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: req.body.id }
        },
        UpdateExpression: 'set userName = :n, userPrefecture = :p, userBirthday = :b ,userGender = :g',
        ExpressionAttributeValues: {
          ':n': { S: req.body.userName },
          ':p': { S: req.body.userPrefecture },
          ':b': { S: req.body.userBirthday },
          ':g': { S: req.body.userGender },
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    return res.status(200).json(Attributes);
  }

  if (req.method === 'DELETE') {
    await client.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: req.body.id }
        }
      })
    );

    return res.status(204).json({});
  }
}
