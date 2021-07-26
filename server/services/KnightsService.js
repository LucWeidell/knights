import { fakeDb } from '../models/fakeDb'
import { BadRequest } from '../utils/Errors'

class KnightsService {

  getAll() {
    return fakeDb.knights
  }

  getById(id) {
    const knight = fakeDb.knights.find(k => k.id.toString() === id)
    if (!knight) {
      throw new BadRequest('Invalid Knight ID')
    }
    return knight
  }

  create(body) {
    fakeDb.knights.push(body)
    return body
  }

  delete(id) {
    let index = fakeDb.knights.findIndex(k => k.id.toString() === id)
    if (index === -1) {
      throw BadRequest('Invalid Index')
    }
    fakeDb.knights.splice(index, 1)
  }

  edit(body) {
    // const old = this.getById(body.id)
    // for (const key in body) {
    //   old[key] = body[key]
    // }
    let old = this.getById(body.id)
    old = { ...old, ...body }
    this.delete(old.id)
    fakeDb.knights.push(old)
    return old
    // tomorrow
    // let knight = dbContext.knight.findOneAndUpdate({_id: body.id}, body)
  }
}

export const knightsService = new KnightsService()
