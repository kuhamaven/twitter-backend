import { SwaggerDefinition, Options } from 'swagger-jsdoc'
import { Constants } from '@utils'

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Twitter Backend',
    version: '1.0.0',
    description: 'API documentation for the Twitter Backend project'
  },
  servers: [
    {
      url: 'http://localhost:' + Constants.PORT,
      description: 'Development server'
    }
  ]
}

const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ['./**/*.ts'] // Scan all TypeScript files in the src directory
}

export default swaggerOptions
