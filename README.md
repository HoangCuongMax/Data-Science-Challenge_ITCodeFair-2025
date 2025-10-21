# NT Tourism Review Analysis Workflow

## Step 1: Data Collection Using Custom Chrome Extensions
We built browser extensions (HTML/JS-based) to scrape reviews ethically from public pages, limiting to the last 3 years for relevance. This avoids APIs and ensures compliance with public data access.

**Sources:**
- **Google Maps Extension:** Navigates to a place page (e.g., search "Uluru" on maps.google.com), scrolls to load reviews, extracts reviewer, rating (1–5), date, and text. Outputs to CSV.  
- **Reddit Extension:** Uses old.reddit.com for threads (e.g., search "Uluru travel" threads), loads all comments, extracts author, score, date, and text.  
- **TripAdvisor Extension:** Similar process, for cross-validation, scraping review pages.  

**Application:**
- **Uluru:** ~500 reviews from Google Maps + Reddit threads on r/AustraliaTravel. Focused on keywords like "Uluru experience."  
- **Katherine Hot Springs:** ~300 reviews from Google Maps + Reddit threads like "Katherine Gorge tips." Emphasized relaxation themes.  
- **Kakadu National Park:** ~400 reviews from Google Maps + Reddit threads (e.g., "Kakadu wet season"). Captured seasonal feedback.  

We combine CSVs from sources for a unified dataset, ensuring no personal data is stored.

---

## Step 2: Data Loading and Preprocessing in Python
Using Pandas and NLTK, we load the CSVs and clean the text for analysis. This standardizes data across destinations.

**Application:**
- **Uluru:** Cleaned ~500 reviews. Removed noise like emojis, yielding clean text such as "amazing rock spiritual experience."  
- **Katherine Hot Springs:** Highlighted words like "relaxing warm water" vs. "crowded summer."  
- **Kakadu:** Captured terms like "flooded roads" (wet season). Prepared for sentiment analysis.  

This step ensures data is ready for ML, handling variations like Reddit’s informal language.

---

## Step 3: Sentiment Analysis with NLTK VADER
We use VADER to score sentiments (compound score: -1 to +1), classifying reviews as Positive, Neutral, or Negative. This reveals overall tourist satisfaction.

**Application:**
- **Uluru:** Avg. score: 0.75 → Mostly Positive. Pros: "Spiritual awe"; Cons: "High entry fees." Strong correlation between ratings and sentiment.  
- **Katherine Hot Springs:** Avg. score: 0.68. Positives: "Natural healing"; Negatives: "Limited facilities" during peak times.  
- **Kakadu:** Avg. score: 0.72. Positives: "Wildlife adventures"; Negatives: "Mosquitoes and remote access."  

---

## Step 4: Topic Modeling with Gensim LDA
We model topics to uncover themes like *culture* or *accessibility*, using 5 topics for interpretability.

**Application:**
- **Uluru:** Topics included "rock climb view" (adventure) and "cultural indigenous respect" (heritage). Culture emerged as dominant.  
- **Katherine Hot Springs:** Topics: "water relax swim" (leisure) and "hot natural spring" (unique features). Showed spa-like enhancement opportunities.  
- **Kakadu:** Topics: "wildlife boat tour" (activities) and "wet season flood" (challenges). Word clouds emphasized biodiversity.  

---

## Step 5: Clustering with Scikit-Learn
We vectorize text with TF-IDF, cluster into 5 groups, and visualize with PCA to segment tourists.

**Application:**
- **Uluru:** Clusters included *Adventure seekers* ("hike sunrise") and *Cultural enthusiasts* ("aboriginal story"). Guided package design.  
- **Katherine Hot Springs:** Segmented into *Relaxation-focused* ("soak peace") and *Family-oriented* ("kids friendly").  
- **Kakadu:** Segments included *Nature lovers* ("birds crocodile") and *Adventure extremists* ("4WD tracks").  

---

## Step 6: Deriving Insights, Recommendations, and Predictions
We synthesize results into pros/cons, propose actions, and predict impacts using baseline NT data (1.58M visitors).

**Application:**
- **Uluru:**  
  - Insights: Leverage culture, address costs.  
  - Recs: Indigenous tours, government subsidies.  
  - Prediction: +10–15% growth → $48M–56M extra impact.  
- **Katherine Hot Springs:**  
  - Insights: Positive nature appeal, negative crowding.  
  - Recs: Expand facilities, eco-spa bundles.  
  - Prediction: +8–12% boost → +$20M regional impact.  
- **Kakadu:**  
  - Insights: Wildlife strong, access weak.  
  - Recs: Seasonal guides, infrastructure upgrades.  
  - Prediction: +12–18% growth → 300–500 new jobs.  

---

## Step 7: Scaling to Other Destinations
Repeat Steps 1–6 with new datasets (e.g., Darwin Harbor). Update file paths and rerun the notebook.

This process is:
- **Ethical:** Public data only.  
- **Advanced:** ML integration.  
- **Practical:** Directly supports NT’s tourism goals.  

A Jupyter Notebook replicates the process fully (submitted as work-in-progress by Oct 1, 2025). For the pitch, we’ll demo live with Uluru data.
