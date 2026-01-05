# generate-recipe Edge Function

Quick checks for the recipe generator.

## Call the deployed function (Supabase Edge)
Replace `<project>` and `<anon-key>` with your Supabase values:

```bash
curl -X POST "https://<project>.supabase.co/functions/v1/generate-recipe" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <anon-key>" \
  -H "apikey: <anon-key>" \
  --data '{"query":"pollo con arroz fitness"}'
```

## Call OpenRouter directly (bypassing Supabase) for debugging
Replace `<openrouter-key>` with your key:

```bash
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer <openrouter-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-r1-0528:free",
    "stream": false,
    "temperature": 0.3,
    "max_tokens": 1500,
    "messages": [{"role": "user", "content": "Return a short JSON recipe for a high-protein arroz con pollo."}]
  }'
```
