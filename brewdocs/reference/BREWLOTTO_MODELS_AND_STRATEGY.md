### Model Logic Summary

**Poisson:** Basic probability distribution modeling number frequency.
**Poisson+:** Adds positional bias + mirror number weighting.
**Poisson++:** Dynamic probability recalibration via historical entropy and momentum metrics.
**Markov Chain:** Predicts transitions between number states.
**Momentum:** Tracks streaks, recency, and heat index.
**Entropy:** Measures randomness to detect high-confidence prediction zones.

### Strategy Flow

```
Ingestion → Normalize → Analyze (Poisson++) → Score → Comment → Log → Display
```

### Commentary Example

> “The last 10 draws show increasing entropy — expect high volatility. This prediction prioritizes mirrored pairs with balanced parity.”
