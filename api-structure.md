# API Structure for Exchange Rates

## Endpoint: `/api/exchange-management/exchanges/rates`

### Actual BFF Response Format

```json
[
    {
        "currency": "dolar amerykański",
        "code": "USD",
        "bid": "3.5943",
        "ask": "3.6669"
    },
    {
        "currency": "euro",
        "code": "EUR",
        "bid": "4.2134",
        "ask": "4.2986"
    }
]
```

### Frontend Transformation

Frontend przekształca dane BFF do wewnętrznego formatu:

```json
{
  "currencies": [
    {
      "code": "USD",
      "name": "dolar amerykański",
      "flag": "🇺🇸",
      "rate": 3.6669,
      "change": 0,
      "bid": 3.5943,
      "ask": 3.6669
    },
    {
      "code": "EUR", 
      "name": "euro",
      "flag": "🇪🇺",
      "rate": 4.2986,
      "change": 0,
      "bid": 4.2134,
      "ask": 4.2986
    }
  ],
  "cryptocurrencies": []
}
```

### BFF Response Fields

- `currency`: Full currency name in Polish - **required**
- `code`: Currency code (e.g., "USD", "EUR") - **required**
- `bid`: Buy rate (kurs kupna) - **required**
- `ask`: Sell rate (kurs sprzedaży) - **required**

### Frontend Transformation Logic

1. **Main rate**: Uses `ask` value (sell rate) as primary display rate
2. **Name**: Uses `currency` field from BFF
3. **Flag**: Added from frontend fallback data using `code`
4. **Change**: Set to 0 (BFF doesn't provide this yet)
5. **Bid/Ask**: Preserved for potential future use (e.g., detailed views)

### Simplified Approach

**Frontend now displays exactly what BFF returns:**
- No client-side validation or filtering
- No fallback data merging
- Direct mapping from API response to UI
- BFF is responsible for data quality and completeness
- Frontend only provides fallback values if BFF doesn't include optional fields

### Benefits

- Simpler frontend code
- Single source of truth (BFF)
- Easier testing and debugging
- Better performance (no client-side processing)
- Clear separation of concerns