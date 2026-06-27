import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))

export const runtimeServerRoot = resolve(currentDir, '..')
export const projectRoot = resolve(runtimeServerRoot, '..')
export const generatedDir = join(projectRoot, 'workbench', 'public', 'generated')
export const runtimeStoreDir = join(projectRoot, 'runtime_store')
export const gatewayStoreDir = join(runtimeStoreDir, 'gateway')
export const gatewayDbPath = join(gatewayStoreDir, 'gateway.sqlite')

