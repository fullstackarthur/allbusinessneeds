import { SupabaseAuthRepository } from '@/data/repositories/supabase-auth-repository'
import type { ProfileDto } from '@/data/repositories/supabase-auth-repository'

export class SignUp {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(email: string, password: string, name: string, businessName: string) {
    return this.repository.signUp(email, password, name, businessName)
  }
}

export class SignIn {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(email: string, password: string) {
    return this.repository.signIn(email, password)
  }
}

export class SignOut {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute() {
    return this.repository.signOut()
  }
}

export class GetSession {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute() {
    return this.repository.getSession()
  }
}

export class GetCurrentUser {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute() {
    return this.repository.getCurrentUser()
  }
}

export class GetProfile {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(userId: string): Promise<ProfileDto | null> {
    return this.repository.getProfile(userId)
  }
}

export class GetAllProfiles {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(): Promise<ProfileDto[]> {
    return this.repository.getAllProfiles()
  }
}

export class UpdateProfileStatus {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(userId: string, status: 'approved' | 'rejected') {
    return this.repository.updateProfileStatus(userId, status)
  }
}

export class LogVisit {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(userId: string | null, path: string, productId?: string) {
    return this.repository.logVisit(userId, path, productId)
  }
}

export class GetVisitCount {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(fromDate?: string) {
    return this.repository.getVisitCount(fromDate)
  }
}

export class GetTopProducts {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(limit = 10) {
    return this.repository.getTopProducts(limit)
  }
}

export class GetAdminUser {
  repository: SupabaseAuthRepository

  constructor(repository: SupabaseAuthRepository) {
    this.repository = repository
  }

  async execute(email: string) {
    return this.repository.getAdminUser(email)
  }
}
