// =========================================================================
// IAEA REDACTION & DOCUMENT EVALUATION AI ASSISTANT
// Powered by Gemini 3.8 Flash & IAEA Milestones Guidelines
// (NG-G-3.1 Rev. 2, NG-T-3.14, IAEA-TECDOC-1993, GSR Part 1)
// =========================================================================

(function(window) {
  // Estado local del asistente de IA
  let currentLoadedFile = null; // { name, size, type, base64, text }
  let lastEvaluationResult = null;
  let chatHistory = [];

  // LISTA AUTORIZADA DE LOS 19 ASPECTOS OIEA (FALLBACK GARANTIZADO)
  const DEFAULT_19_ISSUES = [
    { id: 1, code: '01', name: { es: 'Posición Nacional y NEPIO', en: 'National Position & NEPIO' } },
    { id: 2, code: '02', name: { es: 'Seguridad Nuclear', en: 'Nuclear Safety' } },
    { id: 3, code: '03', name: { es: 'Marco de Gestión', en: 'Management Framework' } },
    { id: 4, code: '04', name: { es: 'Financiamiento y Financiación', en: 'Funding & Financing' } },
    { id: 5, code: '05', name: { es: 'Marco Legal Nuclear', en: 'Legal Framework' } },
    { id: 6, code: '06', name: { es: 'Marco Regulatorio', en: 'Regulatory Framework' } },
    { id: 7, code: '07', name: { es: 'Salvaguardias Nucleares', en: 'Safeguards' } },
    { id: 8, code: '08', name: { es: 'Protección Radiológica', en: 'Radiation Protection' } },
    { id: 9, code: '09', name: { es: 'Red Eléctrica e Infraestructura', en: 'Electrical Grid' } },
    { id: 10, code: '10', name: { es: 'Recursos Humanos y Educación', en: 'Human Resource Development' } },
    { id: 11, code: '11', name: { es: 'Partes Interesadas y Comunicación', en: 'Stakeholder Involvement' } },
    { id: 12, code: '12', name: { es: 'Emplazamiento e Instalaciones', en: 'Site & Supporting Facilities' } },
    { id: 13, code: '13', name: { es: 'Protección Ambiental', en: 'Environmental Protection' } },
    { id: 14, code: '14', name: { es: 'Planificación de Emergencias (EP&R)', en: 'Emergency Planning & Response' } },
    { id: 15, code: '15', name: { es: 'Seguridad Física Nuclear', en: 'Nuclear Security' } },
    { id: 16, code: '16', name: { es: 'Ciclo del Combustible Nuclear', en: 'Nuclear Fuel Cycle' } },
    { id: 17, code: '17', name: { es: 'Desechos Radiactivos y Combustible Gastado', en: 'Radioactive Waste & Spent Fuel' } },
    { id: 18, code: '18', name: { es: 'Participación Industrial Nacional', en: 'Industrial Involvement' } },
    { id: 19, code: '19', name: { es: 'Adquisiciones y Cadena de Suministro', en: 'Procurement' } }
  ];

  // MUESTRAS OFICIALES PRE-CARGADAS DE ALTA FIDELIDAD TÉCNICA
  const SAMPLE_DOCUMENTS = {
    sample1: {
      id: 1,
      chapter: 1,
      phase: 1,
      title: "🇨🇴 Borrador Capítulo 1: Política Nuclear y NEPIO (Colombia)",
      fileName: "CR_Capitulo_01_Politica_Nacional_NEPIO_Colombia_2026.docx",
      text: `REPÚBLICA DE COLOMBIA - COMISIÓN DE PREPARACIÓN NUCLEAR (NEPIO)
INFORME INTEGRAL DE PREFACTIBILIDAD (COMPREHENSIVE REPORT) - HITO 1
CAPÍTULO 1: FUNDAMENTO ESTRATÉGICO, POSICIÓN NACIONAL Y GOBERNANZA NEPIO

1.1 JUSTIFICACIÓN DE LA OPCIÓN NUCLEAR EN LA MATRIZ ENERGÉTICA
Colombia enfrenta una vulnerabilidad hidrológica crítica derivada del Fenómeno de El Niño, el cual reduce la disponibilidad de los embalses hidroeléctricos a niveles inferiores al 29%, forzando la quema masiva de combustibles fósiles caros y contaminantes (gas natural y carbón). La Ley de Transición Energética Justa y las metas de Descarbonización 2050 (COP28) exigen la incorporación de energía de base firme, limpia y libre de emisiones 24/7.
La inclusión de Reactores Modulares Pequeños (SMR) en nodos estratégicos como La Guajira, Boyacá y el Valle del Cauca permitirá reemplazar centrales térmicas de carbón en proceso de desmantelamiento (repowering), asegurando confiabilidad al Sistema Interconectado Nacional (SIN) y apoyando la producción de hidrógeno limpio y desalinización de agua marina.

1.2 COMPROMISO DE ESTADO Y HORIZONTE DE 100 AÑOS
El Gobierno Nacional reconoce que la decisión soberana de iniciar un programa nucleoeléctrico trasciende periodos presidenciales ordinarios de 4 años y constituye un compromiso de Estado superior a 100 años (10 años de desarrollo de infraestructura y licenciamiento, 60 años de vida operativa del reactor y 30+ años de custodia segura y desmantelamiento). Se propone conformar una Comisión Asesora Multipartidista y un Pacto Nacional por la Seguridad Energética en el Congreso de la República.

1.3 CREACIÓN Y MANDATO DE LA NEPIO (ORGANIZACIÓN PROMOTORA)
Se propone la expedición de un Decreto Presidencial que cree formalmente el Comité Directivo de la NEPIO (Nuclear Energy Programme Implementing Organization), presidido por el Ministro de Minas y Energía, con secretaría técnica conjunta entre la UPME, el Servicio Geológico Colombiano (SGC) y el Departamento Nacional de Planeación (DNP).
La NEPIO coordinará los 19 aspectos de infraestructura del OIEA durante la Fase 1, elaborará el Informe Integral definitivo y formulará las recomendaciones para la decisión ministerial y presidencial de Hito 1.

1.4 PLAN DE CONSULTA CIUDADANA Y PARTICIPACIÓN SOCIAL
Se proyectan audiencias territoriales tempranas con comunidades locales, agremiaciones industriales (ANDI, ACOLGEN), sector académico y ambiental para garantizar la transparencia, licenciamiento social y combate a la desinformación radiológica.

1.5 PENDIENTES CRÍTICOS Y HOJA DE RUTA
- Tramitar la Ley Nuclear Marco en el Congreso de la República.
- Asegurar la asignación de presupuesto plurianual para los estudios de caracterización sismo-geotécnica.
- Gestionar una misión de asesoramiento INIR (Integrated Nuclear Infrastructure Review) del OIEA previa a la decisión final.`
    },

    sample2: {
      id: 5,
      chapter: 5,
      phase: 1,
      title: "⚖️ Borrador Capítulo 5: Marco Legal Nuclear e Independencia Regulatoria (GSR Part 1)",
      fileName: "Anteproyecto_Ley_Nuclear_Integral_Regulador_Autonomo.pdf",
      text: `ANTEPROYECTO DE LEY GENERAL DE ENERGÍA Y SEGURIDAD NUCLEAR
EXPOSICIÓN DE MOTIVOS Y ARTICULADO PRELIMINAR - ASPECTOS 05 Y 06 DEL OIEA

TÍTULO I: PRINCIPIOS GENERALES Y ADHESIÓN A TRATADOS INTERNACIONALES
Artículo 1. Objeto de la Ley. La presente Ley establece el régimen jurídico soberano para el uso pacífico, seguro y protegido de la energía nuclear, la protección radiológica de la población y el medio ambiente, y la gobernanza institucional del sector.
Artículo 2. Adhesión y Cumplimiento de Tratados Internacionales. El Estado ratifica su adhesión a:
1. Convención sobre Seguridad Nuclear (CNS).
2. Convención sobre la Pronta Notificación de Accidentes Nucleares.
3. Convención de Viena sobre Responsabilidad Civil por Daños Nucleares y Protocolo de Enmienda de 1997.
4. Tratado de No Proliferación (TNP) y Acuerdo de Salvaguardias Amplias con Protocolo Adicional del OIEA.

TÍTULO II: CREACIÓN DE LA AUTORIDAD NACIONAL DE SEGURIDAD NUCLEAR (REGULADOR INDEPENDIENTE)
Artículo 12. Creación y Naturaleza Jurídica. Créase la Autoridad Nacional de Seguridad Nuclear (ANSN) como una entidad técnica especializada del orden nacional, con personería jurídica, patrimonio propio, autonomía administrativa, financiera y funcional, independiente de cualquier ministerio o ente encargado de la promoción o explotación comercial de la energía.
Artículo 13. Principio de Separación Regulatoria (OIEA GSR Part 1). Queda expresamente prohibido que la ANSN tenga funciones de fomento, promoción económica, generación o comercialización de energía. Sus decisiones sobre licenciamiento, suspensión o clausura de instalaciones nucleares no podrán ser revocadas por motivos de conveniencia económica o política.
Artículo 14. Régimen de Financiación. La ANSN se financiará mediante tasas de licenciamiento, cargos de supervisión e inspección a los operadores, y un porcentaje asignado del Presupuesto General de la Nación intangible.

TÍTULO III: RESPONSABILIDAD CIVIL Y RÉGIMEN DE FONDOS
Artículo 28. Responsabilidad Objetiva y Exclusiva del Explotador. El operador de una instalación nuclear será el único y estrictamente responsable de cualquier daño nuclear, debiendo constituir una póliza de seguro o garantía financiera obligatoria por un monto no inferior a 300 millones de DEG (Derechos Especiales de Giro).
Artículo 32. Fondo Fiduciario de Desmantelamiento y Gestión de Desechos Radiactivos. Créase el Fondo Nacional de Residuos, financiado con aportes mensuales de la tarifa de generación, con destinación exclusiva e inembargable para la gestión de combustible gastado y el desmantelamiento final de las unidades.`
    },

    sample3: {
      id: 9,
      chapter: 9,
      phase: 1,
      title: "⚛️ Borrador Capítulo 9: Viabilidad SMR y Comparativa Tecnológica",
      fileName: "Estudio_Seleccion_Tecnologia_SMR_vs_Red_Electrica.docx",
      text: `DIAGNOSTICO TÉCNICO DE PRESELECCIÓN DE TECNOLOGÍA REACTOR NUCLEAR
ASPECTOS #09 (TECNOLOGÍA) Y #10 (RED ELÉCTRICA) - FASE 1 OIEA

1. CRITERIOS DE SCREENING TECNOLÓGICO PARA EMBARKING NATIONS
Para un país en Fase 1, la adquisición de una central gigavatio tradicional (1000-1400 MWe) representa un riesgo financiero inaceptable (CAPEX $10B-$15B USD) y supera el límite de contingencia N-1 de la red nacional (que admite fallas máximas de hasta 400-500 MW sin deslastre de carga).
Por ello, la estrategia nacional se orienta exclusivamente a Reactores Modulares Pequeños (SMR) con potencia unitaria entre 77 y 300 MWe, tecnología probada en diseño y con licencia de país de origen avanzada.

2. COMPARATIVA DE DISEÑOS CANDIDATOS (BANCO DE DATOS OIEA ARIS)
A. BWRX-300 (GE Hitachi Nuclear Energy - EE.UU. / Japón):
   - Tipo: BWR de circulación natural sin bombas primarias.
   - Potencia: 300 MWe / 870 MWth.
   - Seguridad: Sistema de condensación pasiva de contención autónomo 7 días sin energía eléctrica externa ni diésel de emergencia.
   - Madurez: Selección firme en Darlington (Canadá) con entrada comercial proyectada para 2029.

B. VOYGR / NuScale Power Module (NuScale Power - EE.UU.):
   - Tipo: PWR integral sumergido en piscina subterránea.
   - Potencia: 77 MWe por módulo (configuraciones de 4 a 6 módulos).
   - Licenciamiento: Primer diseño SMR aprobado por la US NRC.

C. CAREM-25 (CNEA - Argentina):
   - Prototipo PWR integral en construcción activa en Atucha. Excelente referente de cooperación tecnológica regional Sur-Sur.

3. INTEGRACIÓN A LA RED ELÉCTRICA (ASPECTO #10)
Los estudios preliminares de flujo de carga demuestran que módulos de 300 MWe pueden conectarse directamente a subestaciones existentes de 230 kV sin requerir corredores nuevos de transmisión de 500 kV, aprovechando la infraestructura de evacuación de antiguas termoeléctricas de carbón en La Guajira y Boyacá.

4. REQUISITOS PARA LA FASE 2
- Definir el modelo de contratación (EPC Llave en mano vs. Alianza de Co-Inversión).
- Solicitar a los proveedores información sobre garantías de suministro de combustible HALEU / UO2 estándar.`
    }
  };

  // Inicializar interfaz al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    initAiAuditor();
  });

  function initAiAuditor() {
    const fileInput = document.getElementById('ai-doc-file-input');
    const dropzone = document.getElementById('ai-doc-dropzone');
    const textarea = document.getElementById('ai-doc-textarea');
    const wordCountEl = document.getElementById('ai-doc-wordcount');

    // Selector de los 19 aspectos / capítulos
    populateChapterSelect();

    const selChapter = document.getElementById('ai-select-chapter');
    if (selChapter) {
      selChapter.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val !== 'all') {
          const id = parseInt(val, 10);
          if (!isNaN(id) && typeof window.selectIssue === 'function') {
            window.selectIssue(id);
          }
        }
      });
    }

    const selPhase = document.getElementById('ai-select-phase');
    if (selPhase) {
      selPhase.addEventListener('change', (e) => {
        const p = parseInt(e.target.value, 10);
        if (!isNaN(p) && typeof window.setPhase === 'function') {
          window.setPhase(p);
        }
      });
    }

    // Renderizar la Bitácora de Seguimiento persistente
    renderTrackingLedger();

    if (textarea && wordCountEl) {
      textarea.addEventListener('input', () => {
        updateWordCount();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          handleFileSelected(files[0]);
        }
      });
    }

    if (dropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('border-cyan-400', 'bg-cyan-500/10');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('border-cyan-400', 'bg-cyan-500/10');
        }, false);
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
          handleFileSelected(files[0]);
        }
      });
    }
  }

  function updateWordCount() {
    const textarea = document.getElementById('ai-doc-textarea');
    const wordCountEl = document.getElementById('ai-doc-wordcount');
    if (!textarea || !wordCountEl) return;
    const txt = textarea.value.trim();
    const count = txt ? txt.split(/\s+/).length : 0;
    const lang = window.currentLang || 'es';
    wordCountEl.textContent = lang === 'es' ? `${count} palabras` : `${count} words`;
  }

  function getAvailableIssues() {
    if (window.INFRASTRUCTURE_ISSUES && window.INFRASTRUCTURE_ISSUES.length > 0) {
      return window.INFRASTRUCTURE_ISSUES;
    }
    return DEFAULT_19_ISSUES;
  }

  function populateChapterSelect() {
    const sel = document.getElementById('ai-select-chapter');
    if (!sel) return;

    const issuesList = getAvailableIssues();
    const currentVal = sel.value || (window.selectedIssueId ? String(window.selectedIssueId) : '1');
    const lang = window.currentLang || 'es';

    let html = `<optgroup label="${lang === 'es' ? '📋 Cuadernos Técnicos OIEA (19 Issues)' : '📋 IAEA Technical Issues (1 to 19)'}">`;

    issuesList.forEach(issue => {
      const name = (typeof issue.name === 'object') ? (issue.name[lang] || issue.name.es) : issue.name;
      const code = issue.code || String(issue.id).padStart(2, '0');
      html += `<option value="${issue.id}">Issue #${code}: ${name}</option>`;
    });

    html += `</optgroup>`;
    html += `<optgroup label="${lang === 'es' ? '🌐 Documento Consolidado' : '🌐 Consolidated Report'}">`;
    html += `<option value="all">${lang === 'es' ? 'Documento Global (Comprehensive Report Completo)' : 'Global Document (Full Comprehensive Report)'}</option>`;
    html += `</optgroup>`;

    sel.innerHTML = html;
    sel.value = currentVal;
  }

  function handleFileSelected(file) {
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isDocx = file.name.endsWith('.docx') || file.name.endsWith('.doc');
    const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json');

    const fileStatusBox = document.getElementById('ai-doc-file-status');
    const fileNameTxt = document.getElementById('ai-doc-file-name');
    const fileSizeTxt = document.getElementById('ai-doc-file-size');
    const fileBadge = document.getElementById('ai-doc-file-badge');

    const sizeFormatted = (file.size / 1024).toFixed(1) + ' KB';

    currentLoadedFile = {
      name: file.name,
      size: file.size,
      type: file.type || (isPdf ? 'application/pdf' : 'text/plain'),
      base64: null,
      text: null
    };

    if (fileStatusBox) fileStatusBox.classList.remove('hidden');
    if (fileNameTxt) fileNameTxt.textContent = file.name;
    if (fileSizeTxt) fileSizeTxt.textContent = sizeFormatted;
    if (fileBadge) fileBadge.textContent = isPdf ? 'PDF Oficial' : (isDocx ? 'Documento Word' : 'Texto Plano');

    const reader = new FileReader();

    if (isText) {
      reader.onload = (e) => {
        const content = e.target.result;
        currentLoadedFile.text = content;
        const textarea = document.getElementById('ai-doc-textarea');
        if (textarea) {
          textarea.value = content;
          updateWordCount();
        }
      };
      reader.readAsText(file);
    } else {
      // PDF or binary document: read as DataURL to extract base64 for Gemini
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const base64Data = dataUrl.split(',')[1];
        currentLoadedFile.base64 = base64Data;
        const textarea = document.getElementById('ai-doc-textarea');
        if (textarea && !textarea.value) {
          textarea.value = `[Documento adjunto: ${file.name} (${sizeFormatted}) listo para evaluación con Gemini AI]`;
          updateWordCount();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function clearDocument() {
    currentLoadedFile = null;
    const fileInput = document.getElementById('ai-doc-file-input');
    if (fileInput) fileInput.value = '';
    const fileStatusBox = document.getElementById('ai-doc-file-status');
    if (fileStatusBox) fileStatusBox.classList.add('hidden');
    const textarea = document.getElementById('ai-doc-textarea');
    if (textarea) textarea.value = '';
    updateWordCount();
  }

  function loadSample(sampleKey) {
    const sample = SAMPLE_DOCUMENTS[sampleKey];
    if (!sample) return;

    clearDocument();

    const textarea = document.getElementById('ai-doc-textarea');
    if (textarea) {
      textarea.value = sample.text;
      updateWordCount();
    }

    const selChapter = document.getElementById('ai-select-chapter');
    if (selChapter) selChapter.value = String(sample.id);

    const selPhase = document.getElementById('ai-select-phase');
    if (selPhase) selPhase.value = String(sample.phase);

    if (typeof window.selectIssue === 'function' && sample.id) {
      window.selectIssue(sample.id);
    }
    if (typeof window.setPhase === 'function' && sample.phase) {
      window.setPhase(sample.phase);
    }

    currentLoadedFile = {
      name: sample.fileName,
      size: sample.text.length,
      type: 'text/plain',
      base64: null,
      text: sample.text
    };

    const fileStatusBox = document.getElementById('ai-doc-file-status');
    const fileNameTxt = document.getElementById('ai-doc-file-name');
    const fileSizeTxt = document.getElementById('ai-doc-file-size');
    const fileBadge = document.getElementById('ai-doc-file-badge');

    if (fileStatusBox) fileStatusBox.classList.remove('hidden');
    if (fileNameTxt) fileNameTxt.textContent = sample.fileName;
    if (fileSizeTxt) fileSizeTxt.textContent = (sample.text.length / 1024).toFixed(1) + ' KB';
    if (fileBadge) fileBadge.textContent = 'Muestra Oficial OIEA';

    // Scroll to action area
    const evalBtn = document.getElementById('ai-eval-btn');
    if (evalBtn) {
      evalBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Ejecución de la evaluación con IA
  async function evaluateDocument() {
    const textarea = document.getElementById('ai-doc-textarea');
    const textContent = textarea ? textarea.value.trim() : '';

    if (!textContent && (!currentLoadedFile || (!currentLoadedFile.text && !currentLoadedFile.base64))) {
      alert(window.currentLang === 'es' 
        ? 'Por favor sube un documento o escribe el texto del borrador a auditar.' 
        : 'Please upload a document or enter the draft text to evaluate.');
      return;
    }

    const selChapter = document.getElementById('ai-select-chapter');
    const selPhase = document.getElementById('ai-select-phase');

    const issueVal = selChapter ? selChapter.value : '1';
    let issueId = parseInt(issueVal);
    let issueName = 'Comprehensive Report';
    let issueCode = '01';
    
    const issuesList = getAvailableIssues();
    if (issueVal !== 'all' && issuesList) {
      const found = issuesList.find(i => i.id === issueId);
      if (found) {
        issueName = (typeof found.name === 'object') ? (found.name[window.currentLang || 'es'] || found.name.es) : found.name;
        issueCode = found.code || String(found.id).padStart(2, '0');
      }
    } else {
      issueId = 0;
      issueCode = 'GLOBAL';
      issueName = window.currentLang === 'es' ? 'Informe Integral Completo' : 'Full Comprehensive Report';
    }

    const targetPhase = selPhase ? parseInt(selPhase.value) : (window.currentPhase || 1);
    const country = window.currentCountry || 'colombia';
    const tech = window.currentTech || 'smr';
    const lang = window.currentLang || 'es';

    // UI Loading state
    const loadingEl = document.getElementById('ai-eval-loading');
    const resultsEl = document.getElementById('ai-eval-results');
    const evalBtn = document.getElementById('ai-eval-btn');

    if (loadingEl) loadingEl.classList.remove('hidden');
    if (resultsEl) resultsEl.classList.add('hidden');
    if (evalBtn) {
      evalBtn.disabled = true;
      evalBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    if (loadingEl) {
      loadingEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Rotación de mensajes de auditoría
    startRotatingStatusMessages();

    try {
      const payload = {
        documentText: (currentLoadedFile && currentLoadedFile.text) ? currentLoadedFile.text : textContent,
        documentBase64: (currentLoadedFile && currentLoadedFile.base64) ? currentLoadedFile.base64 : null,
        mimeType: (currentLoadedFile && currentLoadedFile.type) ? currentLoadedFile.type : 'text/plain',
        fileName: currentLoadedFile ? currentLoadedFile.name : 'Borrador Técnico',
        issueId: issueId,
        issueName: issueName,
        phase: targetPhase,
        country: country,
        tech: tech,
        language: lang
      };

      const response = await fetch('/api/ai/evaluate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error en servidor: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success || !data.evaluation) {
        throw new Error(data.error || 'Respuesta inválida del motor de IA');
      }

      // Obtener score actual en Cockpit antes de esta evaluación
      let curCockpitScore = 45;
      if (typeof window.getIssueScore === 'function' && issueId > 0) {
        curCockpitScore = window.getIssueScore({ id: issueId }, targetPhase);
      }

      lastEvaluationResult = {
        ...data.evaluation,
        issueId: issueId,
        issueCode: issueCode,
        issueName: issueName,
        phase: targetPhase,
        currentCockpitScore: curCockpitScore,
        fileName: currentLoadedFile ? currentLoadedFile.name : 'Borrador Técnico',
        approved: false
      };

      renderEvaluationResults(lastEvaluationResult);

    } catch (err) {
      console.error('Error durante la evaluación:', err);
      alert((lang === 'es' ? 'Error al evaluar el documento: ' : 'Error evaluating document: ') + err.message);
    } finally {
      stopRotatingStatusMessages();
      if (loadingEl) loadingEl.classList.add('hidden');
      if (evalBtn) {
        evalBtn.disabled = false;
        evalBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  let statusInterval = null;
  function startRotatingStatusMessages() {
    const statusTxt = document.getElementById('ai-loading-step-txt');
    if (!statusTxt) return;
    const lang = window.currentLang || 'es';
    const steps = lang === 'es' ? [
      '1/4: Extrayendo parámetros y estructura normativa del documento...',
      '2/4: Contrastando contra directrices OIEA NG-G-3.1 Rev. 2 y TECDOC-1993...',
      '3/4: Verificando independencia regulatoria (GSR Part 1) y criterios mandatorios...',
      '4/4: Consolidando dictamen porcentual, brechas y cláusulas recomendadas...'
    ] : [
      '1/4: Extracting technical parameters and provisions from document...',
      '2/4: Cross-referencing against IAEA NG-G-3.1 Rev. 2 and TECDOC-1993...',
      '3/4: Verifying regulatory independence (GSR Part 1) & mandatory criteria...',
      '4/4: Compiling quantitative score, gap analysis, and recommended clauses...'
    ];

    let idx = 0;
    statusTxt.textContent = steps[0];
    statusInterval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      statusTxt.textContent = steps[idx];
    }, 1800);
  }

  function stopRotatingStatusMessages() {
    if (statusInterval) {
      clearInterval(statusInterval);
      statusInterval = null;
    }
  }

  function renderEvaluationResults(evalData) {
    const resultsEl = document.getElementById('ai-eval-results');
    if (!resultsEl) return;

    const lang = window.currentLang || 'es';
    const score = evalData.score || 0;

    // Score & Color
    let colorClass = 'text-rose-400';
    let bgBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    let progressBg = 'from-rose-600 to-amber-500';

    if (score >= 70) {
      colorClass = 'text-emerald-400';
      bgBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      progressBg = 'from-emerald-500 to-cyan-400';
    } else if (score >= 45) {
      colorClass = 'text-amber-400';
      bgBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      progressBg = 'from-amber-500 to-cyan-400';
    }

    // Set Score Card
    const scoreValEl = document.getElementById('ai-res-score-value');
    if (scoreValEl) {
      scoreValEl.textContent = score + '%';
      scoreValEl.className = `text-4xl sm:text-5xl font-black font-mono ${colorClass}`;
    }

    const badgeEl = document.getElementById('ai-res-verdict-badge');
    if (badgeEl) {
      badgeEl.textContent = evalData.verdict || (score >= 70 ? 'Conforme Hito' : 'En Progreso');
      badgeEl.className = `text-xs font-bold px-3 py-1 rounded-full border ${bgBadgeClass}`;
    }

    const progressBar = document.getElementById('ai-res-progress-bar');
    if (progressBar) {
      progressBar.style.width = score + '%';
      progressBar.className = `h-full rounded-full transition-all duration-700 bg-gradient-to-r ${progressBg}`;
    }

    const targetInfoEl = document.getElementById('ai-res-target-info');
    if (targetInfoEl) {
      if (score >= 70) {
        targetInfoEl.innerHTML = `✓ <strong>${lang === 'es' ? 'Nivel Aprobatorio' : 'Milestone Target Met'}</strong> (≥70% OIEA)`;
        targetInfoEl.className = 'text-xs text-emerald-300 font-semibold mt-1';
      } else {
        const gap = 70 - score;
        targetInfoEl.innerHTML = `⚠️ <strong>${lang === 'es' ? `Brecha de ${gap}%` : `${gap}% Gap`}</strong> ${lang === 'es' ? 'para alcanzar la meta de Hito (70%)' : 'to reach milestone target'}`;
        targetInfoEl.className = 'text-xs text-amber-300 font-semibold mt-1';
      }
    }

    // =========================================================================
    // CONFIGURACIÓN DEL PANEL DE APROBACIÓN DEL USUARIO PARA SEGUIMIENTO
    // =========================================================================
    const apprIssueTxt = document.getElementById('ai-appr-issue-txt');
    if (apprIssueTxt) {
      apprIssueTxt.textContent = evalData.issueId > 0 
        ? `#${evalData.issueCode} - ${evalData.issueName}` 
        : (lang === 'es' ? 'Documento Global (Comprehensive Report)' : 'Global Comprehensive Report');
    }

    const apprCurScore = document.getElementById('ai-appr-cur-score');
    if (apprCurScore) {
      apprCurScore.textContent = `${evalData.currentCockpitScore || 0}%`;
    }

    const apprNewScore = document.getElementById('ai-appr-new-score');
    if (apprNewScore) {
      apprNewScore.textContent = `${score}%`;
    }

    const apprInput = document.getElementById('ai-approve-score-input');
    if (apprInput) {
      apprInput.value = score;
    }

    const apprNoteInput = document.getElementById('ai-approve-note-input');
    if (apprNoteInput) {
      apprNoteInput.value = '';
    }

    const apprBadge = document.getElementById('ai-approval-badge');
    const apprStatusDot = document.getElementById('ai-approval-status-dot');
    const apprBtn = document.getElementById('ai-confirm-approve-btn');

    if (apprBadge) {
      apprBadge.className = 'text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30';
      apprBadge.textContent = lang === 'es' ? '⏳ Pendiente de Aprobación' : '⏳ Pending User Approval';
    }
    if (apprStatusDot) {
      apprStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
    }
    if (apprBtn) {
      apprBtn.disabled = false;
      apprBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      apprBtn.innerHTML = `<span>✅</span> <span>${lang === 'es' ? 'Aprobar e Incluir en el Seguimiento Oficial' : 'Approve & Include in Official Tracking'}</span>`;
    }

    const toast = document.getElementById('ai-sync-toast');
    if (toast) toast.classList.add('hidden');

    // Resumen Ejecutivo
    const summaryEl = document.getElementById('ai-res-executive-summary');
    if (summaryEl) {
      summaryEl.textContent = evalData.executiveSummary || '';
    }

    // Checklist de Criterios Mandatorios
    const checklistCont = document.getElementById('ai-res-checklist-container');
    if (checklistCont && evalData.criteriaChecklist) {
      checklistCont.innerHTML = evalData.criteriaChecklist.map(item => {
        let icon = '✓';
        let badge = lang === 'es' ? 'Cumplido' : 'Met';
        let bClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

        if (item.status === 'partial') {
          icon = '⚠️';
          badge = lang === 'es' ? 'Parcial' : 'Partial';
          bClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        } else if (item.status === 'missing') {
          icon = '❌';
          badge = lang === 'es' ? 'Omisión' : 'Missing';
          bClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
        }

        return `
          <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <span class="text-base mt-0.5">${icon}</span>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-slate-200">${item.criterion}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${bClass}">${badge}</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">${item.finding}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    // Fortalezas
    const strengthsCont = document.getElementById('ai-res-strengths-list');
    if (strengthsCont && evalData.strengths) {
      strengthsCont.innerHTML = evalData.strengths.map(s => `
        <li class="flex items-start gap-2 text-xs text-slate-300">
          <span class="text-emerald-400 font-bold">✓</span>
          <span>${s}</span>
        </li>
      `).join('');
    }

    // Brechas Críticas
    const gapsCont = document.getElementById('ai-res-gaps-list');
    if (gapsCont && evalData.criticalGaps) {
      gapsCont.innerHTML = evalData.criticalGaps.map(g => `
        <li class="flex items-start gap-2 text-xs text-slate-300">
          <span class="text-rose-400 font-bold">!</span>
          <span>${g}</span>
        </li>
      `).join('');
    }

    // Recomendaciones de Redacción
    const recsCont = document.getElementById('ai-res-recommendations-list');
    if (recsCont && evalData.draftingRecommendations) {
      recsCont.innerHTML = evalData.draftingRecommendations.map((r, i) => `
        <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
          <span class="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">${i + 1}</span>
          <span class="leading-relaxed">${r}</span>
        </div>
      `).join('');
    }

    // Cláusulas Sugeridas
    const snippetsCont = document.getElementById('ai-res-snippets-container');
    if (snippetsCont && evalData.suggestedTextSnippets) {
      snippetsCont.innerHTML = evalData.suggestedTextSnippets.map((snip, idx) => `
        <div class="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-900/50 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-indigo-300 font-mono">§ ${snip.sectionTitle}</span>
            <button type="button" onclick="window.copyTextSnippet('snippet-${idx}')" class="px-2 py-0.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-[10px] font-bold border border-indigo-500/40 transition flex items-center gap-1 cursor-pointer">
              <span>📋</span> <span>${lang === 'es' ? 'Copiar Cláusula' : 'Copy Clause'}</span>
            </button>
          </div>
          <p id="snippet-${idx}" class="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-serif">
            ${snip.suggestedContent}
          </p>
        </div>
      `).join('');
    }

    // Acción Recomendada para la NEPIO
    const nepioActionEl = document.getElementById('ai-res-nepio-action');
    if (nepioActionEl) {
      nepioActionEl.textContent = evalData.recommendedActionForNEPIO || '';
    }

    resultsEl.classList.remove('hidden');
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // =========================================================================
  // APROBACIÓN DEL USUARIO E INCLUSIÓN EN EL SEGUIMIENTO OFICIAL
  // =========================================================================
  function approveAndTrack() {
    if (!lastEvaluationResult) return;

    const lang = window.currentLang || 'es';
    const issueId = lastEvaluationResult.issueId > 0 ? lastEvaluationResult.issueId : (window.selectedIssueId || 1);
    const phase = lastEvaluationResult.phase || window.currentPhase || 1;

    // Leer calificación final ratificada por el usuario
    const scoreInput = document.getElementById('ai-approve-score-input');
    let finalScore = scoreInput ? parseInt(scoreInput.value, 10) : lastEvaluationResult.score;
    if (isNaN(finalScore)) finalScore = lastEvaluationResult.score || 0;
    finalScore = Math.min(100, Math.max(0, finalScore));

    const noteInput = document.getElementById('ai-approve-note-input');
    const reviewerNote = noteInput ? noteInput.value.trim() : '';

    const folioNumber = `TRK-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    const now = new Date();
    const timestampStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Actualizar el Cockpit en tiempo real (Radar, Consola, INIR, Madurez)
    if (typeof window.setIssueScore === 'function') {
      window.setIssueScore(issueId, phase, finalScore);
    }
    if (typeof window.selectIssue === 'function') {
      window.selectIssue(issueId);
    }
    if (typeof window.updateUI === 'function') {
      window.updateUI();
    }

    // 2. Registrar en la Bitácora de Seguimiento Oficial persistente
    const trackingItem = {
      id: Date.now(),
      folio: folioNumber,
      timestamp: timestampStr,
      issueId: issueId,
      issueCode: lastEvaluationResult.issueCode || String(issueId).padStart(2, '0'),
      issueName: lastEvaluationResult.issueName,
      phase: phase,
      fileName: lastEvaluationResult.fileName || 'Borrador Técnico',
      previousScore: lastEvaluationResult.currentCockpitScore || 0,
      approvedScore: finalScore,
      verdict: lastEvaluationResult.verdict,
      criteriaCount: lastEvaluationResult.criteriaChecklist ? `${lastEvaluationResult.criteriaChecklist.filter(c => c.status === 'met').length} / ${lastEvaluationResult.criteriaChecklist.length}` : 'Conforme',
      reviewerNote: reviewerNote || (lang === 'es' ? 'Aprobado por el usuario revisor.' : 'Approved by user reviewer.'),
      evaluationSnapshot: lastEvaluationResult
    };

    saveTrackingLogItem(trackingItem);

    // 3. Actualizar UI de Aprobación
    lastEvaluationResult.approved = true;
    const apprBadge = document.getElementById('ai-approval-badge');
    const apprStatusDot = document.getElementById('ai-approval-status-dot');
    const apprBtn = document.getElementById('ai-confirm-approve-btn');
    const apprTimestamp = document.getElementById('ai-approve-timestamp');

    if (apprBadge) {
      apprBadge.className = 'text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      apprBadge.textContent = lang === 'es' ? `✓ Aprobado para Seguimiento (${folioNumber})` : `✓ Approved for Tracking (${folioNumber})`;
    }
    if (apprStatusDot) {
      apprStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400';
    }
    if (apprBtn) {
      apprBtn.disabled = true;
      apprBtn.classList.add('opacity-50', 'cursor-not-allowed');
      apprBtn.innerHTML = `<span>✓</span> <span>${lang === 'es' ? 'Registrado en el Seguimiento' : 'Recorded in Tracking'}</span>`;
    }
    if (apprTimestamp) {
      apprTimestamp.textContent = `${lang === 'es' ? 'Aprobado:' : 'Approved:'} ${timestampStr}`;
    }

    // Mostrar panel de confirmación con botones de acceso directo al seguimiento
    const toast = document.getElementById('ai-sync-toast');
    const toastMsg = document.getElementById('ai-sync-toast-msg');
    const toastFolio = document.getElementById('ai-sync-toast-folio');
    if (toastMsg) {
      toastMsg.textContent = lang === 'es'
        ? `Aprobación registrada con éxito (Folio ${folioNumber}). El resultado del ${lastEvaluationResult.issueName} (${finalScore}%) fue incorporado al seguimiento del Cockpit y calibrado en el Radar y la Consola.`
        : `Approval successfully registered (Folio ${folioNumber}). Result for ${lastEvaluationResult.issueName} (${finalScore}%) included in Cockpit tracking and calibrated in Radar and Console.`;
    }
    if (toastFolio) {
      toastFolio.textContent = folioNumber;
    }
    if (toast) {
      toast.classList.remove('hidden');
    }

    // 4. Refrescar la tabla de la Bitácora de Seguimiento
    renderTrackingLedger();
  }

  function viewInRadar(issueId, phase) {
    if (typeof window.selectIssue === 'function' && issueId) {
      window.selectIssue(issueId);
    }
    if (typeof window.setPhase === 'function' && phase) {
      window.setPhase(phase);
    }
    if (typeof window.setTab === 'function') {
      window.setTab('radar');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function viewInRadarFromToast() {
    if (!lastEvaluationResult) return;
    const issueId = lastEvaluationResult.issueId > 0 ? lastEvaluationResult.issueId : (window.selectedIssueId || 1);
    const phase = lastEvaluationResult.phase || window.currentPhase || 1;
    viewInRadar(issueId, phase);
  }

  function scrollToTrackingLedger() {
    const ledgerCard = document.getElementById('ai-tracking-ledger-card');
    if (ledgerCard) {
      ledgerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function discardEvaluation() {
    const resultsEl = document.getElementById('ai-eval-results');
    if (resultsEl) resultsEl.classList.add('hidden');
    lastEvaluationResult = null;
    const lang = window.currentLang || 'es';
    alert(lang === 'es' ? 'La evaluación fue descartada sin modificar el seguimiento.' : 'Evaluation discarded without modifying tracking.');
  }

  // =========================================================================
  // GESTOR DE BITÁCORA Y HISTORIAL DE SEGUIMIENTO (LOCALSTORAGE)
  // =========================================================================
  const TRACKING_STORAGE_KEY = 'nuclear_cockpit_tracking_ledger_v1';

  function getTrackingLog() {
    try {
      const data = localStorage.getItem(TRACKING_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading tracking ledger:', e);
    }
    return [];
  }

  function saveTrackingLogItem(item) {
    try {
      const log = getTrackingLog();
      // Insertar al inicio (orden cronológico inverso)
      log.unshift(item);
      localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(log));
    } catch (e) {
      console.warn('Error saving tracking item:', e);
    }
  }

  function clearTrackingLog() {
    const lang = window.currentLang || 'es';
    const confirmMsg = lang === 'es' 
      ? '¿Estás seguro de que deseas limpiar la bitácora de seguimiento de documentos?' 
      : 'Are you sure you want to clear the document tracking ledger?';
    if (!confirm(confirmMsg)) return;

    try {
      localStorage.removeItem(TRACKING_STORAGE_KEY);
      renderTrackingLedger();
    } catch (e) {}
  }

  function removeTrackingItem(itemId) {
    try {
      let log = getTrackingLog();
      log = log.filter(item => item.id !== itemId);
      localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(log));
      renderTrackingLedger();
    } catch (e) {}
  }

  function renderTrackingLedger() {
    const tbody = document.getElementById('ai-tracking-tbody');
    const docsCountEl = document.getElementById('ai-kpi-docs-count');
    const issuesCountEl = document.getElementById('ai-kpi-issues-count');
    const avgScoreEl = document.getElementById('ai-kpi-avg-score');

    const log = getTrackingLog();
    const lang = window.currentLang || 'es';

    // Actualizar KPIs
    if (docsCountEl) docsCountEl.textContent = log.length;

    const uniqueIssues = new Set(log.map(item => item.issueId));
    if (issuesCountEl) issuesCountEl.textContent = `${uniqueIssues.size} / 19`;

    if (avgScoreEl) {
      if (log.length > 0) {
        const sum = log.reduce((acc, item) => acc + (item.approvedScore || 0), 0);
        const avg = Math.round(sum / log.length);
        avgScoreEl.textContent = `${avg}%`;
      } else {
        avgScoreEl.textContent = '-- %';
      }
    }

    if (!tbody) return;

    if (log.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="p-6 text-center text-slate-500 font-medium">
            <span>ℹ️</span> ${lang === 'es' ? 'No hay documentos aprobados en la bitácora aún. Carga y audita un documento, luego pulsa «Aprobar e Incluir en el Seguimiento Oficial» para registrarlo aquí.' : 'No approved documents in the tracking ledger yet. Evaluate a document and click "Approve & Include in Tracking" to record it here.'}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = log.map(item => {
      let badgeClass = item.approvedScore >= 70
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        : (item.approvedScore >= 45 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40');

      return `
        <tr class="hover:bg-slate-900/60 transition">
          <td class="p-3">
            <span class="font-mono font-bold text-cyan-300 block">${item.folio}</span>
            <span class="text-[10px] text-slate-500 font-mono block">${item.timestamp}</span>
          </td>
          <td class="p-3">
            <span class="font-semibold text-slate-200">Issue #${item.issueCode}</span>
            <span class="text-[11px] text-slate-400 block truncate max-w-xs">${item.issueName}</span>
          </td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-mono text-cyan-400 font-bold">Fase ${item.phase}</span>
          </td>
          <td class="p-3">
            <div class="flex items-center gap-1.5 truncate max-w-xs" title="${item.fileName}">
              <span>📄</span>
              <span class="truncate text-slate-300 font-medium">${item.fileName}</span>
            </div>
          </td>
          <td class="p-3 text-center font-mono font-black text-sm">
            <span class="px-2 py-0.5 rounded-lg border ${badgeClass}">
              ${item.approvedScore}%
            </span>
          </td>
          <td class="p-3 text-center">
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 truncate block">
              ${item.verdict || 'Conforme'}
            </span>
          </td>
          <td class="p-3 max-w-xs">
            <span class="text-[11px] text-slate-400 italic truncate block" title="${item.reviewerNote}">
              ${item.reviewerNote || 'Aprobado sin nota.'}
            </span>
          </td>
          <td class="p-3 text-center">
            <div class="flex items-center justify-center gap-1">
              <button type="button" onclick="window.aiAuditor.viewTrackingDetail(${item.id})"
                class="px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[10px] font-bold border border-indigo-500/40 transition cursor-pointer" title="Ver dictamen completo">
                👁️ Ver
              </button>
              <button type="button" onclick="window.aiAuditor.viewInRadar(${item.issueId}, ${item.phase})"
                class="px-2 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 transition flex items-center gap-1 cursor-pointer" title="Ver en el Radar de Seguimiento">
                <span>🕸️</span> <span>Radar</span>
              </button>
              <button type="button" onclick="window.aiAuditor.removeTrackingItem(${item.id})"
                class="p-1 rounded-lg hover:bg-rose-900/40 text-slate-500 hover:text-rose-400 transition cursor-pointer" title="Eliminar registro">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function viewTrackingDetail(itemId) {
    const log = getTrackingLog();
    const item = log.find(i => i.id === itemId);
    if (!item) return;

    if (item.evaluationSnapshot) {
      renderEvaluationResults(item.evaluationSnapshot);
      // Actualizar card de aprobación con datos históricos
      const apprBadge = document.getElementById('ai-approval-badge');
      const apprStatusDot = document.getElementById('ai-approval-status-dot');
      const apprBtn = document.getElementById('ai-confirm-approve-btn');
      const apprTimestamp = document.getElementById('ai-approve-timestamp');

      if (apprBadge) {
        apprBadge.className = 'text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        apprBadge.textContent = `✓ Histórico Aprobado (${item.folio})`;
      }
      if (apprStatusDot) apprStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400';
      if (apprBtn) {
        apprBtn.disabled = true;
        apprBtn.classList.add('opacity-50', 'cursor-not-allowed');
        apprBtn.innerHTML = `<span>✓</span> <span>Aprobado en Seguimiento (${item.approvedScore}%)</span>`;
      }
      if (apprTimestamp) {
        apprTimestamp.textContent = `Aprobado: ${item.timestamp}`;
      }
    }
  }

  function exportTrackingReport() {
    const log = getTrackingLog();
    const lang = window.currentLang || 'es';

    if (log.length === 0) {
      alert(lang === 'es' ? 'No hay registros en la bitácora de seguimiento para exportar.' : 'No records in tracking ledger to export.');
      return;
    }

    let report = `=========================================================================\n`;
    report += `BITÁCORA OFICIAL DE SEGUIMIENTO DOCUMENTAL - NUCLEAR DECISION COCKPIT\n`;
    report += `Fecha de Generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    report += `Total Entregables Auditados y Aprobados: ${log.length}\n`;
    report += `=========================================================================\n\n`;

    log.forEach((item, idx) => {
      report += `[REGISTRO #${idx + 1}] Folio: ${item.folio} | Fecha: ${item.timestamp}\n`;
      report += `Aspecto OIEA: #${item.issueCode} - ${item.issueName} (Fase ${item.phase})\n`;
      report += `Documento Fuente: ${item.fileName}\n`;
      report += `Calificación Aprobada: ${item.approvedScore}%\n`;
      report += `Dictamen OIEA: ${item.verdict}\n`;
      report += `Criterios: ${item.criteriaCount}\n`;
      report += `Nota del Revisor: ${item.reviewerNote}\n`;
      report += `-------------------------------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(report).then(() => {
      alert(lang === 'es' ? '¡Bitácora de seguimiento copiada al portapapeles en formato texto/markdown!' : 'Tracking ledger copied to clipboard!');
    });
  }

  // Exportar dictamen de evaluación en formato texto / markdown
  function exportEvaluationReport() {
    if (!lastEvaluationResult) return;
    const lang = window.currentLang || 'es';
    const evalData = lastEvaluationResult;

    let report = `=========================================================================\n`;
    report += `DICTAMEN DE AUDITORÍA OIEA - NUCLEAR DECISION COCKPIT\n`;
    report += `Aspecto Evaluado: #${evalData.issueCode || evalData.issueId} - ${evalData.issueName}\n`;
    report += `Fase Objetivo: Fase ${evalData.phase}\n`;
    report += `Fecha de Evaluación: ${new Date().toLocaleDateString()}\n`;
    report += `=========================================================================\n\n`;
    report += `1. RESULTADO GLOBAL\n`;
    report += `   - Calificación de Madurez: ${evalData.score}%\n`;
    report += `   - Dictamen OIEA: ${evalData.verdict}\n\n`;
    report += `2. RESUMEN EJECUTIVO\n`;
    report += `   ${evalData.executiveSummary}\n\n`;
    report += `3. VERIFICACIÓN DE CRITERIOS MANDATORIOS DEL HITO\n`;
    if (evalData.criteriaChecklist) {
      evalData.criteriaChecklist.forEach(c => {
        report += `   [${c.status.toUpperCase()}] ${c.criterion}\n`;
        report += `       Observación: ${c.finding}\n`;
      });
    }
    report += `\n4. FORTALEZAS DETECTADAS\n`;
    if (evalData.strengths) {
      evalData.strengths.forEach(s => { report += `   + ${s}\n`; });
    }
    report += `\n5. BRECHAS CRÍTICAS Y OMISIONES\n`;
    if (evalData.criticalGaps) {
      evalData.criticalGaps.forEach(g => { report += `   ! ${g}\n`; });
    }
    report += `\n6. RECOMENDACIONES DE REDACCIÓN\n`;
    if (evalData.draftingRecommendations) {
      evalData.draftingRecommendations.forEach((r, idx) => { report += `   ${idx + 1}. ${r}\n`; });
    }
    report += `\n7. ACCIÓN ESTRATÉGICA RECOMENDADA PARA LA NEPIO\n`;
    report += `   ${evalData.recommendedActionForNEPIO}\n\n`;
    report += `=========================================================================\n`;

    navigator.clipboard.writeText(report).then(() => {
      alert(lang === 'es' ? '¡Informe de auditoría copiado al portapapeles en formato Markdown!' : 'Audit report copied to clipboard!');
    });
  }

  // Enviar consulta interactiva al Asesor de Redacción
  async function askRedactionAdvisor(prefilledQuery) {
    const chatInput = document.getElementById('ai-chat-input');
    const query = prefilledQuery || (chatInput ? chatInput.value.trim() : '');

    if (!query) return;

    if (chatInput && !prefilledQuery) {
      chatInput.value = '';
    }

    const chatHistoryEl = document.getElementById('ai-chat-history');
    const lang = window.currentLang || 'es';

    // Append user message
    if (chatHistoryEl) {
      chatHistoryEl.insertAdjacentHTML('beforeend', `
        <div class="flex items-start justify-end gap-2.5">
          <div class="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%] shadow-md">
            <strong>${lang === 'es' ? 'Tú:' : 'You:'}</strong> ${query}
          </div>
          <span class="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center flex-shrink-0">👤</span>
        </div>
      `);
      chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    }

    // Append placeholder for AI response
    const aiMsgId = 'ai-reply-' + Date.now();
    if (chatHistoryEl) {
      chatHistoryEl.insertAdjacentHTML('beforeend', `
        <div id="${aiMsgId}" class="flex items-start gap-2.5">
          <span class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center flex-shrink-0">🤖</span>
          <div class="bg-slate-900 border border-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none text-xs max-w-[85%] shadow-md space-y-1">
            <span class="text-cyan-400 font-bold text-[10px] block uppercase font-mono tracking-wider">${lang === 'es' ? 'Asistente OIEA' : 'IAEA Assistant'}</span>
            <div class="ai-reply-body animate-pulse">${lang === 'es' ? 'Redactando orientación técnica...' : 'Drafting technical guidance...'}</div>
          </div>
        </div>
      `);
      chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    }

    try {
      const payload = {
        query: query,
        documentSnippet: currentLoadedFile ? (currentLoadedFile.text || '').slice(0, 2000) : '',
        evaluationContext: lastEvaluationResult ? {
          score: lastEvaluationResult.score,
          verdict: lastEvaluationResult.verdict,
          issueName: lastEvaluationResult.issueName
        } : null,
        issueName: lastEvaluationResult ? lastEvaluationResult.issueName : 'Aspecto de Infraestructura Nuclear',
        phase: window.currentPhase || 1,
        language: lang
      };

      const res = await fetch('/api/ai/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const aiReplyEl = document.getElementById(aiMsgId);
      if (aiReplyEl) {
        const bodyEl = aiReplyEl.querySelector('.ai-reply-body');
        if (bodyEl) {
          bodyEl.classList.remove('animate-pulse');
          bodyEl.innerHTML = formatMarkdownToHTML(data.answer || (lang === 'es' ? 'Sin respuesta.' : 'No reply.'));
        }
      }
    } catch (err) {
      console.error('Error in chat assistant:', err);
      const aiReplyEl = document.getElementById(aiMsgId);
      if (aiReplyEl) {
        const bodyEl = aiReplyEl.querySelector('.ai-reply-body');
        if (bodyEl) {
          bodyEl.classList.remove('animate-pulse');
          bodyEl.innerHTML = `<span class="text-rose-400">Error al consultar el asistente: ${err.message}</span>`;
        }
      }
    }

    if (chatHistoryEl) {
      chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    }
  }

  function formatMarkdownToHTML(md) {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gim, '<h4 class="font-bold text-cyan-300 mt-2 mb-1">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 class="font-bold text-white mt-2 mb-1">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-slate-100 font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="text-slate-300">$1</em>')
      .replace(/^\s*\n\*/gm, '<ul>\n*')
      .replace(/^(\*|\-) (.*$)/gim, '<li class="ml-3 list-disc text-slate-300">$2</li>')
      .replace(/\n/gim, '<br>');
  }

  function copyTextSnippet(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert(window.currentLang === 'es' ? '¡Cláusula copiada al portapapeles!' : 'Clause copied to clipboard!');
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }

  // Exportar funciones a la ventana global
  window.aiAuditor = {
    loadSample,
    evaluateDocument,
    clearDocument,
    approveAndTrack,
    discardEvaluation,
    clearTrackingLog,
    removeTrackingItem,
    viewTrackingDetail,
    exportTrackingReport,
    exportEvaluationReport,
    askRedactionAdvisor,
    populateChapterSelect,
    renderTrackingLedger,
    viewInRadar,
    viewInRadarFromToast,
    scrollToTrackingLedger
  };
  window.copyTextSnippet = copyTextSnippet;

})(window);
