const { Queue } = require('bullmq');
const { redisConnection } = require('./redis');

const QUEUE_NAME = 'ai-content-pipeline-imkt3';

const pipelineQueue = new Queue(QUEUE_NAME, { connection: redisConnection });

module.exports = { pipelineQueue, QUEUE_NAME };
