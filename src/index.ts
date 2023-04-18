import config from './config.json'
import { ExtendedClient } from './structs/ExtendedClient'
export * from 'colors'
export { client, config }

const client = new ExtendedClient()
client.start()
