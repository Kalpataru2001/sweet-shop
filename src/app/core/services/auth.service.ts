import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);

  constructor(private router: Router) {
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    // Listen for changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.currentUser.set(session.user);
      } else {
        this.currentUser.set(null);
      }
    });
  }

  // 🟢 NEW: Guard calls this to WAIT for the check
  async checkAuth(): Promise<boolean> {
    const { data } = await this.supabase.auth.getUser();
    if (data.user) {
      this.currentUser.set(data.user);
      return true; // Logged in!
    }
    return false; // Not logged in
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }
  
  // Keep this for simple checks in templates
  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}