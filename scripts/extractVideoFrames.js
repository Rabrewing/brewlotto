#!/usr/bin/env node

import { existsSync, mkdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

function printUsage() {
  console.log(`Usage:
  node scripts/extractVideoFrames.js <input.mp4> [output-dir] [frame-count]

Examples:
  node scripts/extractVideoFrames.js public/landing/brewlotto-cta.mp4 tmp/brewlotto-cta 12
  node scripts/extractVideoFrames.js public/landing/brewlotto-cta.mp4
`);
}

function resolveBinary(name) {
  const pathEnv = process.env.PATH || '';
  for (const directory of pathEnv.split(':')) {
    const candidate = join(directory, name);
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' });
}

function getDurationSeconds(ffprobePath, inputPath) {
  const output = execFileSync(
    ffprobePath,
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      inputPath,
    ],
    { encoding: 'utf8' },
  ).trim();

  const duration = Number.parseFloat(output);
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Unable to read a valid duration from ${inputPath}`);
  }

  return duration;
}

function padIndex(index, total) {
  const digits = Math.max(2, String(total).length);
  return String(index).padStart(digits, '0');
}

const [, , inputArg, outputArg, countArg] = process.argv;

if (!inputArg || inputArg === '--help' || inputArg === '-h') {
  printUsage();
  process.exit(inputArg ? 0 : 1);
}

const inputPath = inputArg;
if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const ffmpegPath = resolveBinary('ffmpeg');
const ffprobePath = resolveBinary('ffprobe');

if (!ffmpegPath || !ffprobePath) {
  console.error('ffmpeg and ffprobe are required but were not found on PATH.');
  console.error('Install ffmpeg, then rerun this script.');
  process.exit(1);
}

const frameCount = Math.max(1, Number.parseInt(countArg || '12', 10) || 12);
const baseName = basename(inputPath, extname(inputPath));
const outputDir = outputArg || join('tmp', 'video-frames', baseName);
mkdirSync(outputDir, { recursive: true });

const duration = getDurationSeconds(ffprobePath, inputPath);
const sampleTimes = Array.from({ length: frameCount }, (_, index) => {
  const time = ((index + 0.5) / frameCount) * duration;
  return Math.min(Math.max(time, 0), Math.max(duration - 0.1, 0));
});

console.log(`Input: ${inputPath}`);
console.log(`Duration: ${duration.toFixed(2)}s`);
console.log(`Frames: ${frameCount}`);
console.log(`Output: ${outputDir}`);

for (const [index, time] of sampleTimes.entries()) {
  const outputFile = join(outputDir, `frame-${padIndex(index + 1, frameCount)}.png`);
  console.log(`Capturing ${outputFile} at ${time.toFixed(2)}s`);
  run(ffmpegPath, [
    '-hide_banner',
    '-loglevel',
    'error',
    '-ss',
    time.toFixed(3),
    '-i',
    inputPath,
    '-frames:v',
    '1',
    '-vf',
    'scale=1280:-1',
    outputFile,
  ]);
}

const contactSheet = join(outputDir, 'contact-sheet.png');
const gridCols = Math.max(3, Math.ceil(Math.sqrt(frameCount)));
const gridRows = Math.max(2, Math.ceil(frameCount / gridCols));

run(ffmpegPath, [
  '-hide_banner',
  '-loglevel',
  'error',
  '-i',
  inputPath,
  '-vf',
  `fps=${Math.max(frameCount / duration, 0.2).toFixed(3)},scale=640:-1,tile=${gridCols}x${gridRows}`,
  '-frames:v',
  '1',
  contactSheet,
]);

console.log(`Contact sheet: ${contactSheet}`);
