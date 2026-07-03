export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          category: string;
          status: "draft" | "published";
          author: string;
          featured_image: string | null;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug?: string;
          content: string;
          excerpt?: string | null;
          category: string;
          status?: "draft" | "published";
          author: string;
          featured_image?: string | null;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          category?: string;
          status?: "draft" | "published";
          author?: string;
          featured_image?: string | null;
          published_at?: string | null;
        };
      };
      timeline_events: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          year: string;
          category: string;
          title: string;
          description: string;
          filter: string;
          images: Json[] | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          year: string;
          category: string;
          title: string;
          description: string;
          filter: string;
          images?: Json[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          year?: string;
          category?: string;
          title?: string;
          description?: string;
          filter?: string;
          images?: Json[] | null;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          src: string;
          alt: string;
          tag: string;
          title: string;
          filter: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          src: string;
          alt: string;
          tag: string;
          title: string;
          filter: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          src?: string;
          alt?: string;
          tag?: string;
          title?: string;
          filter?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          category: string;
          status: "new" | "read" | "resolved";
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          category: string;
          status?: "new" | "read" | "resolved";
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          category?: string;
          status?: "new" | "read" | "resolved";
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
