import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';
import * as Sentry from "@sentry/nextjs";

// DynamoDBクライアントの設定
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'us-west-2', // あなたのリージョンに合わせて変更
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // ユーザーログの取得
      try {
        const params = {
          TableName: 'UserLogs',
          Key: {
            UserID: req.query.userID as string,
            Timestamp: Number(req.query.timestamp),
          },
        };
        const result = await dynamoDb.get(params).promise();
        res.status(200).json(result.Item);
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ error: 'Unable to get user log' });
      }
      break;

    case 'POST':
      // ユーザーログの作成
      try {
        const params = {
          TableName: 'UserLogs',
          Item: {
            UserID: req.body.userID,
            Timestamp: Date.now(),
            Action: req.body.action,
            // その他の属性
          },
        };
        await dynamoDb.put(params).promise();
        res.status(200).json({ success: true });
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ error: 'Unable to create user log' });
      }
      break;

    case 'PUT':
      // ユーザーログの更新
      try {
        const params = {
          TableName: 'UserLogs',
          Key: {
            UserID: req.body.userID,
            Timestamp: Number(req.body.timestamp),
          },
          UpdateExpression: 'set Action = :action',
          ExpressionAttributeValues: {
            ':action': req.body.action,
          },
        };
        await dynamoDb.update(params).promise();
        res.status(200).json({ success: true });
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ error: 'Unable to update user log' });
      }
      break;

    case 'DELETE':
      // ユーザーログの削除
      try {
        const params = {
          TableName: 'UserLogs',
          Key: {
            UserID: req.query.userID as string,
            Timestamp: Number(req.query.timestamp),
          },
        };
        await dynamoDb.delete(params).promise();
        res.status(200).json({ success: true });
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ error: 'Unable to delete user log' });
      }
      break;

    default:
      res.status(400).json({ error: 'Invalid request method' });
      break;
  }
};
