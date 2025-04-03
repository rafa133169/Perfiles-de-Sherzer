import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const alumnoId = event.pathParameters?.id;
    if (!alumnoId) throw new Error("Alumno ID missing");

    const { Items } = await docClient.send(
      new QueryCommand({
        TableName: process.env.EVALUACION_TABLE!,
        KeyConditionExpression: "alumnoId = :id",
        ExpressionAttributeValues: { ":id": alumnoId },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(Items || []),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch evaluaciones" }),
    };
  }
};
