export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(messages: OpenRouterMessage[]): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'YouTube Fallacy Checker'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages,
        temperature: 0.1,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      let errorMessage = 'OpenRouter API error: ';
      
      if (errorData?.error?.message) {
        errorMessage += errorData.error.message;
      } else if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your OpenRouter API key.';
      } else {
        errorMessage += `${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}