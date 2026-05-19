import { ProductRepositoryImpl } from '@/data/repositories/product-repository.impl'
import { CategoryRepositoryImpl } from '@/data/repositories/category-repository.impl'
import { CartRepositoryImpl } from '@/data/repositories/cart-repository.impl'
import { RfqRepositoryImpl } from '@/data/repositories/rfq-repository.impl'
import { AiRepositoryImpl } from '@/data/repositories/ai-repository.impl'

import {
  GetProducts,
  GetProductById,
  GetRelatedProducts,
  SearchProducts,
} from '@/domain/usecases/product-usecases'
import {
  GetCategories,
  GetCategoryTree,
  GetCategoryBySlug,
} from '@/domain/usecases/category-usecases'
import {
  GetCart,
  AddToCart,
  UpdateCartItem,
  RemoveFromCart,
  ClearCart,
} from '@/domain/usecases/cart-usecases'
import {
  GetRfqs,
  GetRfqById,
  CreateRfq,
  SubmitRfq,
  GetRfqQuotations,
  AcceptQuotation,
  RejectQuotation,
} from '@/domain/usecases/rfq-usecases'
import {
  GetAiSuggestions,
  FindAlternatives,
  AnalyzeRfq,
} from '@/domain/usecases/ai-usecases'

const productRepository = new ProductRepositoryImpl()
const categoryRepository = new CategoryRepositoryImpl()
const cartRepository = new CartRepositoryImpl()
const rfqRepository = new RfqRepositoryImpl()
const aiRepository = new AiRepositoryImpl()

export const useCases = {
  products: {
    getAll: new GetProducts(productRepository),
    getById: new GetProductById(productRepository),
    getRelated: new GetRelatedProducts(productRepository),
    search: new SearchProducts(productRepository),
  },
  categories: {
    getAll: new GetCategories(categoryRepository),
    getTree: new GetCategoryTree(categoryRepository),
    getBySlug: new GetCategoryBySlug(categoryRepository),
  },
  cart: {
    get: new GetCart(cartRepository),
    add: new AddToCart(cartRepository),
    update: new UpdateCartItem(cartRepository),
    remove: new RemoveFromCart(cartRepository),
    clear: new ClearCart(cartRepository),
  },
  rfqs: {
    getAll: new GetRfqs(rfqRepository),
    getById: new GetRfqById(rfqRepository),
    create: new CreateRfq(rfqRepository),
    submit: new SubmitRfq(rfqRepository),
    getQuotations: new GetRfqQuotations(rfqRepository),
    acceptQuotation: new AcceptQuotation(rfqRepository),
    rejectQuotation: new RejectQuotation(rfqRepository),
  },
  ai: {
    getSuggestions: new GetAiSuggestions(aiRepository),
    findAlternatives: new FindAlternatives(aiRepository),
    analyzeRfq: new AnalyzeRfq(aiRepository),
  },
} as const
