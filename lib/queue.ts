import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const transcriptionQueue = new Queue('transcribeQueue', {
  connection: redisConnection,
});
