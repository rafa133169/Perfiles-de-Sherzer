import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const evaluacionId = event.pathParameters?.id;
    const { nivel } = JSON.parse(event.body || "{}");

    if (!evaluacionId || !nivel) throw new Error("Missing parameters");

    await docClient.send(
      new UpdateCommand({
        TableName: process.env.EVALUACION_TABLE!,
        Key: { id: evaluacionId },
        UpdateExpression: "SET nivel = :nivel",
        ExpressionAttributeValues: { ":nivel": nivel },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update evaluacion" }),
    };
  }
};
