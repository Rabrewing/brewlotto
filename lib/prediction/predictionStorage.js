/**
 * Prediction Storage (ESM)
 * Handles storage and retrieval of predictions with full explainability metadata
 */

import { createClient } from '@supabase/supabase-js';

export class PredictionStorage {
  constructor(supabaseClient = null) {
    this.supabase = supabaseClient || createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  /**
   * Store a complete prediction with all associated metadata
   */
  async storePrediction(predictionData) {
    try {
      let predictionId = null;

      // 1. Store the main prediction
      const { data: predictionDataStored, error: predictionError } = await this.supabase
        .from('predictions')
        .insert({
          user_id: predictionData.user_id || null,
          state: predictionData.state || 'NC',
          game: predictionData.game || 'pick3',
          draw_date: predictionData.target_draw_date || null,
          draw_time: predictionData.target_draw_window_label || null,
          prediction_type: predictionData.request_source || 'scheduled',
          source_strategy_key: predictionData.strategy_public_label || 'frequency',
          strategy_bundle: predictionData.strategy_internal_bundle || [],
          predicted_numbers: predictionData.primary_numbers || [],
          bonus_number: predictionData.bonus_numbers?.[0] || null,
          confidence_score: predictionData.composite_score || null,
          rank_score: predictionData.composite_score || null,
          risk_level: predictionData.confidence_band || 'medium',
          is_saved: predictionData.is_saved_by_default || true,
          is_featured: false,
          generation_context: predictionData.evidence_bundle || {},
        })
        .select()
        .single();
        
      if (predictionError) {
        throw new Error(`Failed to store prediction: ${predictionError.message}`);
      }
      
      predictionId = predictionDataStored.id;

      // 2. Store prediction explanations if provided
      if (predictionData.explanations && Array.isArray(predictionData.explanations)) {
        for (const explanation of predictionData.explanations) {
          await this.supabase.from('prediction_explanations').insert({
            prediction_id: predictionId,
            user_id: predictionData.user_id || null,
            explanation_type: explanation.explanation_type || 'summary',
            title: explanation.title || null,
            summary_text: explanation.summary_text || explanation.content || null,
            detail_text: explanation.detail_text || null,
            commentary_payload: explanation.commentary_payload || {},
            evidence_payload: explanation.evidence_payload || {},
            provider: explanation.provider || null,
            provider_model: explanation.model_name || null,
            trust_score: explanation.trust_score || null,
            is_compliant: explanation.is_compliant !== false,
          });
        }
      }

      // 3. Store prediction strategy scores if provided
      if (predictionData.strategyScores && Array.isArray(predictionData.strategyScores)) {
        for (const score of predictionData.strategyScores) {
          await this.supabase.from('prediction_strategy_scores').insert({
            prediction_id: predictionId,
            strategy_key: score.strategy_key,
            public_label: score.public_label,
            weight: score.weight,
            score: score.score,
            notes: score.notes || [],
          });
        }
      }

      // Return the complete stored prediction
      return await this.getPredictionById(predictionId);
    } catch (error) {
      console.error('Error storing prediction:', error);
      throw error;
    }
  }

  /**
   * Retrieve a prediction by its ID with all related data
   */
  async getPredictionById(predictionId) {
    try {
      const { data: prediction, error: predictionError } = await this.supabase
        .from('predictions')
        .select('*')
        .eq('id', predictionId)
        .single();
        
      if (predictionError) {
        throw new Error(`Failed to fetch prediction: ${predictionError.message}`);
      }

      // Get explanations
      const { data: explanations } = await this.supabase
        .from('prediction_explanations')
        .select('*')
        .eq('prediction_id', predictionId);

      // Get strategy scores
      const { data: strategyScores } = await this.supabase
        .from('prediction_strategy_scores')
        .select('*')
        .eq('prediction_id', predictionId);

      return {
        ...prediction,
        explanations: explanations || [],
        strategy_scores: strategyScores || [],
      };
    } catch (error) {
      console.error('Error fetching prediction by ID:', error);
      throw error;
    }
  }

  /**
   * Get predictions for a game with optional filtering
   */
  async getPredictionsByGame(gameId, limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from('predictions')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch predictions: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching predictions by game:', error);
      throw error;
    }
  }
}

export default PredictionStorage;
