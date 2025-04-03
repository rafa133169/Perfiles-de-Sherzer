import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  try {
    const { nombre, apellido, foto } = JSON.parse(event.body);

    const nuevoAlumno = {
      id: Date.now().toString(),
      nombre,
      apellido,
      foto: foto || null,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.ALUMNO_TABLE,
        Item: nuevoAlumno,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(nuevoAlumno),
    };
  } catch (error) {
    console.error("Error al crear alumno:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al crear alumno" }),
    };
  }
};
