// Tipos de la base de datos — Etapa 2 + Etapa 3
// Formato compatible con @supabase/supabase-js v2
export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          user_id: string
          name: string
          file_path: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          file_path: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          file_path?: string
          created_at?: string
        }
        Relationships: []
      }
      chunks: {
        Row: {
          id: string
          document_id: string
          content: string
          embedding: number[] | null
          chunk_index: number
        }
        Insert: {
          id?: string
          document_id: string
          content: string
          embedding?: number[] | null
          chunk_index: number
        }
        Update: {
          id?: string
          document_id?: string
          content?: string
          embedding?: number[] | null
          chunk_index?: number
        }
        Relationships: [
          {
            foreignKeyName: 'chunks_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
        ]
      }
      conversations: {
        Row: {
          id: string
          document_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'conversations_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          sources: { id: string; content: string; chunk_index: number }[] | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          sources?: { id: string; content: string; chunk_index: number }[] | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          sources?: { id: string; content: string; chunk_index: number }[] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_chunks: {
        Args: {
          query_embedding: number[]
          target_document_id: string
          match_count?: number
        }
        Returns: {
          id: string
          content: string
          chunk_index: number
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type Chunk = Database['public']['Tables']['chunks']['Row']
export type ChunkInsert = Database['public']['Tables']['chunks']['Insert']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type ConversationInsert = Database['public']['Tables']['conversations']['Insert']
export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']

export type MatchChunksResult = Database['public']['Functions']['match_chunks']['Returns'][number]
