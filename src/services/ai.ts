
export interface StarResult {
    situation: string;
    task: string;
    action: string[];
    result: string;
    alignment_analysis?: string; // New field for JD analysis
    is_valid_experience: boolean; // New field to check if the input is a valid experience
    invalid_reason?: string; // Reason if the experience is invalid
}

export async function optimizeResume(
    originalText: string,
    targetPosition: string,
    identityLevel: string,
    apiKey?: string,
    baseUrl?: string,
    modelName?: string,
    jobDescription?: string // New parameter
): Promise<StarResult> {
    const key = apiKey || import.meta.env.VITE_OPENAI_API_KEY;
    // Remove the default OpenAI fallback URL if base URL is provided but empty
    let url = baseUrl || import.meta.env.VITE_OPENAI_BASE_URL;
    
    // Sanity check: If URL looks like a model name (no http, no slash), ignore it
    if (url && !url.startsWith('http') && !url.startsWith('/') && !url.includes('.')) {
        console.warn('[AI Service] Invalid Base URL detected:', url, 'Falling back to default.');
        url = '';
    }

    // Fallback only if absolutely no URL is configured
    if (!url) {
        url = 'https://api.openai.com/v1';
    }
    
    // Ensure no trailing slash
    url = url.replace(/\/$/, '');

    // Fix: If URL ends with /v1, remove it because we append /chat/completions manually
    // Many providers use base_url as https://api.example.com/v1, so appending /chat/completions makes it /v1/chat/completions
    // However, some providers might require specific paths.
    // Standard OpenAI SDK behavior is usually base_url + /chat/completions.
    // Let's assume the user provides a base URL like https://api.deepseek.com or https://api.deepseek.com/v1
    
    // Use local proxy (or Vercel rewrite) to avoid CORS
    // This works for:
    // 1. Dev (vite.config.ts proxy)
    // 2. Preview (vite.config.ts preview.proxy)
    // 3. Vercel (vercel.json rewrites)
    if (url.includes('api.deepseek.com')) {
        url = '/ai-api';
    }

    // Construct full URL carefully
    let fullUrl;
    if (url.endsWith('/chat/completions')) {
        fullUrl = url;
    } else {
        // Ensure we don't double slash
        if (url.endsWith('/')) url = url.slice(0, -1);
        fullUrl = `${url}/chat/completions`;
    }
    
    console.log('[AI Service] Request URL:', fullUrl); // Debug log

    const model = modelName || import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

    
    // Debug logging to identify what's being passed
    console.log('[AI Service] Config:', { 
        keyProvided: !!apiKey, 
        keyLength: key ? key.length : 0, 
        keyStart: key ? key.substring(0, 3) : 'N/A',
        baseUrl: url,
        fullUrl: fullUrl
    });

    if (!key) {
        throw new Error('API Key is missing. Please check your settings or .env file.');
    }

    if (key.startsWith('http')) {
        throw new Error(`Configuration Error: API Key appears to be a URL (starts with ${key.substring(0, 8)}...). You might have swapped API Key and Base URL in your Vercel Environment Variables.`);
    }
    
    let levelInstruction = '';
    switch (identityLevel) {
        case 'intern':
            levelInstruction = '强调学习潜力、适应性与按要求执行任务；使用“协助”“支持”“学习”等动词；语气积极且细致。';
            break;
        case 'campus':
            levelInstruction = '强调小范围模块的独立负责、跨团队协作与初步业务影响；使用“主导小范围”“协作”“按期交付”等动词；语气专业、成长导向。';
            break;
        case 'experienced':
            levelInstruction = '强调战略影响、复杂问题解决、跨团队协作与带教；使用“牵头”“规划”“优化策略”“跨团队协作”等动词；语气权威且结果导向。';
            break;
        default:
            levelInstruction = '强调专业执行与可量化结果。';
    }

    let jdInstruction = '';
    if (jobDescription && jobDescription.trim()) {
        jdInstruction = `
5. 分析以下岗位描述（JD），确保优化后的内容覆盖其中的关键职责与关键词，并在表述中自然融入这些关键词。

岗位描述（JD）：
"${jobDescription}"

6. 在输出 JSON 中新增字段 "alignment_analysis"，用中文说明优化内容如何与 JD 匹配，并列出已覆盖的关键关键词。
`;
    }

    let prompt = `
你是中文简历优化专家。请基于 STAR 法则（情境 Situation、任务 Task、行动 Action、结果 Result）为目标岗位“${targetPosition}”在“${identityLevel.toUpperCase()}”级别下重写以下经历，确保呈现更高的专业度与岗位匹配度。

原始经历：
"${originalText}"

要求：
0. **首先核验原始经历是否为有效的项目/工作经历。** 如果输入内容是乱码、无意义字符、或者明显与工作/项目经历无关（例如“今天天气不错”、“随便写写”等），请将 JSON 中的 "is_valid_experience" 字段设为 false，并在 "invalid_reason" 字段中说明原因（提示用户输入真实有效的经历）。如果内容有效，则 "is_valid_experience" 为 true。
1. 严格使用 STAR 结构组织内容。
2. 使用符合 ${identityLevel} 级别的有力动词与表述。
3. ${levelInstruction}
4. 尽量量化成果（在合理前提下可据情估算）。
${jdInstruction}
7. 仅返回严格合法的 JSON，且所有字段内容必须使用简体中文；不得包含解释性文字或额外前后缀。
8. 不要直接复制原始文本的句子，需进行重写与提炼，避免与原始经历“重叠”。
9. 输出要独特、有创造性，但保持专业与可信。
10. 当前时间戳：${Date.now()}

JSON 结构：
{
  "is_valid_experience": true/false,
  "invalid_reason": "无效原因（仅当 is_valid_experience 为 false 时返回）",
  "situation": "情境...",
  "task": "任务...",
  "action": ["动作1...", "动作2..."],
  "result": "结果...",
  "alignment_analysis": "与JD匹配的分析（如无JD可省略）"
}
`;

    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: '你是一个严格输出 JSON 的助手。必须使用简体中文输出所有字段内容。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8, // Increased temperature for more variety
                stream: false
            })
        });

        if (!response.ok) {
            // Check for 405 Method Not Allowed specifically
            if (response.status === 405) {
                // If 405, it means we might be using the wrong endpoint or method.
                // DeepSeek and OpenAI strictly use POST /chat/completions.
                // If we get 405, it's possible we are hitting a different path or the proxy is interfering.
                
                // Let's try a fallback strategy: 
                // If we are currently using /chat/completions and got 405, maybe we need /v1/chat/completions?
                if (!url.includes('/v1')) {
                     // Since we might be using the proxy /ai-api, we need to be careful
                     // If url is /ai-api, we should try /ai-api/v1
                     
                     let retryBaseUrl;
                     if (url === '/ai-api') {
                         retryBaseUrl = '/ai-api/v1';
                     } else {
                         retryBaseUrl = `${url}/v1`;
                     }
                     
                     console.log(`Initial request 405, retrying with base URL: ${retryBaseUrl}`);
                     return optimizeResume(originalText, targetPosition, identityLevel, apiKey, retryBaseUrl, modelName, jobDescription);
                }
            }

            if (response.status === 404) {
                 // Check for Proxy Miss (Vite returning HTML for 404)
                 const contentType = response.headers.get('content-type');
                 if (contentType && contentType.includes('text/html')) {
                     throw new Error('Configuration Error: The request hit the local server instead of the API. Please RESTART your development server (Ctrl+C then npm run dev) to apply the proxy configuration.');
                 }

                 // Try appending /v1/chat/completions if the first attempt failed with 404
                 // This handles cases where user provided base domain (e.g. https://api.deepseek.com) but API expects /v1 prefix
                 if (!url.includes('/v1')) {
                     // Correctly construct the retry URL to include the missing /v1
                     let retryBaseUrl;
                     if (url === '/ai-api') {
                         retryBaseUrl = '/ai-api/v1';
                     } else {
                         retryBaseUrl = `${url}/v1`;
                     }
                     console.log(`Initial request 404, retrying with base URL: ${retryBaseUrl}`);
                     // Recursive call with corrected base URL
                     return optimizeResume(originalText, targetPosition, identityLevel, apiKey, retryBaseUrl, modelName, jobDescription);
                 }
            }
            const errorText = await response.text().catch(() => '');
            let errorMessage = `API Error: ${response.statusText} (${response.status})`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error?.message || errorMessage;
            } catch (e) {
                if (errorText) errorMessage += ` - ${errorText}`;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error('No content received from AI');
        }

        try {
            // Attempt to parse JSON directly
            return JSON.parse(content);
        } catch (e) {
            // If the model wrapped the JSON in markdown code blocks, try to extract it
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }
            throw new Error('Failed to parse AI response as JSON');
        }

    } catch (error) {
        console.error('AI Optimization Error:', error);
        throw error;
    }
}
