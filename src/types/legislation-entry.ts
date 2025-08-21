/**
 * Frontend model for legislative entries (Gesetzgebungseinträge)
 * Matches the backend Pydantic model 1:1
 */

export interface LegislationEntry {
  id?: string;
  thema: string;
  stichwort: string;
  dokument: string;
  dokument_jahr?: number | null;
  gesetzgebung: string;
  gesetzgebung_jahr?: number | null;
  kurztitel: string;
  kurztitel_englisch?: string | null;
  vollzitat: string;
  fundstelle: string;
  fundstelle_url?: string | null;
  volltext_url?: string | null;
  status: LegislationStatus;
  stichtag: string; // ISO date string, will be parsed to Date when needed
  rechtsakt?: string | null;
  durchfuehrung_von?: string | null;
  typ: string;
  rechtsgrundlage?: string | null;
  richtlinie?: string | null;
  gesetzeskuerzel?: string | null;
  anmerkungen?: string | null;
}

export enum LegislationStatus {
  ENTWURF = 'Entwurf',
  IN_KRAFT = 'In Kraft',
  AUFGEHOBEN = 'Aufgehoben',
  AUSSER_KRAFT = 'Außer Kraft'
}

// Mock data for initial development
export const MOCK_LEGISLATION_ENTRIES: LegislationEntry[] = [
  {
    id: '1',
    thema: 'Typgenehmigung',
    stichwort: 'Typgenehmigung',
    dokument: '2018/858',
    dokument_jahr: 2018,
    gesetzgebung: '(EU) 2018/858',
    gesetzgebung_jahr: 2018,
    kurztitel: 'Verordnung über die Genehmigung und Marktüberwachung von Kraftfahrzeugen',
    kurztitel_englisch: 'Regulation on approval and market surveillance of motor vehicles',
    vollzitat: 'Verordnung (EU) 2018/858 des Europäischen Parlaments und des Rates vom 30. Mai 2018 über die Genehmigung und die Marktüberwachung von Kraftfahrzeugen und Kraftfahrzeuganhängern sowie von Systemen, Bauteilen und selbstständigen technischen Einheiten für diese Fahrzeuge',
    fundstelle: 'ABl. L 151 vom 14.6.2018, S. 1',
    fundstelle_url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32018R0858',
    volltext_url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32018R0858',
    status: LegislationStatus.IN_KRAFT,
    stichtag: '2020-09-01',
    rechtsakt: 'Verordnung',
    durchfuehrung_von: null,
    typ: 'EU-Verordnung',
    rechtsgrundlage: 'Art. 114 AEUV',
    richtlinie: null,
    gesetzeskuerzel: 'TG-VO',
    anmerkungen: 'Ersetzt Richtlinie 2007/46/EG'
  },
  {
    id: '2',
    thema: 'Cybersicherheit',
    stichwort: 'Cybersecurity',
    dokument: '2019/2144',
    dokument_jahr: 2019,
    gesetzgebung: '(EU) 2019/2144',
    gesetzgebung_jahr: 2019,
    kurztitel: 'Verordnung über Anforderungen an die Typgenehmigung von Fahrzeugen hinsichtlich der Cybersicherheit',
    kurztitel_englisch: 'Regulation on type-approval requirements for vehicles regarding cybersecurity',
    vollzitat: 'Verordnung (EU) 2019/2144 des Europäischen Parlaments und des Rates vom 27. November 2019 über die Typgenehmigungsanforderungen für Kraftfahrzeuge und Kraftfahrzeuganhänger',
    fundstelle: 'ABl. L 325 vom 16.12.2019, S. 1',
    fundstelle_url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32019R2144',
    volltext_url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32019R2144',
    status: LegislationStatus.IN_KRAFT,
    stichtag: '2022-07-06',
    rechtsakt: 'Verordnung',
    durchfuehrung_von: null,
    typ: 'EU-Verordnung',
    rechtsgrundlage: 'Art. 114 AEUV',
    richtlinie: null,
    gesetzeskuerzel: 'GSR',
    anmerkungen: 'General Safety Regulation - Enthält Cybersecurity-Anforderungen'
  }
];