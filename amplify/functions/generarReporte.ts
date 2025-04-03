import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Ejemplo: Obtener todos los alumnos y sus evaluaciones para el reporte
    const { Items: alumnos } = await docClient.send(
      new QueryCommand({
        TableName: process.env.ALUMNO_TABLE!,
        Select: "ALL_ATTRIBUTES"
      })
    );

    // Obtener todas las evaluaciones
    const { Items: evaluaciones } = await docClient.send(
      new QueryCommand({
        TableName: process.env.EVALUACION_TABLE!,
        Select: "ALL_ATTRIBUTES"
      })
    );

    // Procesar datos para el reporte
    const reporte = {
      fechaGeneracion: new Date().toISOString(),
      totalAlumnos: alumnos?.length || 0,
      totalEvaluaciones: evaluaciones?.length || 0,
      // Agregar más métricas según necesites
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reporte),
    };
  } catch (error) {
    console.error("Error generando reporte:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error al generar reporte",
        error: error instanceof Error ? error.message : "Error desconocido"
      }),
    };
  }
};