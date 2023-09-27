import SwaggerParser from '@apidevtools/swagger-parser';
import {
  openapiSchemaToJsonSchema as toJsonSchema,
} from '@openapi-contrib/openapi-schema-to-json-schema';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaFile = path.resolve(__dirname, 'schema/openapi.schema.yml');

export async function getJsonSchema() {
  return SwaggerParser.dereference(schemaFile)
    .then((schema) => toJsonSchema(schema));
}
