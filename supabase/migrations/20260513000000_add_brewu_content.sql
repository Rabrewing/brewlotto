-- BrewU Content Management Table
-- Allows superadmin to edit BrewU/help content from the admin panel
-- instead of hardcoding everything in app/learn/page.tsx

CREATE TABLE IF NOT EXISTS public.brewu_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key text NOT NULL,
    state_code text,
    game_key text,
    title text NOT NULL,
    body text NOT NULL,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brewu_content_section ON public.brewu_content (section_key);
CREATE INDEX IF NOT EXISTS idx_brewu_content_active ON public.brewu_content (is_active);
CREATE INDEX IF NOT EXISTS idx_brewu_content_state_game ON public.brewu_content (state_code, game_key);

ALTER TABLE public.brewu_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brewu_content_select_anon" ON public.brewu_content FOR SELECT USING (true);
CREATE POLICY "brewu_content_insert_admin" ON public.brewu_content FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "brewu_content_update_admin" ON public.brewu_content FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "brewu_content_delete_admin" ON public.brewu_content FOR DELETE USING (auth.role() = 'service_role');

-- Seed existing hardcoded content into the table

INSERT INTO public.brewu_content (section_key, title, body, sort_order) VALUES
('lesson_hot_cold', 'Hot and Cold Numbers', 'Hot numbers have appeared more often in recent draws, while cold numbers have appeared less often. Neither guarantees the next result; they are just recent-frequency signals.', 1),
('lesson_momentum', 'Momentum', 'Momentum is BrewLotto shorthand for short-term trend acceleration. It highlights numbers or patterns that are picking up recent activity, not a promise of future performance.', 2),
('lesson_confidence', 'Confidence', 'Confidence is an internal ranking signal attached to a prediction, based on the strategy blend and current evidence. Higher confidence still does not change the odds of the game.', 3),
('lesson_hit_vs_win', 'Hit vs Win', 'A hit means your saved numbers matched a draw — visible only after you confirm you played. A win means you confirmed the play and the match resulted in a prize. Unconfirmed pattern matches do not count toward your stats.', 4),
('lesson_strategy_variety', 'Why Strategy Variety Matters', 'Different strategies emphasize different evidence, such as frequency, momentum, or scoring. Strategy Locker exists so premium users can see which approaches are available and when they were used.', 5),

('fireball_context', 'Fireball is for reference only', 'Fireball is shown as draw context alongside your match count, but it does not change the match score. "Matched 2 numbers" always refers to core drawn numbers only — Fireball is displayed so you know what the Fireball was for that draw, not as an extra match opportunity.', 1);

INSERT INTO public.brewu_content (section_key, state_code, game_key, title, body, sort_order) VALUES
('play_style', 'NC', 'pick3', 'Pick 3 / Daily 3 — Order matters', 'Straight odds: 1 in 1,000. Straight (exact order, highest payout), Box (any order with repeats), Straight/Box (split wager), and NC extras like 50/50, Combo, Pair, and Fireball.', 1),
('play_style', 'CA', 'daily3', 'Daily 3 — Order matters', 'Straight odds: 1 in 1,000. Focus on Straight, Box, and Straight/Box plays.', 2),
('play_style', 'NC', 'pick4', 'Pick 4 / Daily 4 — More combinations', 'Exact order odds: 1 in 10,000. 4-Way, 6-Way, 12-Way, 24-Way box plays. NC includes Fireball and 50/50 style play.', 3),
('play_style', 'CA', 'daily4', 'Daily 4 — More combinations', 'Exact order odds: 1 in 10,000. Focus on Straight, Box, and Straight/Box plays.', 4),
('play_style', NULL, 'cash5', 'Cash 5 / Fantasy 5 — Choose 5', 'Odds vary by state. Choose 5 numbers from the pool. NC draws at 11:22 PM ET, CA Fantasy 5 draws nightly.', 5),
('play_style', NULL, 'powerball', 'Powerball — Multi-state', 'Choose 5 from 1–69 plus a Powerball from 1–26. Draws Mon/Wed/Sat at 10:59 PM ET. Power Play multiplier available.', 6),
('play_style', NULL, 'mega_millions', 'Mega Millions — Multi-state', 'Choose 5 from 1–70 plus a Mega Ball from 1–25. Draws Tue/Fri at 11:00 PM ET. Megaplier available.', 7);
