import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { json } from 'body-parser'
import { RegisterControllers, Paths } from '../Setup'
import { logger } from './utils/Logger'

export default class Startup {
  static ConfigureGlobalMiddleware(app) {
    // NOTE Configure and Register Middleware
    Startup.configureCors(app)
    // PRevent hacky data
    app.use(helmet({
      contentSecurityPolicy: false
    }))
    // This is the translator: if over 50mb i give up
    app.use(json({ limit: '50mb' }))
  }

  static configureCors(app) {
    // Right now you dont allow anyone to connect to the port, or 8080 ex.: 'https://localhost:8080''
    const allowedDomains = []
    const corsOptions = {
      origin(origin, callback) {
        // If running in dev mode anyone can call
        if (process.env.NODE_ENV === 'dev') {
          return callback(null, true)
        }
        const originIsWhitelisted = allowedDomains.indexOf(origin) !== -1
        callback(null, originIsWhitelisted)
      },
      credentials: true
    }

    app.use(cors(corsOptions))
  }

  static ConfigureRoutes(app) {
    const router = express.Router()
    // Register all controllers to main hallway since that are all api/(controllerHER)
    RegisterControllers(router)
    app.use(router)

    // This all get wrapped into 3000, so one port / bcw serve
    app.use('', express.static(Paths.Public))
    Startup.registerErrorHandlers(app)
  }

  static registerErrorHandlers(app) {
    // NOTE SEND 404 for any unknown routes (if no error)
    app.use(
      '*',
      (_, res, next) => {
        res.status(404)
        next()
      },
      express.static(Paths.Public + '404')
    )
    // NOTE Default Error Handler (give error cause it has it)
    app.use((error, req, res, next) => {
      if (!error.status) {
        error.status = 400
      }
      if (error.status === 500) {
        logger.error(error)
      }
      res.status(error.status).send({ error: error.toString(), url: req.url })
    })
  }
}
