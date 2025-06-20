```mermaid
classDiagram
  class TourDraft {
    string title
    string location
    int numPeople
    string season
  }

  class TourDay {
    int dayNumber
    string description
  }

  TourDraft --> TourDay
```
