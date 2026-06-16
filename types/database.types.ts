export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      claims: {
        Row: {
          claim_impact_score: number
          claim_title: string | null
          claim_type: Database["public"]["Enums"]["claimtype"] | null
          created_at: string
          description: string
          id: string
          pr_url: string
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verificationstatus"]
            | null
          verifier_count: number | null
          visibility_level: Database["public"]["Enums"]["accountmode"] | null
        }
        Insert: {
          claim_impact_score: number
          claim_title?: string | null
          claim_type?: Database["public"]["Enums"]["claimtype"] | null
          created_at?: string
          description: string
          id?: string
          pr_url: string
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verificationstatus"]
            | null
          verifier_count?: number | null
          visibility_level?: Database["public"]["Enums"]["accountmode"] | null
        }
        Update: {
          claim_impact_score?: number
          claim_title?: string | null
          claim_type?: Database["public"]["Enums"]["claimtype"] | null
          created_at?: string
          description?: string
          id?: string
          pr_url?: string
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verificationstatus"]
            | null
          verifier_count?: number | null
          visibility_level?: Database["public"]["Enums"]["accountmode"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_users"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pr_table: {
        Row: {
          additions: number | null
          body: string | null
          changed_files_count: number | null
          deletions: number | null
          evidences: string[] | null
          file_changes: string[] | null
          id: string
          issue_url: string | null
          merged_at: string | null
          pr_created_at: string | null
          pr_updated_at: string | null
          pr_url: string | null
          reviews: string[] | null
        }
        Insert: {
          additions?: number | null
          body?: string | null
          changed_files_count?: number | null
          deletions?: number | null
          evidences?: string[] | null
          file_changes?: string[] | null
          id?: string
          issue_url?: string | null
          merged_at?: string | null
          pr_created_at?: string | null
          pr_updated_at?: string | null
          pr_url?: string | null
          reviews?: string[] | null
        }
        Update: {
          additions?: number | null
          body?: string | null
          changed_files_count?: number | null
          deletions?: number | null
          evidences?: string[] | null
          file_changes?: string[] | null
          id?: string
          issue_url?: string | null
          merged_at?: string | null
          pr_created_at?: string | null
          pr_updated_at?: string | null
          pr_url?: string | null
          reviews?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "pr_table_pr_url_fkey"
            columns: ["pr_url"]
            isOneToOne: true
            referencedRelation: "claims"
            referencedColumns: ["pr_url"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          maintainer_id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          filters: Json
          id?: string
          maintainer_id: string
          name: string
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          maintainer_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_maintainer_id_fkey"
            columns: ["maintainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          filters: Json
          id: string
          maintainer_id: string
          searched_at: string | null
        }
        Insert: {
          filters: Json
          id?: string
          maintainer_id: string
          searched_at?: string | null
        }
        Update: {
          filters?: Json
          id?: string
          maintainer_id?: string
          searched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_history_maintainer_id_fkey"
            columns: ["maintainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlist_contributors: {
        Row: {
          added_at: string | null
          contributor_id: string
          id: string
          note: string | null
          shortlist_id: string
        }
        Insert: {
          added_at?: string | null
          contributor_id: string
          id?: string
          note?: string | null
          shortlist_id: string
        }
        Update: {
          added_at?: string | null
          contributor_id?: string
          id?: string
          note?: string | null
          shortlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlist_contributors_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shortlist_contributors_shortlist_id_fkey"
            columns: ["shortlist_id"]
            isOneToOne: false
            referencedRelation: "shortlists"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlists: {
        Row: {
          created_at: string | null
          id: string
          maintainer_id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          maintainer_id: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          maintainer_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlists_maintainer_id_fkey"
            columns: ["maintainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_mode: Database["public"]["Enums"]["accountmode"] | null
          bio: string | null
          company_name: string | null
          created_at: string
          ecosystem: string[] | null
          email: string | null
          email_confirmed_at: string | null
          github_access_token: string | null
          github_avatar_url: string | null
          github_connected: boolean | null
          github_username: string | null
          headline: string | null
          id: string
          isactive: boolean
          isRemote: boolean | null
          ivkey: string | null
          languages: string[] | null
          location: string | null
          onboarding_complete: boolean | null
          onboarding_step: number | null
          role: Database["public"]["Enums"]["role"] | null
          techstack: string[] | null
          token: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          account_mode?: Database["public"]["Enums"]["accountmode"] | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          ecosystem?: string[] | null
          email?: string | null
          email_confirmed_at?: string | null
          github_access_token?: string | null
          github_avatar_url?: string | null
          github_connected?: boolean | null
          github_username?: string | null
          headline?: string | null
          id?: string
          isactive?: boolean
          isRemote?: boolean | null
          ivkey?: string | null
          languages?: string[] | null
          location?: string | null
          onboarding_complete?: boolean | null
          onboarding_step?: number | null
          role?: Database["public"]["Enums"]["role"] | null
          techstack?: string[] | null
          token?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          account_mode?: Database["public"]["Enums"]["accountmode"] | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          ecosystem?: string[] | null
          email?: string | null
          email_confirmed_at?: string | null
          github_access_token?: string | null
          github_avatar_url?: string | null
          github_connected?: boolean | null
          github_username?: string | null
          headline?: string | null
          id?: string
          isactive?: boolean
          isRemote?: boolean | null
          ivkey?: string | null
          languages?: string[] | null
          location?: string | null
          onboarding_complete?: boolean | null
          onboarding_step?: number | null
          role?: Database["public"]["Enums"]["role"] | null
          techstack?: string[] | null
          token?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      verifications: {
        Row: {
          claim_Id: string
          codebase_impact: number | null
          collaboration_quality: number | null
          created_at: string | null
          descriptions: string | null
          id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["verificationstatus"]
          technical_complexity: number | null
          token: string | null
          updated_at: string | null
          user_id: string
          verifier_email: string | null
          would_recommend: boolean | null
        }
        Insert: {
          claim_Id: string
          codebase_impact?: number | null
          collaboration_quality?: number | null
          created_at?: string | null
          descriptions?: string | null
          id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["verificationstatus"]
          technical_complexity?: number | null
          token?: string | null
          updated_at?: string | null
          user_id: string
          verifier_email?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          claim_Id?: string
          codebase_impact?: number | null
          collaboration_quality?: number | null
          created_at?: string | null
          descriptions?: string | null
          id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["verificationstatus"]
          technical_complexity?: number | null
          token?: string | null
          updated_at?: string | null
          user_id?: string
          verifier_email?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_claim_Id_fkey"
            columns: ["claim_Id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: { Args: never; Returns: string }
    }
    Enums: {
      accountmode: "PUBLIC" | "PRIVATE"
      claimtype:
        | "BUG FIX"
        | "FEATURE"
        | "PERFORMANCE"
        | "REFACTOR"
        | "DOCUMENTATION"
        | "MENTORING"
      emailverifierstatus: "PENDING" | "EXPIRED" | "VERIFIED"
      role: "ADMIN" | "CONTRIBUTOR" | "VERIFIER" | "MAINTAINER"
      verificationstatus: "PENDING" | "ACCEPT" | "DECLINED" | "EXPIRED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      accountmode: ["PUBLIC", "PRIVATE"],
      claimtype: [
        "BUG FIX",
        "FEATURE",
        "PERFORMANCE",
        "REFACTOR",
        "DOCUMENTATION",
        "MENTORING",
      ],
      emailverifierstatus: ["PENDING", "EXPIRED", "VERIFIED"],
      role: ["ADMIN", "CONTRIBUTOR", "VERIFIER", "MAINTAINER"],
      verificationstatus: ["PENDING", "ACCEPT", "DECLINED", "EXPIRED"],
    },
  },
} as const
