import { Country, MarketsAll } from "@/types/counties";
import { Stichwort } from "@/types/laws";

export const OTHER_TAGS = ["Hersteller", "Produzent", "Marktplatzbetreiber"];

export interface Customer {
  id: string;
  name: string;
  address: string;
  metadata: string;
  subscribedLaws: Stichwort[];
  subscribedCountries: Country[];
  otherTags: string[];
}

// Get all law values for the mock data
const ALL_LAWS: Stichwort[] = Object.values(Stichwort);

export const generateMockCustomers = (): Customer[] => {
  return [
    {
      id: "kunde-1",
      name: "Kunde 1",
      address: "Hauptstraße 1, 10115 Berlin",
      metadata: "Premium-Mitglied seit 2021",
      subscribedLaws: [...ALL_LAWS],
      subscribedCountries: [...MarketsAll],
      otherTags: ["Hersteller", "Produzent"],
    },
    {
      id: "kunde-2",
      name: "Kunde 2",
      address: "Musterweg 12, 80331 München",
      metadata: "Standard-Mitglied",
      subscribedLaws: [Stichwort.BattV, Stichwort.kodesign],
      subscribedCountries: [Country.EU],
      otherTags: ["Marktplatzbetreiber"],
    },
    {
      id: "kunde-3",
      name: "Kunde 3",
      address: "Beispielallee 7, 20095 Hamburg",
      metadata: "Test-Account",
      subscribedLaws: [Stichwort.POP, Stichwort.EUTR],
      subscribedCountries: [Country.EU],
      otherTags: ["Hersteller"],
    }
  ];
};