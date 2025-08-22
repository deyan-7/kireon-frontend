/**
 * Frontend model for legislative entries (Gesetzgebungseinträge)
 * Matches the backend Pydantic model 1:1
 */

export interface LegislationEntry {
  id?: string;
  bereich?: string | null;
  gesetzeskuerzel?: string | null; // Mapped from ges_kuerzel
  gesetzgebung: string;
  textquelle_url?: string | null; // Mapped from textquelle
  bezug?: string | null;
  zitiert?: string | null;
  initiative?: string | null;
  status?: string | null;
  markt?: string | null;
  stichtag: string; // ISO Date String
  folgestatus?: string | null;
  infoquelle_url?: string | null; // Mapped from infoquelle
  produktbereich?: string | null;
  thema: string;
  information?: string | null;
  betroffene?: string | null;
  ausblick?: string | null;
}

// Mock data for initial development
export const MOCK_LEGISLATION_ENTRIES: LegislationEntry[] = [
  {
    id: "208.4",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=OJ%3AL_202590356",
    bezug: "A",
    zitiert: "(EU) 2024/1781",
    initiative: null,
    status: "in Kraft",
    markt: "EU",
    stichtag: "2025-04-08",
    folgestatus: "Gültigkeit",
    infoquelle_url: null,
    produktbereich: "Produkte mit hohem ökologischen Einsparpotenzial",
    thema: "Berichtigungen zur Ökodesign-Rahmenverordnung (EU) 2024/1781",
    information: "An 4 Stellen des Gesetzestextes werden Berichtigungen vorgenommen. Lediglich bei der Berichtigung Artikel 41 (4) zum EU-Umweltzeichen sind Marktteilnehmer direkt betroffen.",
    betroffene: "Hersteller, Importeure, deren Produkte unter eine Durchführungs-VO fallen",
    ausblick: "Die Berichtigungen gelten bereits, sind aber erst mit Gültigkeit der Rahmenverordnung (EU) 2023/1781 zu berücksichtigen"
  },
  {
    id: "439.0",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: null,
    bezug: "A",
    zitiert: "(EU) 2024/1834",
    initiative: "#14361",
    status: "Entwurf",
    markt: "EU",
    stichtag: "2025-01-24",
    folgestatus: "Frist abgelaufen",
    infoquelle_url: "EU-Kommission",
    produktbereich: "Ventilator",
    thema: "Ökodesign-Anforderungen an Ventilatoren  Änderung der EU-Vorschriften für Ventilatoren, die von Motoren mit einer Leistung zwischen 125 Watt und 500 Kilowatt angetrieben werden",
    information: "Ziel dieser Initiative ist es, kleinere technische Aspekte in der Verordnung (EU) 2024/1834 der Kommission über Ökodesign-Anforderungen an Ventilatoren, die von Motoren mit einer elektrischen Eingangsleistung zwischen 125 Watt und 500 Kilowatt angetrieben werden, zu klären und zu berichtigen (Änderung auf Anhang I, II, III  der VO  (EU) 2024/1834)",
    betroffene: "Hersteller, Importeur, Bevollmächtigte",
    ausblick: "weitere Beobachtung durch Trade-e-bility"
  },
  {
    id: "537.0",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: "(EU) 2025/533",
    bezug: "DV",
    zitiert: "(EU) 2019/2018,(EU) 2019/2024",
    initiative: null,
    status: "veröffentlicht",
    markt: "EU",
    stichtag: "2025-03-26",
    folgestatus: "in Kraft",
    infoquelle_url: null,
    produktbereich: "Verkaufskühlmöbel und Pozzetti für Speiseeis",
    thema: "Aktualisierung harmonisierter Normen",
    information: "Die Norm EN 16838:2024 wurde zur Umsetzung der Verordnungen (EU) 2019/2018 und (EU) 2019/2024 harmonisiert.",
    betroffene: "Hersteller, Einführer",
    ausblick: "Betroffenen sollten bei der Umsetzung der Ökodesignanforderungen sowie der Energieklassifizierung die aufgeführte Norm anwenden."
  },
  {
    id: "552.0",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: null,
    bezug: "DV",
    zitiert: "EU) 2015/1095",
    initiative: "12850",
    status: "Sondierung",
    markt: "EU",
    stichtag: "Q3 2025",
    folgestatus: "Entwurf eines Rechtsakts",
    infoquelle_url: "Energieeffizienz  Überprüfung der Ökodesign-Anforderungen an gewerbliche Kühlgeräte",
    produktbereich: "Gewerbliche Kühlgeräte",
    thema: "Im Rahmen dieser Initiative werden die Ökodesign-Anforderungen überprüft, um festzustellen, ob weitere Energie- und Ressourceneinsparungen erzielt werden können.",
    information: "1. Erhöhung der Energieeffizienzanforderungen für Produkte, die unter die geltende ÖkodesignEffizienzanforderungen fallen  2. Neuskalierung des Energielabels gewerblicher Kühllagerschränke 3. Ausweitung des Geltungsbereichs der Anforderungen an Ökodesign und Energieverbrauchskennzeichnung: a. Einführung von Ökodesign-Effizienzanforderungen für Schnellkühler/-froster b. Einführung von Anforderungen an die Energieverbrauchskennzeichnung für Schnellkühler/-froster c. Einführung von Ökodesign-Effizienzanforderungen für zu wissenschaftlichen und medizinischen  Zwecken genutzte Kühllagerschränke d. Einführung von Anforderungen an die Energieverbrauchskennzeichnung für zu wissenschaftlichen und  medizinischen Zwecken genutzte Kühllagerschränke  e. Einführung eines Energielabels für getrennte Verflüssigungssätze 4. Einführung von Anforderungen in Bezug auf Ersatzteile, Reparatur und Wartung",
    betroffene: "Hersteller, Importeure betreffender Produkte",
    ausblick: "Weitere Beobachtung (durch trade-e-bility).  Bei Veröffentlichung sind die neue Ökodesgin-Anforderung zu berücksichtigen"
  },
  {
    id: "563.0",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32025D1059",
    bezug: "B",
    zitiert: "(EU) Nr. 626/2011, (EU) 2019/2015, (EU) 2019/2016, (EU) 2023/2016, (EU) 2029/2018",
    initiative: null,
    status: "veröffentlicht",
    markt: "EU",
    stichtag: "2025-04-24",
    folgestatus: "Gültigkeit",
    infoquelle_url: null,
    produktbereich: "Luftkonditionierer, Lichtquellen, Kühlgeräten und Kühlgeräten mit Direktverkaufsfunktion",
    thema: "Übernahme von Ökodesign-Anforderungen für Norwegen und Island",
    information: "Die Änderungen der Durchführungsverordnung (EU) 2023/2016 bezüglich der aufgeführten Produkte und den dazu relevanten Durchführungsverordnungen sind nun auch in den EWR-Ländern gültig",
    betroffene: "Hersteller, Importeure, Händler",
    ausblick: "Die geänderten Ökodesignanforderungen sind nun auch beim Inverkehrbringen in Island und Norwegen zu berücksichtigen"
  },
  {
    id: "564.0",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: null,
    bezug: "A",
    zitiert: "(EU) 2019/2024",
    initiative: "#14251",
    status: "Sondierung",
    markt: "EU",
    stichtag: "2025-06-22",
    folgestatus: "Öffentliche Konsultation",
    infoquelle_url: "Energieeffizienz  Ökodesign-Anforderungen an Kühlgeräte mit Direktverkaufsfunktion  Überarbeitung",
    produktbereich: "Kühlgeräte mit Direktverkaufsfunktion",
    thema: "Energieeffizienz  Ökodesign-Anforderungen an Kühlgeräte mit Direktverkaufsfunktion  Überarbeitung",
    information: "In der Folgenabschätzung werden mindestens die folgenden Hauptaspekte berücksichtigt: 1. Mess- und Prüfmethoden, 2. Anforderungen an die Energie- und Materialeffizienz, 3. Aspekte der Energieverbrauchskennzeichnung, einschließlich der Skala des Energielabels, 4. der Anwendungsbereich, 5. weitere Umweltauswirkungen",
    betroffene: "Hersteller, Importeure betreffender Produkte",
    ausblick: "Weitere Beobachtung (durch trade-e-bility)."
  },
  {
    id: "575.0",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: null,
    bezug: "A",
    zitiert: "(EU) 2019/2019",
    initiative: "14249",
    status: "Sondierung",
    markt: "EU",
    stichtag: "2025-06-22",
    folgestatus: "Öffentliche Konsultation",
    infoquelle_url: "EU-Kommission",
    produktbereich: "Kühlgeräte",
    thema: "Energieeffizienz  Ökodesign-Anforderungen an Kühlgeräte  Überarbeitung",
    information: "Die Kommission beabsichtigt, die Ökodesign-Anforderungen an Kühlgeräte regelmäßig zu überprüfen.",
    betroffene: "Hersteller, Importeure betreffender Produkte",
    ausblick: "Weitere Beobachtung (durch trade-e-bility)."
  },
  {
    id: "579.0",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=celex%3A52025PC0504",
    bezug: "A",
    zitiert: "(EU) Nr. 765/2008, (EU) 2016/424, (EU) 2016/425, (EU) 2016/426, (EU) 2023/1230, (EU) 2023/1542, (EU) 2024/1781",
    initiative: null,
    status: "Entwurf",
    markt: "EU",
    stichtag: "2025-05-21",
    folgestatus: "im Trilog",
    infoquelle_url: "2025/0134(COD)",
    produktbereich: "Produkte und Geräte mit ökologischer Wirkung",
    thema: "Omnibus-Verordnung zur Erleichterung der Konformitätsbewertung nach mehreren Produktgesetzgebungen",
    information: "Die Dokumentations- und Berichtspflcihten sollen durch Digitalisierung der Dokumentation erleichtert werden. Dafür wird zwingend ein digitaler Ansprechpartner des Herstellers verlangt (EG 9).",
    betroffene: "Hersteller, Einführer",
    ausblick: "Betroffene können ihre Dokumentation weitestgehend digitalisieren. Die Details könnne sich im Rahmen des Trilog-Verfahrens aber noch ändern. trade-e-bility informiert drüber zu gegebener Zeit."
  },
  {
    id: "591.0",
    bereich: "Ökodesign",
    gesetzeskuerzel: "Ökodesign",
    gesetzgebung: "(EU) 2024/1781",
    textquelle_url: "den Arbeitsschutz bei Exposition mit chemischen Stoffen und Gemischen",
    bezug: "DV",
    zitiert: "ESPR 2024/1781; Dir 2013/34/EU",
    initiative: "#14590",
    status: "Entwurf",
    markt: "EU",
    stichtag: "2025-07-10",
    folgestatus: "Konsultationsende",
    infoquelle_url: null,
    produktbereich: "Unverkaufte Verbraucherprodukte (z. B. Textilien, Bekleidung, Elektronik)",
    thema: "Offenlegung unverkaufter Verbraucherprodukte",
    information: "Angaben zu Menge, Gewicht, Vernichtungsgründen, Behandlungsarten und Präventions-maßnahmen im standardisierten Format; Verifizierungspflicht",
    betroffene: "Hersteller; Importeure; Händler; Online-Marktplätze",
    ausblick: "Vorbeugemaßnahmen; Offenlegung auf Website/CSRD; Meldung Unverkaufsdaten; Prüfungs-bericht (limited assurance); Einhaltung Format- & Verifizierungsregeln"
  }
];
