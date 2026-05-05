const { Queue } = require('bullmq');
const { redisConnection } = require('./redis');

const QUEUE_NAME = 'ai-content-pipeline-imkt4';

const pipelineQueue = new Queue(QUEUE_NAME, { connection: redisConnection });

module.exports = { pipelineQueue, QUEUE_NAME };
