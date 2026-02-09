import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });
    }

    async uploadImage(file: File): Promise<string> {
        const timestamp = new Date().getTime();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, ''); // Remove weird characters
        const filePath = `${timestamp}_${cleanFileName}`;

        // 1. Upload the file
        const { data, error } = await this.supabase.storage
            .from('sweets') // Must match your bucket name
            .upload(filePath, file);

        if (error) {
            console.error('Upload Error:', error);
            throw new Error('Image upload failed');
        }

        // 2. Get the Public URL
        const { data: urlData } = this.supabase.storage
            .from('sweets')
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    }
}