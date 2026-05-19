import type { Rfq, Quotation } from '@/domain/entities'
import type { RfqRepository } from '@/domain/repositories/rfq-repository'

export class GetRfqs {
  repository: RfqRepository

  constructor(repository: RfqRepository) {
    this.repository = repository
  }

  async execute(): Promise<Rfq[]> {
    return this.repository.getAll()
  }
}

export class GetRfqById {
  repository: RfqRepository

  constructor(repository: RfqRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Rfq> {
    return this.repository.getById(id)
  }
}

export class CreateRfq {
  repository: RfqRepository

  constructor(repository: RfqRepository) {
    this.repository = repository
  }

  async execute(rfq: Omit<Rfq, 'id' | 'reference' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Rfq> {
    return this.repository.create(rfq)
  }
}

export class SubmitRfq {
  repository: RfqRepository

  constructor(repository: RfqRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Rfq> {
    return this.repository.submit(id)
  }
}

export class GetRfqQuotations {
  repository: RfqRepository

  constructor(repository: RfqRepository) {
    this.repository = repository
  }

  async execute(rfqId: string): Promise<Quotation[]> {
    return this.repository.getQuotations(rfqId)
  }
}

export class AcceptQuotation {
  repository: RfqRepository

  constructor(repository: RfqRepository) {
    this.repository = repository
  }

  async execute(quotationId: string): Promise<Quotation> {
    return this.repository.acceptQuotation(quotationId)
  }
}

export class RejectQuotation {
  repository: RfqRepository

  constructor(repository: RfqRepository) {
    this.repository = repository
  }

  async execute(quotationId: string): Promise<Quotation> {
    return this.repository.rejectQuotation(quotationId)
  }
}
