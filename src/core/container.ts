import { SupabaseProductRepository } from '@/data/repositories/supabase-product-repository'
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category-repository'
import { LocalStorageCartRepository } from '@/data/repositories/cart-repository.local'
import { RfqRepositoryImpl } from '@/data/repositories/rfq-repository.impl'
import { AiRepositoryImpl } from '@/data/repositories/ai-repository.impl'
import { SupabaseAuthRepository } from '@/data/repositories/supabase-auth-repository'

import {
  GetProducts,
  GetProductById,
  GetRelatedProducts,
  SearchProducts,
  GetRandomProducts,
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
  AiChat,
  AiAnalyzeProduct,
  AiSuggestComplementary,
} from '@/domain/usecases/ai-usecases'
import {
  SignUp,
  SignIn,
  SignOut,
  GetSession,
  GetCurrentUser,
  GetProfile,
  GetAllProfiles,
  UpdateProfileStatus,
  LogVisit,
  GetVisitCount,
  GetTopProducts,
  GetAdminUser,
} from '@/domain/usecases/auth-usecases'

const productRepository = new SupabaseProductRepository()
const categoryRepository = new SupabaseCategoryRepository()
const cartRepository = new LocalStorageCartRepository()
const rfqRepository = new RfqRepositoryImpl()
const aiRepository = new AiRepositoryImpl()
const authRepository = new SupabaseAuthRepository()

export const useCases = {
  products: {
    getAll: new GetProducts(productRepository),
    getById: new GetProductById(productRepository),
    getRelated: new GetRelatedProducts(productRepository),
    search: new SearchProducts(productRepository),
    getRandom: new GetRandomProducts(productRepository),
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
    chat: new AiChat(aiRepository),
    analyzeProduct: new AiAnalyzeProduct(aiRepository),
    suggestComplementary: new AiSuggestComplementary(aiRepository),
  },
  auth: {
    signUp: new SignUp(authRepository),
    signIn: new SignIn(authRepository),
    signOut: new SignOut(authRepository),
    getSession: new GetSession(authRepository),
    getCurrentUser: new GetCurrentUser(authRepository),
    getProfile: new GetProfile(authRepository),
    getAllProfiles: new GetAllProfiles(authRepository),
    updateProfileStatus: new UpdateProfileStatus(authRepository),
    logVisit: new LogVisit(authRepository),
    getVisitCount: new GetVisitCount(authRepository),
    getTopProducts: new GetTopProducts(authRepository),
    getAdminUser: new GetAdminUser(authRepository),
  },
} as const
