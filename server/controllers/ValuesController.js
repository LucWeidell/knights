import BaseController from '../utils/BaseController'
import { valuesService } from '../services/ValueService'

// NOTE the name must match the filename
export class ValuesController extends BaseController {
  constructor() {
    // NOTE The string within super is the name on the door, oe this controllers mount path
    super('api/values')
    this.router
      // NOTE inner doors after the mount path
      // starting the request type, then the extension path, then them methos to run
      .get('', this.getAll)
      .post('', this.create)
  }

  /**
   * Sends found values to a client by request
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  async getAll(req, res, next) {
    // NOTE every request has 3 things:
    // 1) req = Request (aka the knight)
    // 2) res = Response (aka the portal you return the knight through)
    // 3) next = Next (Send the knight back into the request hall)
    try {
      const values = await valuesService.find()
      return res.send(values)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a value from request body and returns it
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  async create(req, res, next) {
    try {
      const value = await valuesService.create(req.body)
      res.send(value)
    } catch (error) {
      next(error)
    }
  }
}
