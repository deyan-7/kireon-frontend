
export enum Stichwort {
    APSR = "APSR",
    APSV = "APSV",
    ATEX = "ATEX",
    AbfallR = "AbfallR",
    Abwasser = "Abwasser",
    BarriereFreiheitR = "BarriereFreiheitR",
    BattR = "BattR",
    BattV = "BattV",
    BauProd = "BauProd",
    BauProd__alt = "BauProd (alt)",
    CBAM = "CBAM",
    CLP = "CLP",
    CRA = "CRA",
    CSDDD = "CSDDD",
    CSRD = "CSRD",
    DDG = "DDG",
    DGRL = "DGRL",
    DatenV = "DatenV",
    DualUse = "DualUse",
    E_Label = "E-Label",
    EMV = "EMV",
    ENISA = "ENISA",
    ERP = "ERP",
    EU_Umweltzeichen = "EU-Umweltzeichen",
    EUDR = "EUDR",
    EUTR = "EUTR",
    EWKRL = "EWKRL",
    EinwegkunststoffR = "EinwegkunststoffR",
    FGasV = "FGasV",
    FahrzTypGenV = "FahrzTypGenV",
    FrequenzE = "FrequenzE",
    FuAR = "FuAR",
    KI_VO = "KI-VO",
    KosmetikV = "KosmetikV",
    KrebsR = "KrebsR",
    LebKontV = "LebKontV",
    MSR__alt = "MSR (alt)",
    MSV = "MSV",
    MessGerR = "MessGerR",
    M_V = "MüV",
    NIS2 = "NIS2",
    NSR = "NSR",
    NachhaltigkeitsR = "NachhaltigkeitsR",
    NormV = "NormV",
    OutdoorR = "OutdoorR",
    OzonV = "OzonV",
    POP = "POP",
    PSA = "PSA",
    ProdHR = "ProdHR",
    QuecksilberV = "QuecksilberV",
    REACh = "REACh",
    RUS_SanktionsV = "RUS-SanktionsV",
    Reducing_microplastics = "Reducing microplastics",
    Resilienz = "Resilienz",
    RoHS = "RoHS",
    SpielR = "SpielR",
    TabProdR = "TabProdR",
    TextilKV = "TextilKV",
    TrinkwasserR = "TrinkwasserR",
    TypG = "TypG",
    Umweltstrafrecht = "Umweltstrafrecht",
    UnlautereGeschPrakt = "UnlautereGeschPrakt",
    VK_BattR = "VK-BattR",
    VK_ConstrProd = "VK-ConstrProd",
    VK_EMC = "VK-EMC",
    VK_ERP_EI = "VK-ERP&EI",
    VK_ElectricalESR = "VK-ElectricalESR",
    VK_GPSR = "VK-GPSR",
    VK_MessGer = "VK-MessGer",
    VK_PSTI = "VK-PSTI",
    VK_RER = "VK-RER",
    VK_RoHS = "VK-RoHS",
    VK_SMSR = "VK-SMSR",
    VK_ToySR = "VK-ToySR",
    Verbraucherschutz = "Verbraucherschutz",
    VerpackR = "VerpackR",
    VerpackV = "VerpackV",
    WBRL = "WBRL",
    WEEE = "WEEE",
    ZwangsarbV = "ZwangsarbV",
    kodesign = "Ökodesign"
}

export interface Rahmengesetzgebung {
    stichwort: Stichwort;
    gesetz: string;
    kurztitel: string;
    shortTitle: string;
}

export const subscribedLaws: Rahmengesetzgebung[] = [
    {
        stichwort: Stichwort.TypG,
        gesetz: "(EU) 2018/858",
        kurztitel: "Verordnung über die Genehmigung und die Marktüberwachung von Kraftfahrzeugen",
        shortTitle: "Regulation on the approval and market surveillance of motor vehicles"
    },
    {
        stichwort: Stichwort.EMV,
        gesetz: "2014/30/EG",
        kurztitel: "Richtlinie über elektromagnetische Verträglichkeit",
        shortTitle: "Electromagnetic Compatibility Directive"
    },
    {
        stichwort: Stichwort.FuAR,
        gesetz: "2014/53/EG",
        kurztitel: "Funkanlagenrichtlinie",
        shortTitle: "Radio Equipment Directive"
    },
    {
        stichwort: Stichwort.FrequenzE,
        gesetz: "Nr. 676/2002/EG",
        kurztitel: "Frequenzentscheidung",
        shortTitle: "Radio Spectrum Decision"
    },
    {
        stichwort: Stichwort.AbfallR,
        gesetz: "2008/98/EG",
        kurztitel: "Abfallrahmenrichtlinie",
        shortTitle: "Waste Framework Directive"
    },
    {
        stichwort: Stichwort.EinwegkunststoffR,
        gesetz: "(EU) 2019/904",
        kurztitel: "Einwegkunststoffverordnung",
        shortTitle: "Disposable Plastics Regulation"
    },
    {
        stichwort: Stichwort.VerpackR,
        gesetz: "94/62/EG",
        kurztitel: "Verpackungsrichtlinie",
        shortTitle: "Packaging directive"
    },
    {
        stichwort: Stichwort.VerpackV,
        gesetz: "(EU) 2025/40",
        kurztitel: "Verordnung über Verpackungen und Verpackungsabfälle",
        shortTitle: "Regulation on Packaging and Packaging Waste"
    },
    {
        stichwort: Stichwort.WEEE,
        gesetz: "2012/19/EU",
        kurztitel: "Richtlinie über Elektro- und Elektronik-Altgeräte",
        shortTitle: "Directive on waste electrical and electronic equipment"
    },
    {
        stichwort: Stichwort.Abwasser,
        gesetz: "(EU) 2024/3019",
        kurztitel: "Richtlinie über die Behandlung von kommunalem Abwasser",
        shortTitle: "Directive concerning urban wastewater treatment"
    },
    {
        stichwort: Stichwort.CRA,
        gesetz: "(EU)2024/2847",
        kurztitel: "Cybersicherheitsanforderungen für Produkte",
        shortTitle: "Cybersecurity requirements for products"
    },
    {
        stichwort: Stichwort.KI_VO,
        gesetz: "COM/2021/206 final",
        kurztitel: "Verordnung über Künstliche Intelligenz",
        shortTitle: "Artificial Intelligence Act"
    },
    {
        stichwort: Stichwort.DatenV,
        gesetz: "(EU) 2023/2854",
        kurztitel: "Datenzugang- und Datennutzungsverordnung",
        shortTitle: "Regulation on access and use of data"
    },
    {
        stichwort: Stichwort.NIS2,
        gesetz: "(EU) 2022/2555",
        kurztitel: "Netzwerk- und Informationssicherheits-Richtlinie",
        shortTitle: "Cybersecurity directive"
    },
    {
        stichwort: Stichwort.ENISA,
        gesetz: "(EU) 2019/881",
        kurztitel: "Agentur der Europäischen Union für Cybersicherheit zur Zertifizierung der Cybersicherheit",
        shortTitle: "European Union Agency for Cybersecurity for cybersecurity certification"
    },
    {
        stichwort: Stichwort.CSRD,
        gesetz: "(EU) 2022/2464",
        kurztitel: "Verordnung zur Nachhaltigkeitsberichterstattung",
        shortTitle: "Regulation on sustainability reporting"
    },
    {
        stichwort: Stichwort.CSDDD,
        gesetz: "(EU) 2024/1760",
        kurztitel: "Richtlinie über Sorgfaltspflicht im Bereich der Nachhaltigkeit",
        shortTitle: "Directive on Corporate Sustainability Due Diligence"
    },
    {
        stichwort: Stichwort.EUDR,
        gesetz: "(EU) 2023/1115",
        kurztitel: "Entwaldungsfreie Lieferketten-Verordnung",
        shortTitle: "Deforestation free Products Regulation"
    },
    {
        stichwort: Stichwort.EUTR,
        gesetz: "EU (995/2010)",
        kurztitel: "Holzhandelsverordnung",
        shortTitle: "Timber regulation"
    },
    {
        stichwort: Stichwort.ZwangsarbV,
        gesetz: "(EU) 2024/3015",
        kurztitel: "Verordnung zum Verbot von in Zwangsarbeit hergestellten Produkten",
        shortTitle: "Ordinance banning products manufactured using forced labour"
    },
    {
        stichwort: Stichwort.CBAM,
        gesetz: "(EU) 2023/956",
        kurztitel: "Verordnung zur Schaffung eines CO2-Grenzausgleichssystems",
        shortTitle: "Regulation to establishing a carbon border adjustment mechanism"
    },
    {
        stichwort: Stichwort.M_V,
        gesetz: "(EU) 2019/1020",
        kurztitel: "Marktüberwachungsverordnung",
        shortTitle: "Market Surveillance Regulation"
    },
    {
        stichwort: Stichwort.DDG,
        gesetz: "(EU) 2022/2065",
        kurztitel: "Verordnung über einen Binnenmarkt für digitale Dienste",
        shortTitle: "Regulation on a Single Market For Digital Services"
    },
    {
        stichwort: Stichwort.UnlautereGeschPrakt,
        gesetz: "2005/29/EG",
        kurztitel: "Richtlinie über unlautere Geschäftspraktiken",
        shortTitle: "Unfair Commercial Practices Directive"
    },
    {
        stichwort: Stichwort.Resilienz,
        gesetz: "(EU) 2024/2747",
        kurztitel: "Maßnahmen für einen Binnenmarkt-Notfall",
        shortTitle: "Measures related to an internal market emergency"
    },
    {
        stichwort: Stichwort.E_Label,
        gesetz: "(EU) 2017/1369",
        kurztitel: "Verordnung zu Energieverbrauchskennzeichnung",
        shortTitle: "Regulation on energy consumption labelling"
    },
    {
        stichwort: Stichwort.ERP,
        gesetz: "2009/125/EG",
        kurztitel: "Ökodesign-Richtlinie",
        shortTitle: "Ecodesign Directive"
    },
    {
        stichwort: Stichwort.kodesign,
        gesetz: "(EU) 2024/1781",
        kurztitel: "Ökodesign-Verordnung",
        shortTitle: "Ecodesign Regulation"
    },
    {
        stichwort: Stichwort.EU_Umweltzeichen,
        gesetz: "(EG) Nr. 66/2010",
        kurztitel: "Verordnung  über das EU-Umweltzeichen ",
        shortTitle: "Regulation on the EU Ecolabel"
    },
    {
        stichwort: Stichwort.FGasV,
        gesetz: "(EU) 2024/573",
        kurztitel: "Verordnung über fluorierte Treibhausgase",
        shortTitle: "Ordinance on Fluorinated Greenhouse Gases"
    },
    {
        stichwort: Stichwort.EWKRL,
        gesetz: "(EU) 2019/904",
        kurztitel: "Richtlinie über die Verringerung der Auswirkungen bestimmter Kunststoffprodukte auf die Umwelt",
        shortTitle: "Directive on the reduction of the impact of certain plastic products on the environment"
    },
    {
        stichwort: Stichwort.OzonV,
        gesetz: "(EG) Nr. 1005/2009",
        kurztitel: "Verordnung über Stoffe, die zum Abbau der Ozonschicht führen",
        shortTitle: "Regulation on substances that deplete the ozone layer"
    },
    {
        stichwort: Stichwort.Reducing_microplastics,
        gesetz: "COM(2023)645",
        kurztitel: "Umweltverschmutzung durch Mikroplastik – Maßnahmen zur Eindämmung der Umweltfolgen",
        shortTitle: "Environmental pollution by microplastics - Measures to mitigate the environmental impact"
    },
    {
        stichwort: Stichwort.NachhaltigkeitsR,
        gesetz: "(EU) 2024/1799",
        kurztitel: "Nachhaltiger Konsum von Gütern – Förderung von Reparatur und Wiederverwendung",
        shortTitle: "Sustainable consumption of goods - promoting repair and reuse"
    },
    {
        stichwort: Stichwort.APSR,
        gesetz: "2001/95/EG",
        kurztitel: "Richtlinie über die allgemeine Produktsicherheit",
        shortTitle: "General Product Safety Directive"
    },
    {
        stichwort: Stichwort.APSV,
        gesetz: "(EU) 2023/988",
        kurztitel: "Verordnung über die allgemeine Produktsicheheit",
        shortTitle: "Regulation on general product safety"
    },
    {
        stichwort: Stichwort.ATEX,
        gesetz: "2014/34/EG",
        kurztitel: "Richtlinie über Schutzsysteme in explosionsgefährdeten Bereichen",
        shortTitle: "Directive on protective systems in potentially explosive atmospheres"
    },
    {
        stichwort: Stichwort.BattR,
        gesetz: "2006/66/EG",
        kurztitel: "Batterierichtlinie",
        shortTitle: "Battery Directive"
    },
    {
        stichwort: Stichwort.BattV,
        gesetz: "(EU) 2023/1542",
        kurztitel: "Batterieverordnung",
        shortTitle: "Battery Regulation"
    },
    {
        stichwort: Stichwort.BauProd__alt,
        gesetz: "(EU) Nr. 305/2011",
        kurztitel: "Bauprodukteverordnung",
        shortTitle: "Construction Products Regulation"
    },
    {
        stichwort: Stichwort.BauProd,
        gesetz: "(EU) 2024/3110",
        kurztitel: "Bauprodukteverordnung",
        shortTitle: "Construction Products Regulation"
    },
    {
        stichwort: Stichwort.DGRL,
        gesetz: "2014/68/EU",
        kurztitel: "Druckgeräterichtlinie",
        shortTitle: "Pressure equipment directive"
    },
    {
        stichwort: Stichwort.KosmetikV,
        gesetz: "(EG) Nr. 1223/2009",
        kurztitel: "Kosmetikverordnung",
        shortTitle: "Cosmetics Regulation"
    },
    {
        stichwort: Stichwort.MSR__alt,
        gesetz: "2006/42/EG",
        kurztitel: "Maschinenrichtlinie ",
        shortTitle: "Machinery Directive "
    },
    {
        stichwort: Stichwort.MSV,
        gesetz: "(EU) 2023/1230",
        kurztitel: "Maschinenverordnung",
        shortTitle: "Machinery Regulation "
    },
    {
        stichwort: Stichwort.NSR,
        gesetz: "2014/35/EG",
        kurztitel: "Niederspannungsrichtlinie",
        shortTitle: "Low Voltage Directive"
    },
    {
        stichwort: Stichwort.OutdoorR,
        gesetz: "2000/14/EG",
        kurztitel: "Richtlinie für im Freien verwendete Geräte",
        shortTitle: "Directive for appliances used outdoors"
    },
    {
        stichwort: Stichwort.PSA,
        gesetz: "(EU) 2016/425",
        kurztitel: "Verordnung über persönliche Schutzausrüstung",
        shortTitle: "Regulation on personal protective equipment"
    },
    {
        stichwort: Stichwort.SpielR,
        gesetz: "2009/48/EG",
        kurztitel: "Spielzeugrichtlinie",
        shortTitle: "Toys Directive"
    },
    {
        stichwort: Stichwort.DualUse,
        gesetz: "(EU) 2021/821",
        kurztitel: "Kontrolle von Gütern mit doppeltem Verwendungszweck",
        shortTitle: "Control of dual-use goods"
    },
    {
        stichwort: Stichwort.WBRL,
        gesetz: "(EU) 2019/1937",
        kurztitel: "Schutz von Personen, die Verstöße gegen das Unionsrecht melden",
        shortTitle: " protection of persons who report breaches of Union law"
    },
    {
        stichwort: Stichwort.RUS_SanktionsV,
        gesetz: "(EU) Nr. 833/2014",
        kurztitel: "Restriktive Maßnahmen gegen Russland ",
        shortTitle: "Restrictive measures against Russia "
    },
    {
        stichwort: Stichwort.FahrzTypGenV,
        gesetz: "(EU) 2018/858",
        kurztitel: "Fahrzeugtypengenehmigungsverordnung",
        shortTitle: "Vehicle Type Approval Regulation"
    },
    {
        stichwort: Stichwort.MessGerR,
        gesetz: "2014/32/EU",
        kurztitel: "Messgeräterichtlinie",
        shortTitle: "Measuring Instruments Directive"
    },
    {
        stichwort: Stichwort.NormV,
        gesetz: "(EU) Nr. 1025/2012",
        kurztitel: "Normungverordnung",
        shortTitle: "Standardisation Regulation"
    },
    {
        stichwort: Stichwort.TextilKV,
        gesetz: "(EU) Nr. 1007/2011",
        kurztitel: "Textilkennzeichnungsverordnung",
        shortTitle: "Textile Labelling Regulation"
    },
    {
        stichwort: Stichwort.BarriereFreiheitR,
        gesetz: "(EU) 2019/882",
        kurztitel: "Barrierefreiheits-Richtlinie",
        shortTitle: "Accessibility Requirements for Products Directive"
    },
    {
        stichwort: Stichwort.ProdHR,
        gesetz: "(EU) 2024/2853",
        kurztitel: "Richtlinie über die Haftung für fehlerhafte Produkte",
        shortTitle: ""
    },
    {
        stichwort: Stichwort.Verbraucherschutz,
        gesetz: "(EU) 2019/771",
        kurztitel: "Richtlinie über bestimmte vertragsrechtliche Aspekte des Warenkaufs",
        shortTitle: "Directive on certain aspects concerning contracts for the sale of goods"
    },
    {
        stichwort: Stichwort.Umweltstrafrecht,
        gesetz: "(EU) 2024/1203",
        kurztitel: "Richtlinie über den strafrechtlichen Schutz der Umwelt",
        shortTitle: "Directive on the protection of the environment through criminal law"
    },
    {
        stichwort: Stichwort.CLP,
        gesetz: "(EU) 1272/2008",
        kurztitel: "Verordnung über Einstufung, Kennzeichnung und Verpackung von Stoffen und Gemischen",
        shortTitle: "Ordinance on Classification, Labelling and Packaging of Substances and Mixtures"
    },
    {
        stichwort: Stichwort.LebKontV,
        gesetz: "(EG) Nr. 1935/2004",
        kurztitel: "Verordnung über Materialien und Gegenstände die dazu bestimmt sind mit Lebensmitteln in Berührung zu kommen",
        shortTitle: "Ordinance on materials and articles intended to come into contact with foodstuffs"
    },
    {
        stichwort: Stichwort.QuecksilberV,
        gesetz: "(EU) 2017/852",
        kurztitel: "Verordnung über Quecksilber",
        shortTitle: "Mercury Ordinance"
    },
    {
        stichwort: Stichwort.POP,
        gesetz: "(EU) 2019/1021",
        kurztitel: "Verordnung über persistente organische Schadstoffe",
        shortTitle: "Regulation on Persistent Organic Pollutants"
    },
    {
        stichwort: Stichwort.REACh,
        gesetz: "(EG) Nr. 1907/2006",
        kurztitel: "Verordnung über Registrierung, Bewertung, Zulassung und Beschränkung von Chemikalien",
        shortTitle: "Regulation on the Registration, Evaluation, Authorisation and Restriction of Chemicals"
    },
    {
        stichwort: Stichwort.RoHS,
        gesetz: "2011/65/EU",
        kurztitel: "Richtlinie zur Beschränkung der Verwendung bestimmter gefährlicher Stoffe in Elektro- und Elektrogeräten",
        shortTitle: "Directive on the restriction of the use of certain hazardous substances in electrical and electronic equipment"
    },
    {
        stichwort: Stichwort.KrebsR,
        gesetz: "2004/37/EG",
        kurztitel: "Richtlinie  über den Schutz der Arbeitnehmer gegen Gefährdung durch Karzinogene oder Mutagene",
        shortTitle: "Directive on the protection of workers from the risks related to exposure to carcinogens or mutagens"
    },
    {
        stichwort: Stichwort.TabProdR,
        gesetz: "2014/40/EU",
        kurztitel: "Tabakerzeugnis-Richtlinie",
        shortTitle: "Tobacco Products Directive"
    },
    {
        stichwort: Stichwort.TrinkwasserR,
        gesetz: "(EU) 2020/2184",
        kurztitel: "Trinkwasserrichtlinie",
        shortTitle: "Drinking Water Directive"
    },
    {
        stichwort: Stichwort.VK_EMC,
        gesetz: "Electromagnetic Compatibility Regulations 2016",
        kurztitel: "Richtlinie über elektromagnetische Verträglichkeit (Vereinigtes Königreich)",
        shortTitle: "Electromagnetic Compatibility Directive (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_RER,
        gesetz: "Radio Equipment Regulations 2017",
        kurztitel: "Funkanlagenrichtlinie (Vereinigtes Königreich)",
        shortTitle: "Radio Equipment Directive (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_PSTI,
        gesetz: "Product Security and Telecommunication Infrastructure Act 2022",
        kurztitel: "Cybersicherheitsanforderungen für Produkte",
        shortTitle: "Cybersecurity Act (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_ERP_EI,
        gesetz: "Ecodesign and Energy Information Regulations 2020",
        kurztitel: "Ökodesign-Richtlinie (Vereinigtes Königreich)",
        shortTitle: "Ecodesign Directive (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_BattR,
        gesetz: "Batteries and Accumulators Regulations 1994",
        kurztitel: "Batterierichtlinie (Vereinigtes Königreich)",
        shortTitle: "Battery Directive (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_ConstrProd,
        gesetz: "Construction Products (Amendment etc.) (EU Exit) Regulations 2019",
        kurztitel: "Bauprodukteverordnung (Vereinigtes Königreich)",
        shortTitle: "Construction Products Regulation (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_ElectricalESR,
        gesetz: "Electrical Equipment (Safety) Regulations 2016",
        kurztitel: "Niederspannungsrichtlinie (Vereinigtes Königreich)",
        shortTitle: "Low Voltage Directive (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_GPSR,
        gesetz: "General Product Safety Regulations 2005",
        kurztitel: "Richtlinie über die allgemeine Produktsicherheit (Vereinigtes Königreich)",
        shortTitle: "General Product Safety Directive (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_SMSR,
        gesetz: "Supply of Machinery (Safety) Regulations 2008",
        kurztitel: "Maschinenrichtlinie (Vereinigtes Königreich)",
        shortTitle: "Machinery Directive (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_ToySR,
        gesetz: "Toys(Safety)Regulations 2011",
        kurztitel: "Spielzeugrichtlinie (Vereinigtes Königreich)",
        shortTitle: "Toys Directive (United Kingdom)"
    },
    {
        stichwort: Stichwort.VK_MessGer,
        gesetz: "Weights and Measures (Prescribed Stamp) Regulations 1968",
        kurztitel: "Verordnung über Gewichte und Maße (vorgeschriebener Stempel) von 1968",
        shortTitle: "Weights and Measures (Prescribed Stamp) Regulations 1968"
    },
    {
        stichwort: Stichwort.VK_RoHS,
        gesetz: "The RoHS Regulations",
        kurztitel: "RoHS",
        shortTitle: "The RoHS Regulations"
    }
];
