import { knightsService } from '../services/KnightsService'
import BaseController from '../utils/BaseController'

export class KnightsController extends BaseController {
  constructor() {
    super('api/knights')
    this.router
      .get('', this.getAll)
      // NOTE by adding a ':' before a word, that word becomes a variable, whatever value is in that position
      // in the URL becomes the value of that variable
      .get('/:id', this.getByID)
      .post('', this.create)
      .delete('/:id', this.delete)
      .put('/:id', this.edit)
  }

  // all express route handles get: req, res, next
  getAll(req, res, next) {
    try {
      const knights = knightsService.getAll()
      res.send(knights)
    } catch (error) {
      next(error)
    }
  }

  getByID(req, res, next) {
    try {
      const knight = knightsService.getById(req.params.id)
      res.send(knight)
    } catch (error) {
      next(error)
    }
  }

  create(req, res, next) {
    try {
      // NOTE data sent to the server on posts and puts is added to the body (req.body)
      const knights = knightsService.create(req.body)
      res.send(knights)
    } catch (error) {
      next(error)
    }
  }

  delete(req, res, next) {
    try {
      knightsService.delete(req.params.id)
      res.send('delorted')
    } catch (error) {
      next(error)
    }
  }

  edit(req, res, next) {
    try {
      // NOTE I don't care what id you put in the body im pulling url
      req.body.id = req.params.id
      const knight = knightsService.edit(req.body)
      res.send(knight)
    } catch (error) {
      next(error)
    }
  }
}
