import type { Rfq, Quotation } from '@/domain/entities'
import type { RfqRepository } from '@/domain/repositories/rfq-repository'
import { httpClient } from '@/core/http/client'
import { RfqMapper, QuotationMapper } from '@/data/mappers'
import type { RfqDto, QuotationDto } from '@/data/dtos'

const RFQS_ENDPOINT = '/rfqs'

export class RfqRepositoryImpl implements RfqRepository {
  async getAll(): Promise<Rfq[]> {
    const response = await httpClient.get<RfqDto[]>(RFQS_ENDPOINT)
    return response.data.map(RfqMapper.toEntity)
  }

  async getById(id: string): Promise<Rfq> {
    const response = await httpClient.get<RfqDto>(`${RFQS_ENDPOINT}/${id}`)
    return RfqMapper.toEntity(response.data)
  }

  async create(rfq: Omit<Rfq, 'id' | 'reference' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Rfq> {
    const response = await httpClient.post<RfqDto>(RFQS_ENDPOINT, {
      items: rfq.items,
      notes: rfq.notes,
    })
    return RfqMapper.toEntity(response.data)
  }

  async update(id: string, updates: Partial<Rfq>): Promise<Rfq> {
    const response = await httpClient.patch<RfqDto>(`${RFQS_ENDPOINT}/${id}`, updates)
    return RfqMapper.toEntity(response.data)
  }

  async submit(id: string): Promise<Rfq> {
    const response = await httpClient.post<RfqDto>(`${RFQS_ENDPOINT}/${id}/submit`)
    return RfqMapper.toEntity(response.data)
  }

  async getQuotations(rfqId: string): Promise<Quotation[]> {
    const response = await httpClient.get<QuotationDto[]>(`${RFQS_ENDPOINT}/${rfqId}/quotations`)
    return response.data.map(QuotationMapper.toEntity)
  }

  async acceptQuotation(quotationId: string): Promise<Quotation> {
    const response = await httpClient.post<QuotationDto>(`/quotations/${quotationId}/accept`)
    return QuotationMapper.toEntity(response.data)
  }

  async rejectQuotation(quotationId: string): Promise<Quotation> {
    const response = await httpClient.post<QuotationDto>(`/quotations/${quotationId}/reject`)
    return QuotationMapper.toEntity(response.data)
  }
}
