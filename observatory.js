// =========================================================================
// IAEA OBSERVATORIES HUB: ARIS & PRIS DATA ENGINE
// Official references:
// - IAEA ARIS (Advanced Reactors Information System): https://aris.iaea.org/
// - IAEA PRIS (Power Reactor Information System): https://pris-stats.iaea.org/
// =========================================================================

(function(window) {
  const ARIS_REACTORS_DATA = [
    {
      id: 'bwrx-300',
      name: 'BWRX-300',
      vendor: 'GE Hitachi Nuclear Energy',
      country: 'Estados Unidos / Japón',
      countryEn: 'United States / Japan',
      flag: '🇺🇸🇯🇵',
      category: 'smr',
      powerMWe: 300,
      powerMWth: 870,
      type: 'BWR (Boiling Water Reactor) / Circulación Natural',
      typeEn: 'BWR (Boiling Water Reactor) / Natural Circulation',
      coolant: 'Agua Ligera Desmineralizada',
      coolantEn: 'Demineralized Light Water',
      moderator: 'Agua Ligera',
      moderatorEn: 'Light Water',
      passiveSafety: 'Circulación natural sin bombas de refrigeración del núcleo; sistema de condensación pasiva de contención (PCCS) autónomo por 7 días sin energía CA ni intervención humana.',
      passiveSafetyEn: 'Natural circulation without primary coolant pumps; passive containment cooling system (PCCS) autonomous for 7 days without AC power or operator action.',
      epz: 'Zona de Emergencia confinada al cerramiento perimetral de la instalación (<1 km).',
      epzEn: 'Emergency Planning Zone confined to site boundary limit (<1 km).',
      status: 'En Licenciamiento Avanzado / Selección Comercial',
      statusEn: 'Advanced Licensing / Commercial Selection',
      deployTarget: '2028-2029 (Darlington New Nuclear Project, Ontario, Canadá)',
      deployTargetEn: '2028-2029 (Darlington New Nuclear Project, Ontario, Canada)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Elegido por Ontario Power Generation (OPG, Canadá), Tennessee Valley Authority (TVA, EE.UU.) y Orlen Synthos (Polonia).',
        'Costes de capital (CAPEX) proyectados 40-60% inferiores por MWe comparado con diseños tradicionales gracias a la reducción del 90% en volumen de hormigón.',
        'Combustible estándar GNF2 probado comercialmente en el parque nuclear BWR global.'
      ],
      highlightsEn: [
        'Selected by Ontario Power Generation (OPG, Canada), TVA (USA) and Orlen Synthos (Poland).',
        'Projected capital cost (CAPEX) 40-60% lower per MWe vs traditional designs via 90% reduction in concrete volume.',
        'Standard GNF2 commercial fuel proven across the global operating BWR fleet.'
      ]
    },
    {
      id: 'nuscale-voygr',
      name: 'VOYGR (NuScale Power Module)',
      vendor: 'NuScale Power',
      country: 'Estados Unidos',
      countryEn: 'United States',
      flag: '🇺🇸',
      category: 'smr',
      powerMWe: 77,
      powerMWth: 250,
      type: 'iPWR (Integral Pressurized Water Reactor)',
      typeEn: 'iPWR (Integral Pressurized Water Reactor)',
      coolant: 'Agua Ligera Presurizada',
      coolantEn: 'Pressurized Light Water',
      moderator: 'Agua Ligera',
      moderatorEn: 'Light Water',
      passiveSafety: 'Módulo integral sumergido en piscina subterránea de disipación de calor; enfriamiento pasivo indefinido sin necesidad de alimentación eléctrica, agua adicional ni intervención humana.',
      passiveSafetyEn: 'Integral module submerged in underground heat sink pool; indefinite passive cooling with no AC power, additional water, or operator action required.',
      epz: 'EPZ limitada al perímetro de la propiedad de la central (Site Boundary).',
      epzEn: 'EPZ limited to plant site boundary.',
      status: 'Diseño Certificado por US NRC / En Prospección Internacional',
      statusEn: 'Design Certified by US NRC / International Prospecting',
      deployTarget: '2029-2030 (Configuraciones modulares VOYGR-4 y VOYGR-6)',
      deployTargetEn: '2029-2030 (VOYGR-4 and VOYGR-6 modular configurations)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Primer SMR comercial en recibir la aprobación formal de diseño estándar (SDA) de la Comisión Regulatoria Nuclear de EE.UU. (US NRC).',
        'Flexibilidad modular: instalaciones configurables de 4 módulos (308 MWe) o 6 módulos (462 MWe).',
        'Capacidad de acoplamiento para producción de hidrógeno limpio y desalinización masiva de agua.'
      ],
      highlightsEn: [
        'First commercial SMR to receive formal Standard Design Approval (SDA) from the US Nuclear Regulatory Commission (NRC).',
        'Modular scalability: multi-module configurations of 4 modules (308 MWe) or 6 modules (462 MWe).',
        'Direct cogeneration coupling for clean hydrogen production and industrial seawater desalination.'
      ]
    },
    {
      id: 'rolls-royce-smr',
      name: 'Rolls-Royce SMR',
      vendor: 'Rolls-Royce SMR Ltd',
      country: 'Reino Unido',
      countryEn: 'United Kingdom',
      flag: '🇬🇧',
      category: 'smr',
      powerMWe: 470,
      powerMWth: 1358,
      type: 'PWR Compacto Close-Coupled (3 lazos)',
      typeEn: 'Close-Coupled 3-loop Compact PWR',
      coolant: 'Agua Ligera Presurizada',
      coolantEn: 'Pressurized Light Water',
      moderator: 'Agua Ligera',
      moderatorEn: 'Light Water',
      passiveSafety: 'Sistemas pasivos de remoción de calor residual (PRHRS) y descarga gravitacional con reserva de agua desmineralizada de circuito cerrado.',
      passiveSafetyEn: 'Passive residual heat removal systems (PRHRS) and gravity injection with closed-loop demineralized water store.',
      epz: 'Radio de planificación de emergencia optimizado significativamente (<3 km).',
      epzEn: 'Optimized emergency planning radius (<3 km).',
      status: 'En Proceso de Evaluación Genérica de Diseño (GDA Etapa 2 / ONR)',
      statusEn: 'Generic Design Assessment Step 2 (UK ONR) / Shortlisted in Europe',
      deployTarget: '2030-2031 (Reino Unido / República Checa / Países Nórdicos)',
      deployTargetEn: '2030-2031 (United Kingdom / Czech Republic / Nordics)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Fabricación 100% modular y estandarizada en fábricas controladas transportable por autopistas convencionales.',
        'Preseleccionado por la agencia gubernamental Great British Nuclear (GBN) y por CEZ en República Checa para despliegue en Temelín.',
        'Vida útil garantizada de 60 años con factor de disponibilidad superior al 95%.'
      ],
      highlightsEn: [
        '100% modular and standardized factory fabrication transportable via conventional highway logistics.',
        'Shortlisted by Great British Nuclear (GBN) and selected by CEZ in Czech Republic for Temelín site.',
        '60-year operational design life with planned capacity factor exceeding 95%.'
      ]
    },
    {
      id: 'carem-25',
      name: 'CAREM-25',
      vendor: 'CNEA (Comisión Nacional de Energía Atómica)',
      country: 'Argentina',
      countryEn: 'Argentina',
      flag: '🇦🇷',
      category: 'smr',
      powerMWe: 32,
      powerMWth: 100,
      type: 'iPWR (Integral Pressurized Water Reactor)',
      typeEn: 'iPWR (Integral Pressurized Water Reactor)',
      coolant: 'Agua Ligera en Convección Natural',
      coolantEn: 'Light Water via Natural Convection',
      moderator: 'Agua Ligera',
      moderatorEn: 'Light Water',
      passiveSafety: 'Enfriamiento del núcleo enteramente por convección natural (sin bombas de refrigeración primaria); barras de seguridad accionadas por gravedad e inyección pasiva.',
      passiveSafetyEn: 'Core cooling entirely driven by natural convection without primary pumps; gravity-actuated control rods and passive accumulators.',
      epz: 'Zona de planificación reducida confinada a las inmediaciones del emplazamiento.',
      epzEn: 'Reduced EPZ confined to immediate site boundary.',
      status: 'En Construcción Civil Avanzada (Lima, Buenos Aires)',
      statusEn: 'Under Advanced Civil Construction (Lima, Buenos Aires)',
      deployTarget: '2027-2028 (Primer SMR de diseño y construcción latinoamericana)',
      deployTargetEn: '2027-2028 (First Latin American designed and built SMR prototype)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Pionero regional en América Latina: reactor prototipo de diseño nacional argentino para generación y exportación tecnológica.',
        'Generador de vapor integrado dentro del recipiente de presión del reactor (RPV) eliminando el riesgo de rotura de tuberías principales (LOCA grande).',
        'Modelo de referencia para países emergentes que buscan soberanía tecnológica y desarrollo de cadena de suministro nacional.'
      ],
      highlightsEn: [
        'Regional pioneer in Latin America: indigenous Argentine design for power generation and nuclear technology export.',
        'Steam generators integrated inside the reactor pressure vessel (RPV), eliminating large-break LOCA accident pathways.',
        'Reference benchmark for embarking countries targeting sovereign supply chain and workforce training.'
      ]
    },
    {
      id: 'smart-kaeri',
      name: 'SMART (System-integrated Modular Advanced ReacTor)',
      vendor: 'KAERI (Korea Atomic Energy Research Institute)',
      country: 'Corea del Sur',
      countryEn: 'South Korea',
      flag: '🇰🇷',
      category: 'smr',
      powerMWe: 107,
      powerMWth: 365,
      type: 'iPWR (Integral Pressurized Water Reactor) Cogeneración',
      typeEn: 'iPWR (Integral Pressurized Water Reactor) Cogeneration',
      coolant: 'Agua Ligera Presurizada',
      coolantEn: 'Pressurized Light Water',
      moderator: 'Agua Ligera',
      moderatorEn: 'Light Water',
      passiveSafety: 'Sistema pasivo de remoción de calor residual (PRHRS) con 40 días de autonomía de enfriamiento sin intervención exterior.',
      passiveSafetyEn: 'Passive residual heat removal system (PRHRS) with 40-day autonomous cooling without offsite assistance.',
      epz: 'Zona de exclusión de emergencia < 1.5 km.',
      epzEn: 'Emergency exclusion zone < 1.5 km.',
      status: 'Aprobación de Diseño Estándar (SDA) Obtenida por KINS / NSSC',
      statusEn: 'Standard Design Approval (SDA) Granted by KINS / NSSC',
      deployTarget: '2028-2030 (Proyectos bilaterales Corea - Oriente Medio / Canadá)',
      deployTargetEn: '2028-2030 (Bilateral Korea - Middle East / Canada deployment)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Primer SMR integral en el mundo en recibir la aprobación de diseño estándar (SDA) de un organismo regulador nacional (Corea, 2012).',
        'Diseñado para generación eléctrica combinada (100 MWe) y producción de 40.000 m³/día de agua potable mediante desalinización térmica.',
        'Excelente opción para regiones áridas o costeras con redes eléctricas medianas.'
      ],
      highlightsEn: [
        'World first integral SMR to receive formal Standard Design Approval from a national regulatory body (South Korea, 2012).',
        'Optimized dual-purpose design: 100 MWe electrical power + 40,000 m³/day potable water desalination.',
        'Proven reference for arid, coastal regions with mid-sized electrical grids.'
      ]
    },
    {
      id: 'htr-pm',
      name: 'HTR-PM (High-Temperature Gas-Cooled Pebble-Bed)',
      vendor: 'China Huaneng / Tsinghua University / CNNC',
      country: 'China',
      countryEn: 'China',
      flag: '🇨🇳',
      category: 'gen4',
      powerMWe: 210,
      powerMWth: 500,
      type: 'HTGR (High-Temperature Gas-Cooled Pebble-Bed) / Gen IV',
      typeEn: 'HTGR (High-Temperature Gas-Cooled Pebble-Bed) / Gen IV',
      coolant: 'Gas Helio (Presión 7.0 MPa)',
      coolantEn: 'Helium Gas (7.0 MPa pressure)',
      moderator: 'Grafito Esférico (Combustible TRISO)',
      moderatorEn: 'Spherical Graphite (TRISO Fuel)',
      passiveSafety: 'Seguridad intrínseca pasiva garantizada por la física del núcleo: el combustible TRISO resiste >1620 °C sin degradación ni fusión del núcleo ante pérdida total de refrigerante.',
      passiveSafetyEn: 'Inherent passive safety guaranteed by nuclear physics: TRISO fuel retains fission products above 1620 °C without core meltdown even under complete station blackout.',
      epz: 'Zona de emergencia reducida al perímetro inmediato.',
      epzEn: 'Emergency zone reduced to plant fence perimeter.',
      status: 'En Operación Comercial Activa (Shidaowan, Shandong)',
      statusEn: 'In Active Commercial Operation (Shidaowan, Shandong)',
      deployTarget: 'Operando Comercial desde Diciembre de 2023 (Primer Gen IV comercial mundial)',
      deployTargetEn: 'Operating Commercially since Dec 2023 (World first commercial Gen IV plant)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Hito histórico mundial: Primera central nuclear comercial de Generación IV conectada a la red en el mundo.',
        'Temperatura de salida de helio de 750 °C, permitiendo vapor supercrítico para calor industrial, siderurgia y producción de hidrógeno.',
        'Pruebas reales en caliente demostraron autoapagado seguro sin accionamiento de sistemas de seguridad activos.'
      ],
      highlightsEn: [
        'World historic milestone: First commercial Generation IV nuclear power plant connected to the grid worldwide.',
        '750 °C helium outlet temperature delivering supercritical steam for industrial district heating, metallurgy, and hydrogen.',
        'Full-scale live loss-of-flow tests verified inherent safe shutdown without any active safety control activation.'
      ]
    },
    {
      id: 'xe-100',
      name: 'Xe-100',
      vendor: 'X-energy',
      country: 'Estados Unidos',
      countryEn: 'United States',
      flag: '🇺🇸',
      category: 'gen4',
      powerMWe: 80,
      powerMWth: 200,
      type: 'HTGR Modular de Lecho de Bolas (Pebble-Bed) / Gen IV',
      typeEn: 'Modular Pebble-Bed High-Temperature Gas Reactor / Gen IV',
      coolant: 'Gas Helio',
      coolantEn: 'Helium Gas',
      moderator: 'Grafito / Combustible TRISO-X patentado',
      moderatorEn: 'Graphite / Proprietary TRISO-X Fuel',
      passiveSafety: 'Imposibilidad física de fusión de núcleo gracias a la estabilidad térmica de los recubrimientos de carburo de silicio del combustible TRISO.',
      passiveSafetyEn: 'Physical impossibility of core meltdown due to thermal integrity of silicon carbide-coated TRISO fuel pebbles.',
      epz: 'EPZ limitada al cerramiento perimetral de la planta.',
      epzEn: 'EPZ confined to site boundary fence.',
      status: 'Seleccionado en US DOE ARDP / Alianza Industrial Dow Chemical',
      statusEn: 'Selected under US DOE ARDP / Dow Chemical Industrial Partnership',
      deployTarget: '2028-2030 (Seadrift, Texas, EE.UU. para descarbonización industrial)',
      deployTargetEn: '2028-2030 (Seadrift, Texas, USA for chemical plant decarbonization)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Despliegue estándar en planta de 4 módulos (320 MWe netos o vapor a 565 °C).',
        'Asociación estratégica con la multinacional química Dow para reemplazar calderas de gas fósil por vapor nuclear limpio en procesos petroquímicos.',
        'Recarga continua de combustible en caliente (on-line refueling), eliminando paradas de mantenimiento por cambio de combustible.'
      ],
      highlightsEn: [
        'Standard 4-pack plant configuration delivering 320 MWe net electricity or 565 °C industrial process steam.',
        'Strategic partnership with Dow to repower fossil gas boilers with zero-carbon nuclear heat in petrochemistry.',
        'Continuous on-line refueling, eliminating periodic refueling shutdowns.'
      ]
    },
    {
      id: 'natrium-terrapower',
      name: 'Natrium (TerraPower & GE Hitachi)',
      vendor: 'TerraPower / GE Hitachi',
      country: 'Estados Unidos',
      countryEn: 'United States',
      flag: '🇺🇸',
      category: 'gen4',
      powerMWe: 345,
      powerMWth: 840,
      type: 'SFR (Sodium Fast Reactor) con Almacenamiento de Sales Fundidas',
      typeEn: 'SFR (Sodium Fast Reactor) with Molten Salt Energy Storage',
      coolant: 'Sodio Líquido (No Presurizado)',
      coolantEn: 'Liquid Sodium (Non-Pressurized)',
      moderator: 'Espectro Rápido (Sin Moderador)',
      moderatorEn: 'Fast Neutron Spectrum (No Moderator)',
      passiveSafety: 'Enfriamiento del recipiente del reactor por tiro natural de aire atmosférico (RVACS) que opera continuamente sin energía externa.',
      passiveSafetyEn: 'Reactor vessel air cooling system (RVACS) powered by atmospheric natural draft operating autonomously.',
      epz: 'Zona de exclusión perimetral optimizada.',
      epzEn: 'Optimized plant fence boundary exclusion zone.',
      status: 'Solicitud de Permiso de Construcción ante US NRC / En Sitio en Kemmerer',
      statusEn: 'Construction Permit Application submitted to US NRC / Kemmerer Site',
      deployTarget: '2030 (Kemmerer, Wyoming, EE.UU. en emplazamiento de central de carbón retirada)',
      deployTargetEn: '2030 (Kemmerer, Wyoming, USA on retired coal power plant site)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Capacidad única de modulación de potencia: genera 345 MWe base y puede alcanzar picos de 500 MWe durante más de 5,5 horas gracias a su sistema térmico de sales fundidas.',
        'Ideal para integrarse con parques eólicos y solares en redes eléctricas con alta variabilidad de fuentes renovables.',
        'Proyecto insignia de reemplazo de carbón (Coal-to-Nuclear Repowering) respaldado por el Departamento de Energía de EE.UU. (DOE).'
      ],
      highlightsEn: [
        'Unique power-peaking capability: 345 MWe continuous baseload boostable to 500 MWe for 5.5+ hours via molten salt storage.',
        'Engineered to seamlessly integrate with wind and solar in renewable-dominated electricity grids.',
        'Flagship coal-to-nuclear repowering project supported by the US Department of Energy (DOE).'
      ]
    },
    {
      id: 'evinci-micro',
      name: 'eVinci Micro-Reactor',
      vendor: 'Westinghouse Electric Company',
      country: 'Estados Unidos',
      countryEn: 'United States',
      flag: '🇺🇸',
      category: 'micro',
      powerMWe: 5,
      powerMWth: 15,
      type: 'Microrreactor de Tubos de Calor (Heat Pipe Solid Core)',
      typeEn: 'Heat Pipe Solid Core Micro-Reactor',
      coolant: 'Tubos de Calor de Metal Líquido (Sodio en circuito cerrado)',
      coolantEn: 'Liquid Metal Heat Pipes (Self-contained Sodium)',
      moderator: 'Hidruro Metálico',
      moderatorEn: 'Metal Hydride',
      passiveSafety: 'Núcleo monolítico de acero de estado sólido sin partes móviles ni fluidos presurizados; autorregulación intrínseca pasiva.',
      passiveSafetyEn: 'Solid-state steel monolith core with zero moving parts or pressurized water circuits; inherent nuclear feedback control.',
      epz: 'Menos de 100 metros (restringido al edificio de instalación).',
      epzEn: 'Under 100 meters (restricted to installation footprint).',
      status: 'En Revisión Previa con US NRC y CNSC de Canadá',
      statusEn: 'Pre-licensing Review with US NRC and Canadian CNSC',
      deployTarget: '2027-2029 (Sitios mineros remotos, bases de defensa y redes aisladas)',
      deployTargetEn: '2027-2029 (Remote mining, off-grid communities, and defense microgrids)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Transportable en 4 contenedores marítimos estándar de 20 pies; instalación y puesta en marcha en menos de 30 días.',
        'Opera durante más de 8 años continuos sin necesidad de recarga de combustible.',
        'Sustituto directo para generadores diésel en operaciones mineras aisladas en la cordillera o zonas no interconectadas.'
      ],
      highlightsEn: [
        'Transportable in 4 standard 20-ft shipping containers; civil deployment in under 30 days.',
        'Runs for 8+ continuous years without on-site refueling operations.',
        'Direct zero-carbon replacement for diesel generator fleets in remote off-grid mining sites.'
      ]
    },
    {
      id: 'ap1000',
      name: 'AP1000 (Advanced Passive PWR)',
      vendor: 'Westinghouse Electric Company',
      country: 'Estados Unidos',
      countryEn: 'United States',
      flag: '🇺🇸',
      category: 'large',
      powerMWe: 1117,
      powerMWth: 3400,
      type: 'PWR Avanzado Generación III+ (2 lazos grandes)',
      typeEn: 'Advanced Gen III+ PWR (2-loop)',
      coolant: 'Agua Ligera Presurizada',
      coolantEn: 'Pressurized Light Water',
      moderator: 'Agua Ligera',
      moderatorEn: 'Light Water',
      passiveSafety: 'Enfriamiento pasivo por gravedad del núcleo (PRHR) y enfriamiento pasivo exterior de contención por evaporación de agua (PCCS) durante 72 horas sin intervención.',
      passiveSafetyEn: 'Passive core decay heat removal (PRHR) and passive containment cooling (PCCS) via evaporation for 72+ hours without power.',
      epz: 'Zona de planificación de emergencia estándar optimizada.',
      epzEn: 'Standard optimized nuclear emergency planning zone.',
      status: 'Operativo Comercial Comprobado (China y EE.UU.) / Seleccionado en Europa',
      statusEn: 'Proven Commercial Operation (China & USA) / Selected in Europe',
      deployTarget: 'Operando en Sanmen, Haiyang (China) y Vogtle 3-4 (EE.UU.); seleccionado por Polonia y Ucrania',
      deployTargetEn: 'Operating in Sanmen, Haiyang (China) and Vogtle 3-4 (USA); selected by Poland and Ukraine',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Referencia comprobada de tecnología pasiva a gran escala: 4 unidades operando en China y 2 unidades comerciales en Georgia, EE.UU. (Vogtle 3 y 4).',
        'Elegido por el gobierno de Polonia para su primer programa nuclear de Hito 1 a Hito 3 en la costa báltica.',
        '50% menos válvulas de seguridad, 35% menos bombas y 80% menos tuberías de seguridad que las plantas convencionales de 2.ª generación.'
      ],
      highlightsEn: [
        'Proven commercial benchmark of large-scale passive safety: 4 units operating in China, 2 units operating in Georgia, USA (Vogtle 3 & 4).',
        'Selected by the Polish Government for their inaugural sovereign nuclear fleet at Lubiatowo-Kopalino.',
        '50% fewer safety valves, 35% fewer pumps, and 80% less safety piping than legacy Gen II designs.'
      ]
    },
    {
      id: 'apr1400',
      name: 'APR1400 (Advanced Power Reactor 1400)',
      vendor: 'KEPCO / KHNP',
      country: 'Corea del Sur',
      countryEn: 'South Korea',
      flag: '🇰🇷',
      category: 'large',
      powerMWe: 1400,
      powerMWth: 3983,
      type: 'PWR Avanzado Generación III+ (2 lazos)',
      typeEn: 'Advanced Gen III+ PWR (2-loop)',
      coolant: 'Agua Ligera Presurizada',
      coolantEn: 'Pressurized Light Water',
      moderator: 'Agua Ligera',
      moderatorEn: 'Light Water',
      passiveSafety: 'Inyección de seguridad directa en vasija (DVI), depósitos acumuladores de flujo pasivo y 60 años de vida de diseño garantizada.',
      passiveSafetyEn: 'Direct vessel injection (DVI), fluidic device passive safety injection accumulators, and 60-year certified design life.',
      epz: 'Zona de planificación estándar (10 - 15 km).',
      epzEn: 'Standard nuclear EPZ (10 - 15 km).',
      status: 'Operativo Comercial en Corea y Emiratos Árabes Unidos / Seleccionado en R. Checa',
      statusEn: 'Commercial Operation in Korea & UAE (Barakah) / Selected in Czech Rep.',
      deployTarget: 'Operando en Barakah (4 reactores en EAU completados en plazo) y Corea; seleccionado para Dukovany (R. Checa)',
      deployTargetEn: 'Operating in Barakah (4 units in UAE delivered on budget) and Korea; selected for Dukovany (Czech Rep)',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Mayor caso de éxito mundial de un país principiante (EAU): Los 4 reactores de Barakah construidos cumpliendo plenamente los 19 hitos del OIEA.',
        'Suministra actualmente el 25% de la electricidad de los Emiratos Árabes Unidos de forma limpia y continua.',
        'Historial líder de construcción en plazos predecibles (On-time, On-budget) en el mercado internacional.'
      ],
      highlightsEn: [
        'World gold standard for embarking nations (UAE): All 4 Barakah units deployed successfully adhering to IAEA Milestones.',
        'Delivers over 25% of the United Arab Emirates electricity with zero carbon emissions.',
        'Industry benchmark for on-time and on-budget construction delivery in international tenders.'
      ]
    },
    {
      id: 'epr-france',
      name: 'EPR / EPR1200',
      vendor: 'EDF (Électricité de France)',
      country: 'Francia',
      countryEn: 'France',
      flag: '🇫🇷',
      category: 'large',
      powerMWe: 1650,
      powerMWth: 4500,
      type: 'Evolutionary Pressurized Water Reactor (4 lazos)',
      typeEn: 'Evolutionary Pressurized Water Reactor (4-loop)',
      coolant: 'Agua Ligera Presurizada',
      coolantEn: 'Pressurized Light Water',
      moderator: 'Agua Ligera',
      moderatorEn: 'Light Water',
      passiveSafety: 'Cuádruple redundancia de seguridad (4 trenes independientes físicamente separados), recuperador de corio (Core Catcher) y doble contención estanca.',
      passiveSafetyEn: 'Quadruple safety redundancy (4 physically separated trains), core catcher severe accident mitigation, and double-wall prestressed containment.',
      epz: 'Zona de planificación estándar de gran escala.',
      epzEn: 'Standard large-scale nuclear EPZ.',
      status: 'Operativo en Finlandia (Olkiluoto 3), China (Taishan 1-2) y Francia (Flamanville 3)',
      statusEn: 'Operating in Finland (Olkiluoto 3), China (Taishan 1-2), France (Flamanville 3)',
      deployTarget: 'En construcción activa en Hinkley Point C (Reino Unido) y programa de 6 nuevos EPR2 en Francia',
      deployTargetEn: 'Under active construction at Hinkley Point C (UK) and 6 new EPR2 units in France',
      arisUrl: 'https://aris.iaea.org/',
      highlights: [
        'Mayor potencia unitaria del mercado occidental (1650 MWe netos), diseñado para sustituir grandes parques térmicos en redes ultra-robustas.',
        'La unidad Olkiluoto 3 en Finlandia redujo los precios de la electricidad en el mercado nórdico en más de un 50% tras su entrada en operación comercial.',
        'Variante EPR1200 optimizada (1200 MWe) disponible para países con redes eléctricas intermedias.'
      ],
      highlightsEn: [
        'Largest electrical capacity unit in the Western fleet (1650 MWe net), built for massive baseload demand.',
        'Olkiluoto 3 in Finland slashed Nordic spot electricity market prices by over 50% upon commercial operation.',
        'Optimized EPR1200 (1200 MWe) variant available for mid-sized national grid architectures.'
      ]
    }
  ];

  const PRIS_GLOBAL_STATS = {
    operationalReactors: 416,
    totalNetCapacityGWe: 375.4,
    underConstructionReactors: 61,
    underConstructionGWe: 68.5,
    permanentShutdownReactors: 212,
    reactorYearsExperience: 20680,
    annualGenerationTWh: 2602,
    avoidedCO2Gt: 1.8,
    prisPortalUrl: 'https://pris-stats.iaea.org/'
  };

  const PRIS_COUNTRIES_DATA = [
    { country: 'Estados Unidos', countryEn: 'United States', flag: '🇺🇸', code: 'US', operational: 94, capacityGWe: 96.9, sharePct: 18.6, underConst: 0, notes: 'Mayor parque operativo mundial; extensiones de vida útil a 80 años.' },
    { country: 'Francia', countryEn: 'France', flag: '🇫🇷', code: 'FR', operational: 56, capacityGWe: 61.4, sharePct: 64.8, underConst: 1, notes: 'Mayor cuota nuclear del mundo; exportador neto de electricidad a Europa.' },
    { country: 'China', countryEn: 'China', flag: '🇨🇳', code: 'CN', operational: 56, capacityGWe: 54.3, sharePct: 4.9, underConst: 27, notes: 'Líder absoluto en construcción activa (~30 GWe en obras; meta de 150 GWe a 2035).' },
    { country: 'Rusia', countryEn: 'Russia', flag: '🇷🇺', code: 'RU', operational: 36, capacityGWe: 26.9, sharePct: 18.7, underConst: 4, notes: 'Mayor exportador mundial de centrales llave en mano y ciclo de combustible.' },
    { country: 'Corea del Sur', countryEn: 'South Korea', flag: '🇰🇷', code: 'KR', operational: 26, capacityGWe: 25.8, sharePct: 31.5, underConst: 2, notes: 'Líder en eficiencia de construcción; exportador del reactor APR1400.' },
    { country: 'Canadá', countryEn: 'Canada', flag: '🇨🇦', code: 'CA', operational: 19, capacityGWe: 13.7, sharePct: 13.7, underConst: 0, notes: 'Flota CANDU de uranio natural; sitio de Darlington liderando el despliegue de SMRs.' },
    { country: 'Japón', countryEn: 'Japan', flag: '🇯🇵', code: 'JP', operational: 12, capacityGWe: 11.0, sharePct: 5.6, underConst: 2, notes: 'Reactivación progresiva post-Fukushima; 21 reactores adicionales en proceso de reinicio.' },
    { country: 'Ucrania', countryEn: 'Ukraine', flag: '🇺🇦', code: 'UA', operational: 15, capacityGWe: 13.1, sharePct: 55.0, underConst: 2, notes: 'Suministra más del 50% de la matriz energética ucraniana; Zaporiyia en parada fría.' },
    { country: 'España', countryEn: 'Spain', flag: '🇪🇸', code: 'ES', operational: 7, capacityGWe: 7.1, sharePct: 20.3, underConst: 0, notes: 'Aporta más del 20% de la electricidad libre de emisiones de España con factor >90%.' },
    { country: 'Emiratos Árabes Unidos', countryEn: 'United Arab Emirates', flag: '🇦🇪', code: 'AE', operational: 4, capacityGWe: 5.4, sharePct: 25.0, underConst: 0, notes: 'Caso de éxito OIEA: país principiante que completó Barakah 1-4 en tiempo récord.' },
    { country: 'Argentina', countryEn: 'Argentina', flag: '🇦🇷', code: 'AR', operational: 3, capacityGWe: 1.64, sharePct: 7.2, underConst: 1, notes: 'Atucha I, II y Embalse; construyendo el SMR CAREM-25 en Lima, Buenos Aires.' },
    { country: 'Brasil', countryEn: 'Brazil', flag: '🇧🇷', code: 'BR', operational: 2, capacityGWe: 1.88, sharePct: 2.5, underConst: 1, notes: 'Angra 1 y Angra 2 operando; construcción de Angra 3 (1.4 GWe) en reactivación.' },
    { country: 'México', countryEn: 'Mexico', flag: '🇲🇽', code: 'MX', operational: 2, capacityGWe: 1.55, sharePct: 4.8, underConst: 0, notes: 'Central Laguna Verde (Veracruz) con 2 reactores BWR operando con alta confiabilidad.' },
    { country: 'Eslovaquia', countryEn: 'Slovakia', flag: '🇸🇰', code: 'SK', operational: 5, capacityGWe: 2.4, sharePct: 61.3, underConst: 1, notes: 'Segunda mayor cuota nuclear de Europa tras la entrada en servicio de Mochovce 3.' },
    { country: 'Bélgica', countryEn: 'Belgium', flag: '🇧🇪', code: 'BE', operational: 5, capacityGWe: 3.9, sharePct: 41.2, underConst: 0, notes: 'Acuerdo de extensión de vida útil de 10 años para los reactores Doel 4 y Tihange 3.' },
    { country: 'República Checa', countryEn: 'Czech Republic', flag: '🇨🇿', code: 'CZ', operational: 6, capacityGWe: 3.9, sharePct: 40.0, underConst: 0, notes: 'Dukovany y Temelín; seleccionó a KHNP (Corea) para 2 nuevos reactores APR1000.' },
    { country: 'Reino Unido', countryEn: 'United Kingdom', flag: '🇬🇧', code: 'GB', operational: 9, capacityGWe: 5.9, sharePct: 13.9, underConst: 2, notes: 'Construyendo Hinkley Point C (EPR) y planificando Sizewell C y programa de SMRs.' },
    { country: 'India', countryEn: 'India', flag: '🇮🇳', code: 'IN', operational: 23, capacityGWe: 7.4, sharePct: 3.1, underConst: 7, notes: 'Expansión masiva con reactores de agua pesada (PHWR-700) de diseño nacional.' },
    { country: 'Turquía', countryEn: 'Türkiye', flag: '🇹🇷', code: 'TR', operational: 0, capacityGWe: 0.0, sharePct: 0.0, underConst: 4, notes: 'País Principiante en Fase 3: Construcción de 4 reactores VVER-1200 en Akkuyu (4.8 GWe).' },
    { country: 'Egipto', countryEn: 'Egypt', flag: '🇪🇬', code: 'EG', operational: 0, capacityGWe: 0.0, sharePct: 0.0, underConst: 4, notes: 'País Principiante en Fase 3: Construcción simultánea de 4 unidades en El Dabaa (4.8 GWe).' }
  ];

  window.ARIS_REACTORS_DATA = ARIS_REACTORS_DATA;
  window.PRIS_GLOBAL_STATS = PRIS_GLOBAL_STATS;
  window.PRIS_COUNTRIES_DATA = PRIS_COUNTRIES_DATA;

})(window);
