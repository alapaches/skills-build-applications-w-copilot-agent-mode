import { Router } from 'express';
import { isValidObjectId, type Model } from 'mongoose';

export function createResourceRouter<T>(model: Model<T>, sort?: Record<string, 1 | -1>) {
  const router = Router();

  router.get('/', async (_request, response) => {
    const records = await model.find().sort(sort ?? {}).exec();
    response.json(records);
  });

  router.get('/:id', async (request, response) => {
    const { id } = request.params;
    if (!isValidObjectId(id)) {
      response.status(400).json({ error: 'Invalid record id' });
      return;
    }

    const record = await model.findById(id).exec();
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }

    response.json(record);
  });

  router.post('/', async (request, response) => {
    if (!isRecord(request.body)) {
      response.status(400).json({ error: 'Request body must be a JSON object' });
      return;
    }

    const record = await model.create(request.body);
    response.status(201).json(record);
  });

  router.patch('/:id', async (request, response) => {
    const { id } = request.params;
    if (!isValidObjectId(id)) {
      response.status(400).json({ error: 'Invalid record id' });
      return;
    }
    if (!isRecord(request.body)) {
      response.status(400).json({ error: 'Request body must be a JSON object' });
      return;
    }

    const record = await model
      .findByIdAndUpdate(id, request.body, { new: true, runValidators: true })
      .exec();
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }

    response.json(record);
  });

  router.delete('/:id', async (request, response) => {
    const { id } = request.params;
    if (!isValidObjectId(id)) {
      response.status(400).json({ error: 'Invalid record id' });
      return;
    }

    const record = await model.findByIdAndDelete(id).exec();
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }

    response.status(204).end();
  });

  return router;
}

function isRecord(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
