export type SampleCodeTab = "curl" | "python" | "node" | "go";

export const SAMPLE_PDF_URL = "https://arxiv.org/pdf/1706.03762.pdf";

export const sampleCodeTabConfig: Array<{
  id: SampleCodeTab;
  label: string;
  language: "bash" | "go" | "javascript" | "python";
}> = [
  { id: "python", label: "Python", language: "python" },
  { id: "node", label: "Node.js", language: "javascript" },
  { id: "curl", label: "cURL", language: "bash" },
  { id: "go", label: "Go", language: "go" },
];

export const buildCodeByTab = ({
  apiBaseUrl,
  apiKey,
}: {
  apiBaseUrl: string;
  apiKey: string;
}): Record<SampleCodeTab, string> => ({
  curl: `curl -X POST ${apiBaseUrl}/v1/jobs \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_type": "url",
    "source_url": "${SAMPLE_PDF_URL}",
    "parsing_params": {
      "model": "base",
      "ocr_enabled": true
    }
  }'`,
  python: `# pip install knowhere-python-sdk
import knowhere

client = knowhere.Knowhere(
    api_key="${apiKey}",
    base_url="${apiBaseUrl}",
)

result = client.parse(url="${SAMPLE_PDF_URL}")

print(result.statistics.total_chunks)
print(result.full_markdown[:200])`,
  node: `// npm install @ontos-ai/knowhere-sdk
import Knowhere from "@ontos-ai/knowhere-sdk";

const client = new Knowhere({
  apiKey: "${apiKey}",
  baseURL: "${apiBaseUrl}",
});

const result = await client.parse({
  url: "${SAMPLE_PDF_URL}",
});

console.log("Text chunks:", result.textChunks.length);
console.log(result.textChunks[0]?.content);`,
  go: `package main

import (
  "bytes"
  "fmt"
  "io"
  "net/http"
)

func main() {
  body := []byte(\`{
    "source_type": "url",
    "source_url": "${SAMPLE_PDF_URL}",
    "parsing_params": {
      "model": "base",
      "ocr_enabled": true
    }
  }\`)

  req, _ := http.NewRequest("POST", "${apiBaseUrl}/v1/jobs", bytes.NewBuffer(body))
  req.Header.Set("Authorization", "Bearer ${apiKey}")
  req.Header.Set("Content-Type", "application/json")

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  result, _ := io.ReadAll(resp.Body)
  fmt.Println(string(result))
}`,
});
