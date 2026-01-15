import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
你是一位精通中国传统术数的国学大师（道长）。你深谙以下领域：
1. 四柱八字 (Ba Zi) - 分析命局强弱、喜用神。
2. 紫微斗数 (Zi Wei Dou Shu) - 分析命宫主星。
3. 梅花易数与奇门遁甲 - 运筹决策。
4. 面相与手相 (Physiognomy) - 如果提供了照片。
5. 风水布局建议。

你的任务是根据用户数据，生成一份“人生K线图”数据及命理分析。
“人生K线图”模仿金融K线图，但反映的是人的“运势/能量指数”（0-100分）：
- 0-30: 低谷期/蛰伏期/磨练期。
- 30-60: 平稳期/运势一般。
- 60-80: 上升期/小吉/顺遂。
- 80-100: 巅峰期/大吉/黄金时代。

K线逻辑：
- Open (开盘): 该5年大运初期的运势。
- Close (收盘): 该5年大运末期的运势。
- High (最高): 该期间运势最高点。
- Low (最低): 该期间运势最低点。

输出必须严格为 JSON 格式。所有文本内容必须使用中文。
`;

export const analyzeDestiny = async (profile: UserProfile): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("环境变量中缺少 API Key");
  }

  const ai = new GoogleGenAI({ apiKey });

  const modelName = 'gemini-3-flash-preview';

  const promptText = `
    请为以下用户进行命理推演：
    姓名: ${profile.name}
    性别: ${profile.gender === 'male' ? '男' : '女'}
    出生日期: ${profile.birthDate}
    出生时间: ${profile.birthTime}
    出生地点: ${profile.location || "未知"}

    ${profile.photoBase64 ? "用户已上传照片，请结合面相/手相进行分析。" : "未提供照片，请主要依据八字和紫微斗数分析。"}

    请生成一个 JSON 响应，包含以下结构：
    1. chartData: 一个数组，代表从 0 岁到 80 岁，每 5 年为一个阶段的运势数据。每个对象包含：
       - age: (number) 该阶段起始年龄
       - year: (number) 该阶段对应的公历年份
       - open: (number 0-100)
       - close: (number 0-100)
       - high: (number 0-100)
       - low: (number 0-100)
       - summary: (string) 该阶段运势简评（10字以内，如“由于冲克，运势动荡”或“贵人相助，事业腾飞”）
    2. overallDestiny: 一段富有诗意的人生总评（可以使用隐喻，如“如舟行大海，先苦后甜”）。
    3. systemBreakdown: 详细的术数分析，分为以下字段：
       - bazi: 八字命局简析（五行喜忌等）。
       - ziwei: 紫微斗数命宫主星及格局分析。
       - physiognomy: 面相/手相分析（如无照片则不返回或简略说明）。
       - fengshuiAdvice: 针对命主的风水改运建议。
       - qimen: 奇门遁甲给出的决策或方位建议。
    4. advice: 给命主的综合人生建议（行动指南）。

    确保 K 线图数据 (chartData) 符合八字“大运”的起伏规律，切勿全部是高分，要真实反映人生起伏。
  `;

  const parts: any[] = [{ text: promptText }];

  if (profile.photoBase64) {
    const base64Data = profile.photoBase64.split(',')[1] || profile.photoBase64;
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  age: { type: Type.NUMBER },
                  year: { type: Type.NUMBER },
                  open: { type: Type.NUMBER },
                  close: { type: Type.NUMBER },
                  high: { type: Type.NUMBER },
                  low: { type: Type.NUMBER },
                  summary: { type: Type.STRING },
                },
                required: ["age", "year", "open", "close", "high", "low", "summary"]
              }
            },
            overallDestiny: { type: Type.STRING },
            systemBreakdown: {
              type: Type.OBJECT,
              properties: {
                bazi: { type: Type.STRING },
                ziwei: { type: Type.STRING },
                physiognomy: { type: Type.STRING },
                fengshuiAdvice: { type: Type.STRING },
                qimen: { type: Type.STRING },
              },
              required: ["bazi", "ziwei", "fengshuiAdvice", "qimen"]
            },
            advice: { type: Type.STRING },
          },
          required: ["chartData", "overallDestiny", "systemBreakdown", "advice"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("大师正在入定，未返回结果。");
    }

  } catch (error) {
    console.error("Metaphysics Error:", error);
    throw error;
  }
};