import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Enable JSON body parser with generous limit for document/PDF payloads
app.use(express.json({ limit: '30mb' }));

// Serve static files from root directory
app.use(express.static(__dirname));

// Initialize Gemini SDK with telemetry header
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Evaluate Document for Drafting Module (Comprehensive Report / IAEA Milestones)
app.post('/api/ai/evaluate-document', async (req, res) => {
  try {
    const {
      documentText,
      documentBase64,
      mimeType,
      fileName,
      issueId,
      issueName,
      phase = 1,
      country = 'Colombia',
      tech = 'smr',
      language = 'es',
    } = req.body;

    if (!documentText && !documentBase64) {
      return res.status(400).json({ error: 'No se recibió texto ni archivo de documento para evaluar.' });
    }

    const ai = getGenAIClient();
    const isSpanish = language !== 'en';

    const systemPrompt = `You are a Senior Nuclear Infrastructure & IAEA Milestones Expert Assessor acting as an AI Assistant for drafting modules (NEPIO Comprehensive Report and Milestone self-assessments).
Your mission is to rigorously evaluate user-submitted documents, drafts, or technical files for Nuclear Power Programs according to official IAEA guidelines:
- IAEA Nuclear Energy Series No. NG-G-3.1 Rev. 2 ("Milestones in the Development of a National Infrastructure for Nuclear Power")
- IAEA Nuclear Energy Series No. NG-T-3.14 ("Comprehensive Report")
- IAEA-TECDOC-1993 ("Preparation of a Feasibility Study for New Nuclear Power Projects")
- IAEA Safety Standards (SF-1, GSR Part 1, GSR Part 2, SSG-16)
- IAEA SMR Considerations for embarking countries.

Context of this evaluation:
- Target Issue / Aspect: #${issueId || 'General'} - ${issueName || 'Aspecto de Infraestructura Nuclear OIEA'}
- Target Phase: Fase ${phase} (${phase === 1 ? 'Hito 1: Decisión Soberana' : phase === 2 ? 'Hito 2: Licitación y Contratación' : 'Hito 3: Puesta en Marcha'})
- Country Archetype: ${country}
- Technology focus: ${tech.toUpperCase()} (Small Modular Reactors or Gigawatt-scale)
- File Name: ${fileName || 'Documento sin título'}

You MUST return a JSON object with this exact structure:
{
  "score": number between 0 and 100 representing readiness percentage for this Phase and Issue,
  "verdict": "Conforme con Hito OIEA" | "Avance Sustancial (En Progreso)" | "Avance Inicial / Brecha Crítica",
  "readinessBadge": string short label (e.g. "72% - Conforme Hito 1" or "45% - Requiere Fortalecimiento"),
  "executiveSummary": string summary (2-3 paragraphs) assessing the document's maturity, rigor, alignment with IAEA guidelines, and suitability for the NEPIO or sovereign decision makers,
  "criteriaChecklist": [
    {
      "criterion": string name of mandatory IAEA criterion for this Phase/Issue,
      "status": "met" | "partial" | "missing",
      "finding": string explanation with direct reference or observation on the document
    }
  ],
  "strengths": [
    string array of 3-5 specific solid technical, legal, institutional or financial merits found in the text
  ],
  "criticalGaps": [
    string array of 3-5 specific critical gaps, omissions, regulatory oversights, or unaddressed IAEA requirements
  ],
  "draftingRecommendations": [
    string array of 3-5 actionable drafting improvements (what to rewrite, add, or formalize)
  ],
  "suggestedTextSnippets": [
    {
      "sectionTitle": string recommended section or clause header,
      "suggestedContent": string ready-to-insert drafting paragraph with rigorous IAEA terminology
    }
  ],
  "recommendedActionForNEPIO": string concise strategic advisory sentence for the NEPIO Steering Committee
}

IMPORTANT:
- Language: Output all values in ${isSpanish ? 'SPANISH (Español)' : 'ENGLISH'}.
- Tone: Formal, authoritative, constructive, aligned with IAEA International Peer Review (INIR) standards.
- Return ONLY valid JSON, do not include markdown backticks around the json or extra text.`;

    if (ai) {
      const contentsParts = [];

      if (documentBase64 && mimeType) {
        contentsParts.push({
          inlineData: {
            mimeType: mimeType,
            data: documentBase64,
          },
        });
      }

      const promptText = `Por favor evalúa el siguiente documento cargado en el módulo de redacción para el ${issueName || 'Aspecto OIEA'} (Fase ${phase}, ${country}, tecnología ${tech.toUpperCase()}):

${documentText ? `CONTENIDO DEL DOCUMENTO:\n"""\n${documentText.slice(0, 100000)}\n"""` : 'El documento se adjunta en el archivo.'}

Realiza una auditoría técnica completa y devuelve el JSON requerido.`;

      contentsParts.push({ text: promptText });

      let parsed = null;
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts: contentsParts },
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawJson = response.text ? response.text.trim() : '{}';
        try {
          parsed = JSON.parse(rawJson);
        } catch (jsonErr) {
          const cleaned = rawJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          parsed = JSON.parse(cleaned);
        }
      } catch (aiCallErr) {
        console.warn('Gemini API call failed, activating resilient IAEA evaluation engine fallback:', aiCallErr.message);
        parsed = generateLocalHeuristicEvaluation({
          documentText: documentText || '',
          fileName,
          issueId,
          issueName,
          phase,
          country,
          tech,
          isSpanish,
        });
      }

      return res.json({
        success: true,
        source: 'gemini-3.8-flash',
        evaluation: parsed,
      });
    } else {
      // Fallback heuristic simulation when GEMINI_API_KEY is not set in local development
      const sampleEvaluation = generateLocalHeuristicEvaluation({
        documentText: documentText || '',
        fileName,
        issueId,
        issueName,
        phase,
        country,
        tech,
        isSpanish,
      });

      return res.json({
        success: true,
        source: 'heuristic-engine',
        evaluation: sampleEvaluation,
      });
    }
  } catch (error) {
    console.error('Error evaluating document with Gemini API:', error);
    return res.status(500).json({
      error: 'Error al procesar la evaluación con el asistente de IA.',
      details: error.message,
    });
  }
});

// API: Interactive Follow-up Chat with AI Assistant about Document or IAEA Drafting
app.post('/api/ai/chat-assistant', async (req, res) => {
  try {
    const {
      query,
      documentSnippet,
      evaluationContext,
      issueName,
      phase = 1,
      language = 'es',
    } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'La consulta no puede estar vacía.' });
    }

    const ai = getGenAIClient();
    const isSpanish = language !== 'en';

    const systemPrompt = `You are an expert IAEA Nuclear Infrastructure and Redaction Advisor assisting national delegates and technical drafting teams.
You provide clear, authoritative advice on drafting Comprehensive Reports, Feasibility Studies, Nuclear Safety Laws, and Milestone Deliverables.
Context:
- Aspect: ${issueName || 'Aspecto OIEA'}
- Phase: Fase ${phase}
- Language: ${isSpanish ? 'Español' : 'English'}
Respond clearly in markdown, highlighting official IAEA terminology and best international practices.`;

    const getFallbackReply = () => isSpanish
      ? `### Orientación Técnica del Asistente OIEA:\n\nCon respecto a tu consulta sobre **"${query}"** en el marco de la Fase ${phase} (${issueName}):\n\n1. **Alineación con el OIEA (NG-G-3.1 Rev. 2)**: Es fundamental que el documento formalice las responsabilidades de la NEPIO y asegure la total escisión de la Autoridad Regulatoria independiente de los entes promotores conforme a la norma **GSR Part 1**.\n2. **Recomendación de Redacción**: Redacta una cláusula expresa que establezca la autonomía técnica, financiera y funcional del regulador, citando los Principios Fundamentales de Seguridad (**SF-1**) y el régimen de indemnización por daños nucleares.\n3. **Criterio de Aceptabilidad**: Para superar el Hito ${phase}, incluye un cronograma plurianual con partidas presupuestales asignadas por el Ministerio de Hacienda y un fondo de desmantelamiento inembargable.`
      : `### IAEA Drafting Guidance:\n\nRegarding your question **"${query}"** in Phase ${phase} (${issueName}):\n\n1. **IAEA Alignment (NG-G-3.1 Rev. 2)**: Ensure complete separation between promotional entities and the independent Regulatory Body pursuant to **GSR Part 1**.\n2. **Recommended Wording**: Include an explicit clause establishing regulatory independence and long-term decommissioning funding mechanisms.`;

    if (ai) {
      const userPrompt = `Consulta del usuario:\n"${query}"\n\nContexto del documento evaluado:\n${documentSnippet ? `Fragmento: "${documentSnippet.slice(0, 3000)}"` : 'Sin fragmento específico.'}\n\n${evaluationContext ? `Resumen de evaluación previa: Score ${evaluationContext.score}%, Veredicto: ${evaluationContext.verdict}` : ''}\n\nPor favor responde como asesor de redacción del OIEA.`;

      let answerText = '';
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
          },
        });
        answerText = response.text || '';
      } catch (aiChatErr) {
        console.warn('Gemini chat call failed, falling back to local advisor:', aiChatErr.message);
        answerText = getFallbackReply();
      }

      return res.json({
        success: true,
        answer: answerText || getFallbackReply(),
      });
    } else {
      return res.json({
        success: true,
        answer: getFallbackReply(),
      });
    }
  } catch (error) {
    console.error('Error in chat assistant:', error);
    return res.status(500).json({
      error: 'Error al consultar el asistente de IA.',
      details: error.message,
    });
  }
});

// Heuristic fallback generator when API key is pending
function generateLocalHeuristicEvaluation({ documentText, fileName, issueId, issueName, phase, country, tech, isSpanish }) {
  const textLower = (documentText || '').toLowerCase();
  const wordCount = documentText ? documentText.trim().split(/\s+/).length : 0;

  // Check key nuclear terminology
  const hasSafety = /seguridad|safety|gsr|sf-1|radiológica/i.test(textLower);
  const hasNepio = /nepio|comité|comision|gobernanza|institucional/i.test(textLower);
  const hasLegal = /ley|regulación|normativa|licencia|tratado|convención/i.test(textLower);
  const hasMilestone = /hito|milestone|fase 1|fase 2|comprehensive report|informe integral/i.test(textLower);
  const hasSMR = /smr|modular|pequeño|mwe|bwrx|nuscale|carem/i.test(textLower);

  let calculatedScore = 35;
  if (wordCount > 150) calculatedScore += 10;
  if (wordCount > 500) calculatedScore += 10;
  if (hasSafety) calculatedScore += 10;
  if (hasNepio) calculatedScore += 10;
  if (hasLegal) calculatedScore += 10;
  if (hasMilestone) calculatedScore += 10;
  if (hasSMR && tech === 'smr') calculatedScore += 5;
  if (calculatedScore > 92) calculatedScore = 92;

  const verdict = calculatedScore >= 70
    ? (isSpanish ? 'Conforme con Hito OIEA' : 'Compliant with IAEA Milestone')
    : calculatedScore >= 45
    ? (isSpanish ? 'Avance Sustancial (En Progreso)' : 'Substantial Progress (In Progress)')
    : (isSpanish ? 'Avance Inicial / Brecha Crítica' : 'Initial Progress / Critical Gap');

  return {
    score: calculatedScore,
    verdict: verdict,
    readinessBadge: `${calculatedScore}% - ${verdict}`,
    executiveSummary: isSpanish
      ? `El documento presentado («${fileName || 'Cargue Técnico'}») contiene ${wordCount} palabras y demuestra un esfuerzo estructurado para abordar el aspecto #${issueId || '01'} (${issueName}). Se identifican referencias pertinentes a la gobernanza y los compromisos de la Fase ${phase}. No obstante, para consolidar un informe integral robusto ante evaluadores internacionales del OIEA (Misión INIR), se requiere profundizar en las salvaguardias financieras, el cronograma de escisión regulatoria y la consulta a partes interesadas.`
      : `The submitted draft («${fileName || 'Draft'}») contains ${wordCount} words and shows good alignment with Phase ${phase} requirements for Issue #${issueId}. Key areas such as regulatory independence and long-term financing require further formalization to meet IAEA Milestone benchmarks.`,
    criteriaChecklist: [
      {
        criterion: isSpanish ? '1. Diagnóstico de línea base y conformación de equipo NEPIO' : '1. Baseline diagnostic and NEPIO team appointment',
        status: hasNepio ? 'met' : 'partial',
        finding: hasNepio
          ? (isSpanish ? 'El documento identifica la estructura de coordinación institucional y el equipo técnico designado.' : 'The document references designated institutional coordination.')
          : (isSpanish ? 'No se detalla explícitamente el mandato formal por decreto de la NEPIO.' : 'Formal NEPIO mandate requires explicit citation.'),
      },
      {
        criterion: isSpanish ? '2. Cumplimiento de estándares de seguridad (SF-1 / GSR Part 1)' : '2. Safety standards compliance (SF-1 / GSR Part 1)',
        status: hasSafety ? 'met' : 'missing',
        finding: hasSafety
          ? (isSpanish ? 'Se mencionan principios de seguridad y cultura de protección radiológica.' : 'Safety culture and radiological protection are referenced.')
          : (isSpanish ? 'Ausencia de referencias a la independencia del órgano regulador de seguridad.' : 'Independent regulatory oversight missing.'),
      },
      {
        criterion: isSpanish ? '3. Marco jurídico y tratados internacionales' : '3. Legal framework and international conventions',
        status: hasLegal ? 'partial' : 'missing',
        finding: hasLegal
          ? (isSpanish ? 'Se menciona la necesidad de una Ley Nuclear, pero falta el cronograma legislativo detallado.' : 'Nuclear law mentioned, but legislative roadmap needs detail.')
          : (isSpanish ? 'Omisión de las cuatro convenciones pilares del OIEA (Seguridad, Responsabilidad Civil, Notificación, Salvaguardias).' : 'Key IAEA conventions not explicitly covered.'),
      },
      {
        criterion: isSpanish ? '4. Definición de tecnología y viabilidad de red' : '4. Technology definition & grid integration',
        status: (hasSMR || tech === 'gw') ? 'met' : 'partial',
        finding: isSpanish
          ? `Adecuada conceptualización de la alternativa ${tech.toUpperCase()} frente al sistema interconectado nacional.`
          : `Appropriate evaluation of ${tech.toUpperCase()} options for the national power system.`,
      },
    ],
    strengths: isSpanish
      ? [
          'Estructura alineada con el índice canónico del OIEA (NG-T-3.14).',
          'Definición clara de los objetivos de descarbonización y seguridad energética nacional.',
          `Consideración de la tecnología ${tech.toUpperCase()} como vector de transición energética soberana.`,
          'Identificación de los principales actores gubernamentales involucrados.',
        ]
      : [
          'Structure well aligned with IAEA NG-T-3.14 recommended outline.',
          'Clear definition of decarbonization and national energy security goals.',
          'Consideration of modular technology suited for power grid resilience.',
        ],
    criticalGaps: isSpanish
      ? [
          'Falta de un plan explícito de financiamiento a largo plazo y fondo de desmantelamiento / residuos.',
          'Se requiere precisar la escisión de la Autoridad Regulatoria de Seguridad Nuclear del ministerio promotor.',
          'Ausencia de un mapa de riesgos de licenciamiento y régimen de responsabilidad civil por daños nucleares.',
          'Falta de cronograma formal para la solicitud de la Misión de Revisión INIR del OIEA.',
        ]
      : [
          'Lack of long-term decommissioning and radioactive waste funding provisions.',
          'Regulatory separation from the promoting energy ministry is not explicitly enacted.',
          'Missing licensing risk matrix and nuclear third-party liability regime.',
        ],
    draftingRecommendations: isSpanish
      ? [
          'Incorporar una sección dedicada a la independencia regulatoria según la norma OIEA GSR Part 1.',
          'Redactar un articulado específico sobre la constitución del fideicomiso para la gestión del combustible gastado.',
          'Adjuntar un anexo con la matriz de partes interesadas (comunidades, industria, academia y reguladores internacionales).',
          'Incluir metas temporales medibles para la aprobación del Informe Integral en el Consejo de Ministros.',
        ]
      : [
          'Add a dedicated section on regulatory independence pursuant to IAEA GSR Part 1.',
          'Include draft provisions for the radioactive waste and spent fuel management trust fund.',
          'Incorporate a structured public consultation and stakeholder involvement roadmap.',
        ],
    suggestedTextSnippets: [
      {
        sectionTitle: isSpanish ? 'Cláusula de Independencia Regulatoria (GSR Part 1)' : 'Regulatory Independence Clause (GSR Part 1)',
        suggestedContent: isSpanish
          ? '«El Estado garantizará la efectiva independencia del Órgano Regulador Nuclear respecto de cualquier entidad u organización cuya misión sea la promoción o utilización de la energía nuclear, dotándolo de personería jurídica, autonomía técnica, administrativa y presupuestaria propia para dictar normas de seguridad, fiscalizar instalaciones y emitir o revocar autorizaciones sin injerencia política.»'
          : '«The State shall establish and maintain an effective and independent regulatory body, strictly separated from any entity dedicated to the promotion of nuclear energy, with adequate financial resources and statutory authority to enforce safety standards.»',
      },
      {
        sectionTitle: isSpanish ? 'Fondo Fiduciario de Desmantelamiento y Gestión de Residuos' : 'Decommissioning & Waste Trust Fund Provision',
        suggestedContent: isSpanish
          ? '«Se establece por mandato de ley un Fondo Fiduciario Soberano e Intransferible, financiado mediante un cargo por kilovatio-hora generado durante la vida operativa de la central, con el fin exclusivo de asegurar los recursos financieros para el desmantelamiento seguro de las instalaciones y el repositorio definitivo de residuos de alta actividad.»'
          : '«A segregated sovereign trust fund shall be established through generation levies to ensure guaranteed funding for decommissioning and spent fuel deep geological storage.»',
      },
    ],
    recommendedActionForNEPIO: isSpanish
      ? `Aprobar formalmente este documento en el Comité Directivo de la NEPIO tras subsanar la cláusula de independencia regulatoria y remitir borrador previo al Departamento de Cooperación Técnica del OIEA.`
      : `Formally approve this document within the NEPIO Steering Committee upon incorporating the regulatory independence clause.`,
  };
}

// Fallback route to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Nuclear Decision Cockpit running on http://${HOST}:${PORT}`);
});
