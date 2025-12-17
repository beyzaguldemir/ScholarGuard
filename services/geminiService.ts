import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    manuscriptText: { type: Type.STRING },
    summary: { type: Type.STRING },
    overallScore: { type: Type.NUMBER },
    comments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          snippet: { type: Type.STRING },
          issue: { type: Type.STRING },
          explanation: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["Language", "Style", "Structure", "Format", "Risk"] },
          severity: { type: Type.STRING, enum: ["Minor", "Major", "Critical"] },
        },
        required: ["snippet", "issue", "explanation", "category", "severity"],
      },
    },
    visualSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["Chart", "Table"] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          chartData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Kategori veya zaman dilimi adı." },
                value: { type: Type.NUMBER, description: "Sayısal değer." }
              },
              required: ["label", "value"]
            }
          },
          tableData: {
            type: Type.OBJECT,
            properties: {
              headers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tablo sütun başlıkları." },
              rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } }, description: "Tablo satır verileri." }
            },
            required: ["headers", "rows"]
          },
          config: {
            type: Type.OBJECT,
            properties: {
              chartType: { type: Type.STRING, enum: ["bar", "line", "pie"] }
            }
          }
        },
        required: ["type", "title", "description"]
      }
    },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING },
          task: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Pending", "Passed", "Failed"] },
          description: { type: Type.STRING },
        },
        required: ["id", "category", "task", "status", "description"],
      },
    },
    deskRejectionRisks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING },
          level: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
          mitigation: { type: Type.STRING },
        },
        required: ["risk", "level", "mitigation"],
      },
    },
  },
  required: ["manuscriptText", "summary", "overallScore", "comments", "checklist", "deskRejectionRisks", "visualSuggestions"],
};

export const analyzeManuscript = async (text: string): Promise<AnalysisResult> => {
  const modelId = "gemini-3-flash-preview"; 

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `
      GÖREV: Sen akademik bir inceleme asistanısın. Microsoft Word 'Gözden Geçir' modunda çalışıyormuş gibi davran.
      
      EK GÖREV: Metin içindeki istatistiksel bulguları, deney sonuçlarını veya karşılaştırmalı verileri tespit et. 
      Eğer metindeki veriler bir grafik (bar, line, pie) veya tablo ile daha iyi ifade edilebilecekse, 'visualSuggestions' kısmında bu verileri yapılandırılmış şekilde döndür.
      Grafikler için 'chartData' (label/value çiftleri), tablolar için 'tableData' (headers ve rows) kullan.
      
      KRİTİK KURALLAR:
      1. ASLA metni yeniden yazma, değiştirmeyin veya yeni akademik içerik eklemeyin.
      2. SADECE metnin yanına 'yorumlar' ekleyerek sorunları belirtin.
      3. Çizelgeler ve tablolar oluştururken metindeki mevcut sayısal verileri kullanın, yeni veri uydurmayın.
      4. Tüm geri bildirimler TÜRKÇE olmalıdır.
      
      ANALİZ KATEGORİLERİ:
      - Dil ve Yazım (Language)
      - Akademik Üslup (Style)
      - Yapısal Akış (Structure)
      - Biçimlendirme (Format)
      - Desk Rejection Riskleri (Risk)

      ANALİZ EDİLECEK METİN:
      ${text.substring(0, 30000)}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "Sen bir akademik editörsün. Metindeki verileri görselleştirmek ve tablolaştırmak için öneriler sunarsın ama metnin kendisini asla değiştirmezsin.",
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      if (!data.manuscriptText) data.manuscriptText = text;
      return data as AnalysisResult;
    } else {
      throw new Error("Analiz motorundan yanıt alınamadı.");
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
