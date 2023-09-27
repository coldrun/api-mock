import { faker } from '@faker-js/faker';
import fs from 'fs';
import { JSONSchemaFaker } from 'json-schema-faker';
import merge from 'lodash.merge';
import path from 'path';
import { fileURLToPath } from 'url';
import { getJsonSchema } from '../src/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../data');

function stringify(data) {
  return JSON.stringify(data, null, 2);
}

async function main() {
  const jsonSchema = await getJsonSchema();

  const { Truck } = jsonSchema.components.schemas;
  const truck = merge(Truck, {
    properties: {
      id: {
        unique: true,
        minimum: 1,
        maximum: 300,
      },
      code: {
        unique: true,
        faker: { 'string.alphanumeric': { length: { min: 6, max: 12 }, casing: 'upper' } },
      },
      name: {
        faker: { 'helpers.arrayElement': [['Mixer Rear', 'Concrete Pump', 'Dump Truck', 'Mixer Front', 'Semi']] },
      },
      description: {
        faker: { 'lorem.words': { mix: 3, max: 10 } },
      },
    },
  });

  const mockSchema = {
    type: 'object',
    properties: {
      trucks: {
        type: 'array',
        minItems: 10,
        maxItems: 20,
        items: {
          type: 'object',
          ...truck,
        },
      },
    },
    required: ['trucks'],
  };

  JSONSchemaFaker.extend('faker', () => faker);
  const mockData = JSONSchemaFaker.generate(mockSchema);

  fs.writeFileSync(path.join(distPath, 'json.schema.json'), stringify(jsonSchema));
  fs.writeFileSync(path.join(distPath, 'mock.schema.json'), stringify(mockSchema));
  fs.writeFileSync(path.join(distPath, 'mock.data.json'), stringify(mockData));
}

await main();
