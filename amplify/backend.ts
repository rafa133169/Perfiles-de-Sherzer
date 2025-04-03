import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { aws_lambda_nodejs } from "aws-cdk-lib";
import { fileURLToPath } from "url";
import path from "path";
import * as cdk from "aws-cdk-lib";

// Obtener __dirname equivalente en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir el backend
const backend = defineBackend({
  auth,
  data,
});

// Configuración especial para Windows
const cdkStack = backend.data.stack as cdk.Stack;
cdkStack.templateOptions.transforms = ["AWS::Serverless-2016-10-31"];

// Función helper modificada para Windows
const createLambda = (id: string, handler: string) => {
  return new aws_lambda_nodejs.NodejsFunction(cdkStack, id, {
    entry: path.join(__dirname, "functions", handler),
    environment: {
      ALUMNO_TABLE: backend.data.resources.tables.Alumno.tableName,
      EVALUACION_TABLE: backend.data.resources.tables.Evaluacion.tableName,
    },
    bundling: {
      nodeModules: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"],
      forceDockerBundling: true, // Fuerza el uso de Docker
      dockerImage: cdk.DockerImage.fromRegistry(
        "public.ecr.aws/sam/build-nodejs18.x:latest"
      ),
    },
  });
};

// Resto de tu configuración de funciones permanece igual...
// Crear funciones Lambda específicas para el proyecto
const functions = {
  crearAlumno: createLambda("CrearAlumnoFn", "crearAlumno.ts"),
  listarAlumnos: createLambda("ListarAlumnosFn", "listarAlumnos.ts"),
  obtenerEvaluaciones: createLambda(
    "ObtenerEvaluacionesFn",
    "obtenerEvaluaciones.ts"
  ),
  actualizarEvaluacion: createLambda(
    "ActualizarEvaluacionFn",
    "actualizarEvaluacion.ts"
  ),
  generarReporte: createLambda("GenerarReporteFn", "generarReporte.ts"),
};

// Asignar permisos a las tablas
backend.data.resources.tables.Alumno.grantReadWriteData(functions.crearAlumno);
backend.data.resources.tables.Alumno.grantReadData(functions.listarAlumnos);
backend.data.resources.tables.Evaluacion.grantReadData(
  functions.obtenerEvaluaciones
);
backend.data.resources.tables.Evaluacion.grantReadWriteData(
  functions.actualizarEvaluacion
);
backend.data.resources.tables.Alumno.grantReadData(functions.generarReporte);
backend.data.resources.tables.Evaluacion.grantReadData(
  functions.generarReporte
);

// Exportar el backend configurado
export default backend;
