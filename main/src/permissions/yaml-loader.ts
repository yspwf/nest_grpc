import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export function loadYaml<T>(filename: string): T {
  const fullPath = join(process.cwd(), 'src', 'config', filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return yaml.load(fileContents) as T;
}