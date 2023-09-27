import { Validator } from 'jsonschema';
import { getJsonSchema } from '../schema.js';

const ErrorCode = { NOT_UNIQUE: 'NOT_UNIQUE', INVALID_OPERATION: 'INVALID_OPERATION' };
const jsonSchema = await getJsonSchema();
const { TruckBase, TruckCreate } = jsonSchema.components.schemas;

const TruckStatus = {
  OUT_OF_SERVICE: 'OUT_OF_SERVICE',
  LOADING: 'LOADING',
  TO_JOB: 'TO_JOB',
  AT_JOB: 'AT_JOB',
  RETURNING: 'RETURNING',
};
const TruckStatusWorkflow = {
  [TruckStatus.OUT_OF_SERVICE]: [
    TruckStatus.LOADING,
    TruckStatus.TO_JOB,
    TruckStatus.AT_JOB,
    TruckStatus.RETURNING,
  ],
  [TruckStatus.LOADING]: [TruckStatus.OUT_OF_SERVICE, TruckStatus.TO_JOB],
  [TruckStatus.TO_JOB]: [TruckStatus.OUT_OF_SERVICE, TruckStatus.AT_JOB],
  [TruckStatus.AT_JOB]: [TruckStatus.OUT_OF_SERVICE, TruckStatus.RETURNING],
  [TruckStatus.RETURNING]: [TruckStatus.OUT_OF_SERVICE, TruckStatus.LOADING],
};

function convertSchemaValidatorErrors(errors) {
  return errors.filter((err) => err.name !== 'allOf').reduce((acc, it) => {
    const property = it.path.length ? it.path.pop() : it.argument;
    acc[property] = it.name.toUpperCase();
    return acc;
  }, {});
}

function isTruckCodeUnique(code, table) {
  return !table.find({ code }).value();
}

function isTruckStatusTransitionValid(current, next) {
  if (current === next) {
    return true;
  }

  return TruckStatusWorkflow[current].includes(next);
}

export function validateTruckCreate(truck, table) {
  const res = new Validator().validate(truck, TruckCreate);
  if (!res.valid) {
    return convertSchemaValidatorErrors(res.errors);
  }

  if (!isTruckCodeUnique(truck.code, table)) {
    return { code: ErrorCode.NOT_UNIQUE };
  }

  return void 0;
}

export function validateTruckUpdate(id, truck, table) {
  const _id = typeof id === 'number' ? id : parseInt(id);
  if (_id.toString() !== id.toString()) {
    return;
  }
  const existing = table.find({ id: _id }).value();
  if (!existing) {
    return;
  }

  const res = new Validator().validate(truck, TruckBase);
  if (!res.valid) {
    return convertSchemaValidatorErrors(res.errors);
  }

  const { code, status } = truck;

  if (code && existing.code !== code && !isTruckCodeUnique(code, table)) {
    return { code: ErrorCode.NOT_UNIQUE };
  }

  if (status && !isTruckStatusTransitionValid(existing.status, status)) {
    return { status: ErrorCode.INVALID_OPERATION };
  }

  return void 0;
}
