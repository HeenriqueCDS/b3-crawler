import { ScheduledHandler } from 'aws-lambda'

export const handler: ScheduledHandler = (event) => {
  console.log('SCHEDULED_IMPORTER')
  // Verificar quantos registros existem no banco
  // Buscar a partir dos registros existentes
}
