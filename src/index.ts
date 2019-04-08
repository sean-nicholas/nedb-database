import * as Datastore from 'nedb'
import { UpdateOptions, RemoveOptions } from 'nedb'

export type Query<T> = Partial<T> & {
  [prop: string]: any
}

export interface DatabaseOptions<T> {
  filename: string
}

export interface InitialValues<T> {
  query: Query<T>,
  value: T
}

export class Database<T> {
  constructor(protected options: DatabaseOptions<T>) {
    this.db = new Datastore({
      filename: options.filename,
      autoload: true
    })
  }

  db: Datastore

  protected async initSingleDoc(query: Query<T>, doc: T) {
    const dbDoc = await this.findOne(query)
    if (!dbDoc) {
      await this.insert(doc)
    }
  }

  async init(initialValues: InitialValues<T>[]) {
    await Promise.all(
      initialValues.map(iv => this.initSingleDoc(iv.query, iv.value))
    )
  }

  insert(doc: T): Promise<T> {
    return new Promise((res, rej) => {
      this.db.insert(doc, function (err, newDoc) {
        if (err) return rej(err)
        res(newDoc)
      })
    })
  }

  find(query: Query<T>): Promise<T[]> {
    return new Promise((res, rej) => {
      this.db.find(query, function (err, docs) {
        if (err) return rej(err)
        res(docs)
      })
    })
  }

  findOne(query: Query<T>): Promise<T> {
    return new Promise((res, rej) => {
      this.db.findOne(query, function (err, doc) {
        if (err) return rej(err)
        res(doc as T)
      })
    })
  }

  count(query: Query<T>): Promise<number> {
    return new Promise((res, rej) => {
      this.db.count(query, function (err, amount) {
        if (err) return rej(err)
        res(amount)
      })
    })
  }

  update(query: Query<T>, update: Partial<T>, options: UpdateOptions = {}): Promise<number> {
    return new Promise((res, rej) => {
      this.db.update(query, update, options, function (err, numAffected) {
        if (err) return rej(err)
        res(numAffected)
      })
    })
  }

  remove(query: Query<T>, options?: RemoveOptions): Promise<number> {
    return new Promise((res, rej) => {
      this.db.remove(query, options, function (err, numRemoved) {
        if (err) return rej(err)
        res(numRemoved)
      })
    })
  }
}