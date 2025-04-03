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
  // Validar que el cuerpo del evento existe
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Cuerpo de la solicitud faltante" }),
    };
  }

  try {
    // Parsear y validar el cuerpo de la solicitud
    const { nombre, apellido, foto }: RequestBody = JSON.parse(event.body);

    if (!nombre || !apellido) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Nombre y apellido son requeridos",
        }),
      };
    }

    // Crear objeto alumno con tipos definidos
    const nuevoAlumno: Alumno = {
      id: Date.now().toString(),
      nombre,
      apellido,
      foto: foto || null,
      createdAt: new Date().toISOString(),
    };

    // Validar que el nombre de la tabla está configurado
    if (!process.env.ALUMNO_TABLE) {
      throw new Error(
        "ALUMNO_TABLE no está configurado en las variables de entorno"
      );
    }

    // Insertar en DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: process.env.ALUMNO_TABLE,
        Item: nuevoAlumno,
      })
    );

    // Respuesta exitosa
    return {
      statusCode: 201, // 201 Created es más apropiado para recursos nuevos
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoAlumno),
    };
  } catch (error) {
    console.error("Error al crear alumno:", error);

    // Manejar diferentes tipos de errores
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Error al crear alumno",
        error: errorMessage,
      }),
    };
  }
};
