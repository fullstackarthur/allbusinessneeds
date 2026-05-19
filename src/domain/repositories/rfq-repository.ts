import type { Rfq, Quotation } from '@/domain/entities'

export interface RfqRepository {
  getAll(): Promise<Rfq[]>
  getById(id: string): Promise<Rfq>
  create(rfq: Omit<Rfq, 'id' | 'reference' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Rfq>
  update(id: string, updates: Partial<Rfq>): Promise<Rfq>
  submit(id: string): Promise<Rfq>
  getQuotations(rfqId: string): Promise<Quotation[]>
  acceptQuotation(quotationId: string): Promise<Quotation>
  rejectQuotation(quotationId: string): Promise<Quotation>
}
