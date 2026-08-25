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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_campaigns: {
        Row: {
          budget: number | null
          campaign_name: string
          clicks: number | null
          conversions: number | null
          created_at: string | null
          end_date: string | null
          id: string
          impressions: number | null
          platform: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          campaign_name: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          impressions?: number | null
          platform: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          campaign_name?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          impressions?: number | null
          platform?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_loads: {
        Row: {
          agent_id: string
          base_amount: number
          commission_amount: number
          created_at: string
          customer_name: string
          customer_phone: string
          destination: string
          docket_id: string | null
          id: string
          load_details: string
          origin: string
          payment_status: string | null
          service_type: string
          status: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          base_amount: number
          commission_amount: number
          created_at?: string
          customer_name: string
          customer_phone: string
          destination: string
          docket_id?: string | null
          id?: string
          load_details: string
          origin: string
          payment_status?: string | null
          service_type: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          base_amount?: number
          commission_amount?: number
          created_at?: string
          customer_name?: string
          customer_phone?: string
          destination?: string
          docket_id?: string | null
          id?: string
          load_details?: string
          origin?: string
          payment_status?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_loads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_loads_docket_id_fkey"
            columns: ["docket_id"]
            isOneToOne: false
            referencedRelation: "dockets"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          address: string | null
          agent_code: string
          bank_details: Json | null
          commission_percentage: number
          company_name: string | null
          contact_person: string
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          payment_mode: string | null
          phone: string
          total_earnings: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          agent_code: string
          bank_details?: Json | null
          commission_percentage?: number
          company_name?: string | null
          contact_person: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          payment_mode?: string | null
          phone: string
          total_earnings?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          agent_code?: string
          bank_details?: Json | null
          commission_percentage?: number
          company_name?: string | null
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          payment_mode?: string | null
          phone?: string
          total_earnings?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      ai_chat_history: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          message: string
          response: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message: string
          response: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message?: string
          response?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_leads: {
        Row: {
          company_name: string
          confidence_score: number | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          industry: string | null
          lead_source: string | null
          notes: string | null
          phone: string | null
          potential_value: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_name: string
          confidence_score?: number | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          lead_source?: string | null
          notes?: string | null
          phone?: string | null
          potential_value?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          confidence_score?: number | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          lead_source?: string | null
          notes?: string | null
          phone?: string | null
          potential_value?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bids: {
        Row: {
          cargo_value: number | null
          contact_name: string
          contact_number: string
          created_at: string
          created_by: string | null
          detention_clause: string | null
          drop_landmark: string | null
          drop_pincode: string
          expected_rate: number | null
          id: string
          load_type: string
          loading_unloading_scope: string | null
          payment_terms: string | null
          pickup_landmark: string | null
          pickup_pincode: string
          special_preferences: string | null
          status: string
          vehicle_type: string
        }
        Insert: {
          cargo_value?: number | null
          contact_name: string
          contact_number: string
          created_at?: string
          created_by?: string | null
          detention_clause?: string | null
          drop_landmark?: string | null
          drop_pincode: string
          expected_rate?: number | null
          id?: string
          load_type: string
          loading_unloading_scope?: string | null
          payment_terms?: string | null
          pickup_landmark?: string | null
          pickup_pincode: string
          special_preferences?: string | null
          status?: string
          vehicle_type: string
        }
        Update: {
          cargo_value?: number | null
          contact_name?: string
          contact_number?: string
          created_at?: string
          created_by?: string | null
          detention_clause?: string | null
          drop_landmark?: string | null
          drop_pincode?: string
          expected_rate?: number | null
          id?: string
          load_type?: string
          loading_unloading_scope?: string | null
          payment_terms?: string | null
          pickup_landmark?: string | null
          pickup_pincode?: string
          special_preferences?: string | null
          status?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          category: string
          challenge: string
          created_at: string
          featured_image: string | null
          id: string
          is_published: boolean | null
          key_metrics: Json | null
          published_at: string | null
          region: string
          results: string
          slug: string
          solution: string
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          category: string
          challenge: string
          created_at?: string
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          key_metrics?: Json | null
          published_at?: string | null
          region: string
          results: string
          slug: string
          solution: string
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          category?: string
          challenge?: string
          created_at?: string
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          key_metrics?: Json | null
          published_at?: string | null
          region?: string
          results?: string
          slug?: string
          solution?: string
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string
          company_name: string
          email: string
          gst_number: string | null
          id: string
          logo_url: string | null
          phone_primary: string
          phone_secondary: string | null
          phone_tertiary: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string
          company_name?: string
          email?: string
          gst_number?: string | null
          id?: string
          logo_url?: string | null
          phone_primary?: string
          phone_secondary?: string | null
          phone_tertiary?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string
          company_name?: string
          email?: string
          gst_number?: string | null
          id?: string
          logo_url?: string | null
          phone_primary?: string
          phone_secondary?: string | null
          phone_tertiary?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          certificate_issued: boolean | null
          completed: boolean | null
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          certificate_issued?: boolean | null
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          certificate_issued?: boolean | null
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          duration_weeks: number
          enrolled_count: number | null
          features: string[] | null
          id: string
          is_active: boolean | null
          rating: number | null
          slug: string
          thumbnail_url: string | null
          title: string
          university_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          duration_weeks: number
          enrolled_count?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          slug: string
          thumbnail_url?: string | null
          title: string
          university_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          duration_weeks?: number
          enrolled_count?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          university_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      discount_requests: {
        Row: {
          approved_by: string | null
          created_at: string | null
          customer_name: string
          discount_percentage: number
          id: string
          order_value: number
          reason: string
          requested_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          customer_name: string
          discount_percentage: number
          id?: string
          order_value: number
          reason: string
          requested_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          customer_name?: string
          discount_percentage?: number
          id?: string
          order_value?: number
          reason?: string
          requested_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      docket_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          changes: Json
          docket_id: string
          id: string
          version: number
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          changes: Json
          docket_id: string
          id?: string
          version: number
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          changes?: Json
          docket_id?: string
          id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "docket_history_docket_id_fkey"
            columns: ["docket_id"]
            isOneToOne: false
            referencedRelation: "dockets"
            referencedColumns: ["id"]
          },
        ]
      }
      dockets: {
        Row: {
          advance_paid: number | null
          balance_due: number | null
          base_amount: number
          created_at: string
          created_by: string | null
          customer_address: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          declared_value: number | null
          delivery_date: string | null
          destination: string
          distance_km: number | null
          docket_number: string
          docket_type: Database["public"]["Enums"]["docket_type"]
          driver_name: string | null
          driver_phone: string | null
          gst_amount: number
          gst_percentage: number
          id: string
          is_deleted: boolean | null
          item_description: string | null
          notes: string | null
          origin: string
          payment_mode: string | null
          payment_status: string | null
          pickup_date: string
          quantity: number | null
          status: Database["public"]["Enums"]["shipment_status"] | null
          terms_conditions: string | null
          total_amount: number
          updated_at: string
          vehicle_number: string | null
          vehicle_type: string | null
          version: number | null
          volume_cbm: number | null
          weight_kg: number | null
        }
        Insert: {
          advance_paid?: number | null
          balance_due?: number | null
          base_amount: number
          created_at?: string
          created_by?: string | null
          customer_address: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          declared_value?: number | null
          delivery_date?: string | null
          destination: string
          distance_km?: number | null
          docket_number: string
          docket_type: Database["public"]["Enums"]["docket_type"]
          driver_name?: string | null
          driver_phone?: string | null
          gst_amount: number
          gst_percentage?: number
          id?: string
          is_deleted?: boolean | null
          item_description?: string | null
          notes?: string | null
          origin: string
          payment_mode?: string | null
          payment_status?: string | null
          pickup_date: string
          quantity?: number | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          terms_conditions?: string | null
          total_amount: number
          updated_at?: string
          vehicle_number?: string | null
          vehicle_type?: string | null
          version?: number | null
          volume_cbm?: number | null
          weight_kg?: number | null
        }
        Update: {
          advance_paid?: number | null
          balance_due?: number | null
          base_amount?: number
          created_at?: string
          created_by?: string | null
          customer_address?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          declared_value?: number | null
          delivery_date?: string | null
          destination?: string
          distance_km?: number | null
          docket_number?: string
          docket_type?: Database["public"]["Enums"]["docket_type"]
          driver_name?: string | null
          driver_phone?: string | null
          gst_amount?: number
          gst_percentage?: number
          id?: string
          is_deleted?: boolean | null
          item_description?: string | null
          notes?: string | null
          origin?: string
          payment_mode?: string | null
          payment_status?: string | null
          pickup_date?: string
          quantity?: number | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          vehicle_number?: string | null
          vehicle_type?: string | null
          version?: number | null
          volume_cbm?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          ai_extracted_data: Json | null
          created_at: string | null
          document_type: string | null
          file_name: string
          file_path: string
          id: string
          shipment_id: string | null
          user_id: string | null
        }
        Insert: {
          ai_extracted_data?: Json | null
          created_at?: string | null
          document_type?: string | null
          file_name: string
          file_path: string
          id?: string
          shipment_id?: string | null
          user_id?: string | null
        }
        Update: {
          ai_extracted_data?: Json | null
          created_at?: string | null
          document_type?: string | null
          file_name?: string
          file_path?: string
          id?: string
          shipment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          period: string | null
          recorded_at: string | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          period?: string | null
          recorded_at?: string | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          period?: string | null
          recorded_at?: string | null
        }
        Relationships: []
      }
      gst_rates: {
        Row: {
          created_at: string
          description: string | null
          gst_percentage: number
          id: string
          is_active: boolean | null
          service_category: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gst_percentage: number
          id?: string
          is_active?: boolean | null
          service_category: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gst_percentage?: number
          id?: string
          is_active?: boolean | null
          service_category?: string
        }
        Relationships: []
      }
      lead_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          lead_id: string | null
          lead_type: string | null
          notes: string | null
          status: string | null
          transporter_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          lead_type?: string | null
          notes?: string | null
          status?: string | null
          transporter_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          lead_type?: string | null
          notes?: string | null
          status?: string | null
          transporter_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          address: string | null
          company_name: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          notes: string | null
          phone: string | null
          scraped_data: Json | null
          source: string
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          phone?: string | null
          scraped_data?: Json | null
          source: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          phone?: string | null
          scraped_data?: Json | null
          source?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      part_load_bids: {
        Row: {
          actual_space_available_cft: number | null
          available_space_cft: number | null
          compatibility_score: number | null
          created_at: string
          id: string
          photos: string[] | null
          post_id: string | null
          quoted_rate: number
          remarks: string | null
          route_details: string | null
          status: string | null
          transporter_id: string | null
          truck_photos: string[] | null
          truck_type: string | null
          updated_at: string
        }
        Insert: {
          actual_space_available_cft?: number | null
          available_space_cft?: number | null
          compatibility_score?: number | null
          created_at?: string
          id?: string
          photos?: string[] | null
          post_id?: string | null
          quoted_rate: number
          remarks?: string | null
          route_details?: string | null
          status?: string | null
          transporter_id?: string | null
          truck_photos?: string[] | null
          truck_type?: string | null
          updated_at?: string
        }
        Update: {
          actual_space_available_cft?: number | null
          available_space_cft?: number | null
          compatibility_score?: number | null
          created_at?: string
          id?: string
          photos?: string[] | null
          post_id?: string | null
          quoted_rate?: number
          remarks?: string | null
          route_details?: string | null
          status?: string | null
          transporter_id?: string | null
          truck_photos?: string[] | null
          truck_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "part_load_bids_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "part_load_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      part_load_posts: {
        Row: {
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          customer_id: string | null
          drop_location: string
          estimated_space_cft: number | null
          expected_rate: number | null
          goods_type: string | null
          id: string
          load_category: string | null
          load_title: string
          material_photos: string[] | null
          photos: string[] | null
          pickup_date: string | null
          pickup_location: string
          status: string | null
          updated_at: string
          volume_cft: number | null
          weight_kg: number | null
        }
        Insert: {
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          customer_id?: string | null
          drop_location: string
          estimated_space_cft?: number | null
          expected_rate?: number | null
          goods_type?: string | null
          id?: string
          load_category?: string | null
          load_title: string
          material_photos?: string[] | null
          photos?: string[] | null
          pickup_date?: string | null
          pickup_location: string
          status?: string | null
          updated_at?: string
          volume_cft?: number | null
          weight_kg?: number | null
        }
        Update: {
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          customer_id?: string | null
          drop_location?: string
          estimated_space_cft?: number | null
          expected_rate?: number | null
          goods_type?: string | null
          id?: string
          load_category?: string | null
          load_title?: string
          material_photos?: string[] | null
          photos?: string[] | null
          pickup_date?: string | null
          pickup_location?: string
          status?: string | null
          updated_at?: string
          volume_cft?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          payment_method: string | null
          shipment_id: string | null
          status: string | null
          stripe_payment_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method?: string | null
          shipment_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method?: string | null
          shipment_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pin_codes: {
        Row: {
          base_rate: number | null
          city: string
          created_at: string
          id: string
          is_serviceable: boolean | null
          pin_code: string
          region: string
          state: string
        }
        Insert: {
          base_rate?: number | null
          city: string
          created_at?: string
          id?: string
          is_serviceable?: boolean | null
          pin_code: string
          region: string
          state: string
        }
        Update: {
          base_rate?: number | null
          city?: string
          created_at?: string
          id?: string
          is_serviceable?: boolean | null
          pin_code?: string
          region?: string
          state?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
       contact_us: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          company_name: string | null
          created_at: string | null
          customer_name: string
          destination: string
          // dimensions: string | null
          email: string
          id: string
          origin: string
          phone: string
          // preferences: string | null
          // quantity: number | null
          service_type: string
          shipment_value: number | null
          special_requirements: string | null
          status: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          customer_name: string
          destination: string
          dimensions?: string | null
          email: string
          id?: string
          origin: string
          phone: string
          preferences?: string | null
          quantity?: number | null
          service_type: string
          shipment_value?: number | null
          special_requirements?: string | null
          status?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          customer_name?: string
          destination?: string
          dimensions?: string | null
          email?: string
          id?: string
          origin?: string
          phone?: string
          preferences?: string | null
          quantity?: number | null
          service_type?: string
          shipment_value?: number | null
          special_requirements?: string | null
          status?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          ai_recommendations: Json | null
          created_at: string | null
          destination: string
          dimensions: Json | null
          estimated_price: number | null
          id: string
          origin: string
          shipment_type: string
          status: string | null
          user_id: string | null
          valid_until: string | null
          weight: number | null
        }
        Insert: {
          ai_recommendations?: Json | null
          created_at?: string | null
          destination: string
          dimensions?: Json | null
          estimated_price?: number | null
          id?: string
          origin: string
          shipment_type: string
          status?: string | null
          user_id?: string | null
          valid_until?: string | null
          weight?: number | null
        }
        Update: {
          ai_recommendations?: Json | null
          created_at?: string | null
          destination?: string
          dimensions?: Json | null
          estimated_price?: number | null
          id?: string
          origin?: string
          shipment_type?: string
          status?: string | null
          user_id?: string | null
          valid_until?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          rating: number
          review_text: string
          reviewer_name: string
          service_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          review_text: string
          reviewer_name: string
          service_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          review_text?: string
          reviewer_name?: string
          service_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_metrics: {
        Row: {
          bounce_rate: number | null
          id: string
          keyword: string | null
          page_load_time: number | null
          page_url: string
          ranking: number | null
          recorded_at: string | null
          traffic: number | null
        }
        Insert: {
          bounce_rate?: number | null
          id?: string
          keyword?: string | null
          page_load_time?: number | null
          page_url: string
          ranking?: number | null
          recorded_at?: string | null
          traffic?: number | null
        }
        Update: {
          bounce_rate?: number | null
          id?: string
          keyword?: string | null
          page_load_time?: number | null
          page_url?: string
          ranking?: number | null
          recorded_at?: string | null
          traffic?: number | null
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          audit_score: number | null
          canonical_url: string | null
          created_at: string
          id: string
          issues: Json | null
          keywords: string[] | null
          last_audit_at: string | null
          meta_description: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_url: string
          schema_markup: Json | null
          sitemap_priority: number | null
          updated_at: string
        }
        Insert: {
          audit_score?: number | null
          canonical_url?: string | null
          created_at?: string
          id?: string
          issues?: Json | null
          keywords?: string[] | null
          last_audit_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_url: string
          schema_markup?: Json | null
          sitemap_priority?: number | null
          updated_at?: string
        }
        Update: {
          audit_score?: number | null
          canonical_url?: string | null
          created_at?: string
          id?: string
          issues?: Json | null
          keywords?: string[] | null
          last_audit_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_url?: string
          schema_markup?: Json | null
          sitemap_priority?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          actual_cost: number | null
          ai_optimized_route: Json | null
          created_at: string | null
          delivery_date: string | null
          destination_address: string
          dimensions: Json | null
          estimated_cost: number | null
          id: string
          origin_address: string
          pickup_date: string | null
          shipment_type: string
          status: string | null
          tracking_number: string
          updated_at: string | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          actual_cost?: number | null
          ai_optimized_route?: Json | null
          created_at?: string | null
          delivery_date?: string | null
          destination_address: string
          dimensions?: Json | null
          estimated_cost?: number | null
          id?: string
          origin_address: string
          pickup_date?: string | null
          shipment_type: string
          status?: string | null
          tracking_number: string
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          actual_cost?: number | null
          ai_optimized_route?: Json | null
          created_at?: string | null
          delivery_date?: string | null
          destination_address?: string
          dimensions?: Json | null
          estimated_cost?: number | null
          id?: string
          origin_address?: string
          pickup_date?: string | null
          shipment_type?: string
          status?: string | null
          tracking_number?: string
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_health_logs: {
        Row: {
          checked_at: string | null
          cpu_usage: number | null
          error_count: number | null
          id: string
          memory_usage: number | null
          response_time: number | null
          service_name: string
          status: string
        }
        Insert: {
          checked_at?: string | null
          cpu_usage?: number | null
          error_count?: number | null
          id?: string
          memory_usage?: number | null
          response_time?: number | null
          service_name: string
          status: string
        }
        Update: {
          checked_at?: string | null
          cpu_usage?: number | null
          error_count?: number | null
          id?: string
          memory_usage?: number | null
          response_time?: number | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          id: string
          location: string
          notes: string | null
          shipment_id: string | null
          status: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          id?: string
          location: string
          notes?: string | null
          shipment_id?: string | null
          status: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          id?: string
          location?: string
          notes?: string | null
          shipment_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_space_records: {
        Row: {
          available_date: string | null
          created_at: string
          current_location: string | null
          destination: string | null
          id: string
          is_available: boolean | null
          photos: string[] | null
          total_capacity_cft: number
          transporter_id: string | null
          truck_number: string
          truck_type: string
          updated_at: string
          used_capacity_cft: number | null
        }
        Insert: {
          available_date?: string | null
          created_at?: string
          current_location?: string | null
          destination?: string | null
          id?: string
          is_available?: boolean | null
          photos?: string[] | null
          total_capacity_cft: number
          transporter_id?: string | null
          truck_number: string
          truck_type: string
          updated_at?: string
          used_capacity_cft?: number | null
        }
        Update: {
          available_date?: string | null
          created_at?: string
          current_location?: string | null
          destination?: string | null
          id?: string
          is_available?: boolean | null
          photos?: string[] | null
          total_capacity_cft?: number
          transporter_id?: string | null
          truck_number?: string
          truck_type?: string
          updated_at?: string
          used_capacity_cft?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      course_difficulty: "beginner" | "intermediate" | "advanced" | "expert"
      docket_type:
        | "packers_movers"
        | "ptl_ftl"
        | "other_services"
        | "courier_ecommerce"
      shipment_status: "pending" | "in_transit" | "delivered" | "cancelled"
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
      app_role: ["admin", "user"],
      course_difficulty: ["beginner", "intermediate", "advanced", "expert"],
      docket_type: [
        "packers_movers",
        "ptl_ftl",
        "other_services",
        "courier_ecommerce",
      ],
      shipment_status: ["pending", "in_transit", "delivered", "cancelled"],
    },
  },
} as const
