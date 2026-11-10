# NT Tourism Review Analysis
**Python · Text analytics · Northern Territory tourism**

An exploratory CDU IT Codefair 2025 project investigating what visitor reviews can reveal about tourism experiences and opportunities for service improvement.

[Portfolio overview](https://docs.google.com/document/d/1hz0K7N4KQkP5eKUZLWhO6hqBWVymC7neSLReXxuw754) · [Max's profile](https://github.com/HoangCuongMax)

## Business question

What themes appear in visitor feedback, how does sentiment vary, and which issues deserve further investigation by tourism stakeholders?

## Explore the analysis

| Material | Contents |
| --- | --- |
| [Google Maps notebook](Google_map_review.ipynb) | Review analysis notebook |
| [Reddit notebook](Reddit_review.ipynb) | Discussion and review analysis notebook |
| [TripAdvisor notebook](Trip-advisor.ipynb) | Collection experiment, text preparation, sentiment and topic analysis |
| [Presentation outline](Data_Science_Challenge_Presentation_Slides.markdown) | Competition presentation material and proposed recommendations |
| [Google Maps datasets](https://github.com/HoangCuongMax/Data-Science-Challenge_ITCodeFair-2025/tree/main/Google%20Map%20Review%20-%20Dataset) | Destination-level CSV files |
| [Reddit dataset](https://github.com/HoangCuongMax/Data-Science-Challenge_ITCodeFair-2025/tree/main/Reddit%20Review%20-%20Dataset) | Collected discussion data |

Start with a notebook and its saved outputs, then inspect the associated CSV files. Presentation scenarios should be read alongside the limitations below.

## Analytical workflow

1. Assemble review records from the available source datasets.
2. Inspect missing text, duplicates, destination labels and date coverage.
3. Prepare text for word-frequency, sentiment and topic analysis.
4. Review inferred labels and themes against the original text.
5. Translate supported patterns into questions and recommendations for stakeholders.

The TripAdvisor notebook includes pandas, NLTK VADER, scikit-learn topic modelling, matplotlib and word clouds. Techniques and setup vary across notebooks; consult each notebook's imports and data-loading cells.

## Review or run locally

Clone the repository and open the notebooks in a Jupyter-compatible environment:

```sh
git clone https://github.com/HoangCuongMax/Data-Science-Challenge_ITCodeFair-2025.git
cd Data-Science-Challenge_ITCodeFair-2025
```

Install the dependencies required by the notebook you choose, check input paths, and review cells before running them. Some cells perform external collection or download NLTK resources. A pinned environment and a fresh end-to-end reproduction are not yet documented.

To run the TripAdvisor collection cell, provide your own credential through the `TRIPADVISOR_API_KEY` environment variable. Do not put credentials in notebook source or outputs. To inspect the existing analysis, start with the saved notebook outputs and available CSVs.

## Repository map

```text
Google_map_review.ipynb          Google Maps analysis
Reddit_review.ipynb              Reddit analysis
Trip-advisor.ipynb               TripAdvisor collection and analysis
Google Map Review - Dataset/    Destination CSVs
Reddit Review - Dataset/        Discussion CSVs
Google Map Scraper/             Collection extension
Reddit Comment Scraper/         Collection extension
Reddit Subreddit Scraper/       Collection extension
Data_Science_Challenge_...       Presentation outline
```

Existing filenames are retained so notebook paths and external links continue to work.

## Interpretation & limitations

- Online reviewers are a self-selected sample; findings do not represent every visitor.
- Sentiment scores are model outputs, not direct measures of satisfaction or validated causal effects.
- Topic labels require human review. Sampling, source coverage and collection dates affect comparisons.
- Presentation figures for visitor growth, revenue or jobs are proposed scenarios, not demonstrated outcomes.
- Verify dataset provenance and source permissions before reusing or redistributing records. Public availability alone does not establish unrestricted reuse.

## Next evidence to add

Document the final dataset counts, checked charts, evaluation method and each team member's contribution. The [editable case-study template](https://docs.google.com/document/d/1ZjpAQmYszHWpq28MS1DXD9E30w-dpJkvo1ptLnKIet4) provides a structure for that write-up.
