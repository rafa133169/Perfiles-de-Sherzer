import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  foto: string | null;
  createdAt: string;
}

interface RequestBody {
  nombre: string;
  apellido: string;
  foto?: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = { "Content-Type": "application/json" };

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Cuerpo de la solicitud faltante" }),
    };
  }

  try {
    const { nombre, apellido, foto }: RequestBody = JSON.parse(event.body);

    if (!nombre || !apellido) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Nombre y apellido son requeridos" }),
      };
    }

    const nuevoAlumno: Alumno = {
      id: Date.now().toString(),
      nombre,
      apellido,
      foto: foto ?? null,
      createdAt: new Date().toISOString(),
    };

    if (!process.env.ALUMNO_TABLE) {
      throw new Error("ALUMNO_TABLE no está configurado");
    }

    await docClient.send(
      new PutCommand({
        TableName: process.env.ALUMNO_TABLE,
        Item: nuevoAlumno,
      })
    );

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(nuevoAlumno),
    };
  } catch (error) {
    console.error("Error al crear alumno:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error al crear alumno",
        error: errorMessage,
      }),
    };
  }
};
