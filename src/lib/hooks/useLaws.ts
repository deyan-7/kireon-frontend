import { useState, useMemo, useCallback } from 'react';
import { Rahmengesetzgebung, subscribedLaws, Stichwort } from '@/types/laws';

export interface Bereich {
  name: string;
  stichworte: Stichwort[];
}

// Define the Bereiche (areas/categories) based on logical groupings
export const bereiche: Bereich[] = [
  {
    name: 'Produktsicherheit',
    stichworte: [
      Stichwort.APSR,
      Stichwort.APSV,
      Stichwort.ProdHR,
      Stichwort.PSA,
      Stichwort.SpielR,
      Stichwort.MSR__alt,
      Stichwort.MSV,
      Stichwort.DGRL,
      Stichwort.OutdoorR,
      Stichwort.ATEX,
    ]
  },
  {
    name: 'Elektronik & Elektrik',
    stichworte: [
      Stichwort.EMV,
      Stichwort.FuAR,
      Stichwort.FrequenzE,
      Stichwort.NSR,
      Stichwort.BattR,
      Stichwort.BattV,
      Stichwort.WEEE,
      Stichwort.RoHS,
    ]
  },
  {
    name: 'Umwelt & Nachhaltigkeit',
    stichworte: [
      Stichwort.AbfallR,
      Stichwort.EinwegkunststoffR,
      Stichwort.VerpackR,
      Stichwort.VerpackV,
      Stichwort.Abwasser,
      Stichwort.CSRD,
      Stichwort.CSDDD,
      Stichwort.EUDR,
      Stichwort.EUTR,
      Stichwort.CBAM,
      Stichwort.E_Label,
      Stichwort.ERP,
      Stichwort.kodesign,
      Stichwort.EU_Umweltzeichen,
      Stichwort.FGasV,
      Stichwort.EWKRL,
      Stichwort.OzonV,
      Stichwort.Reducing_microplastics,
      Stichwort.NachhaltigkeitsR,
      Stichwort.Umweltstrafrecht,
    ]
  },
  {
    name: 'Cybersicherheit & Digitales',
    stichworte: [
      Stichwort.CRA,
      Stichwort.KI_VO,
      Stichwort.DatenV,
      Stichwort.NIS2,
      Stichwort.ENISA,
      Stichwort.DDG,
    ]
  },
  {
    name: 'Chemikalien & Stoffe',
    stichworte: [
      Stichwort.CLP,
      Stichwort.REACh,
      Stichwort.QuecksilberV,
      Stichwort.POP,
      Stichwort.KrebsR,
    ]
  },
  {
    name: 'Bauprodukte',
    stichworte: [
      Stichwort.BauProd,
      Stichwort.BauProd__alt,
      Stichwort.BarriereFreiheitR,
    ]
  },
  {
    name: 'Fahrzeuge',
    stichworte: [
      Stichwort.TypG,
      Stichwort.FahrzTypGenV,
    ]
  },
  {
    name: 'Marktüberwachung & Compliance',
    stichworte: [
      Stichwort.M_V,
      Stichwort.WBRL,
      Stichwort.Resilienz,
      Stichwort.ZwangsarbV,
      Stichwort.UnlautereGeschPrakt,
      Stichwort.Verbraucherschutz,
    ]
  },
  {
    name: 'Spezielle Produkte',
    stichworte: [
      Stichwort.KosmetikV,
      Stichwort.LebKontV,
      Stichwort.TabProdR,
      Stichwort.TrinkwasserR,
      Stichwort.TextilKV,
      Stichwort.MessGerR,
      Stichwort.NormV,
    ]
  },
  {
    name: 'Internationale Regelungen',
    stichworte: [
      Stichwort.DualUse,
      Stichwort.RUS_SanktionsV,
    ]
  },
  {
    name: 'UK Regelungen',
    stichworte: [
      Stichwort.VK_BattR,
      Stichwort.VK_ConstrProd,
      Stichwort.VK_EMC,
      Stichwort.VK_ERP_EI,
      Stichwort.VK_ElectricalESR,
      Stichwort.VK_GPSR,
      Stichwort.VK_MessGer,
      Stichwort.VK_PSTI,
      Stichwort.VK_RER,
      Stichwort.VK_RoHS,
      Stichwort.VK_SMSR,
      Stichwort.VK_ToySR,
    ]
  },
];

export const useLaws = () => {
  const [laws] = useState<Rahmengesetzgebung[]>(subscribedLaws);
  const [filterText, setFilterText] = useState('');
  const [selectedBereich, setSelectedBereich] = useState<Bereich | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<Rahmengesetzgebung | null>(null);

  const filteredLaws = useMemo(() => {
    let lawsToShow = laws;

    // 1. First, filter by the selected Bereich from the sidebar
    if (selectedBereich) {
      lawsToShow = laws.filter(law => 
        selectedBereich.stichworte.includes(law.stichwort)
      );
    }

    // 2. Then, filter by the text input on the remaining laws
    const lowercasedFilter = filterText.toLowerCase();
    if (lowercasedFilter) {
      lawsToShow = lawsToShow.filter(law =>
        law.kurztitel.toLowerCase().includes(lowercasedFilter) ||
        law.gesetz.toLowerCase().includes(lowercasedFilter) ||
        law.stichwort.toLowerCase().includes(lowercasedFilter) ||
        law.shortTitle.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    return lawsToShow;
  }, [laws, filterText, selectedBereich]);

  const selectBereich = useCallback((bereich: Bereich | null) => {
    setSelectedBereich(bereich);
    setFilterText(''); // Reset text filter when changing Bereich
  }, []);

  const selectLaw = useCallback((law: Rahmengesetzgebung) => {
    setSelectedLaw(law);
  }, []);

  const closeDialog = useCallback(() => {
    setSelectedLaw(null);
  }, []);

  // Count laws per Bereich for display in sidebar
  const bereichCounts = useMemo(() => {
    const counts = new Map<string, number>();
    bereiche.forEach(bereich => {
      const count = laws.filter(law => 
        bereich.stichworte.includes(law.stichwort)
      ).length;
      counts.set(bereich.name, count);
    });
    return counts;
  }, [laws]);

  return {
    laws,
    bereiche,
    bereichCounts,
    filteredLaws,
    selectedLaw,
    filterText,
    selectedBereich,
    setFilterText,
    selectBereich,
    selectLaw,
    closeDialog,
  };
};