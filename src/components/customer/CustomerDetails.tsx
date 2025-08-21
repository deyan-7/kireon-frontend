"use client";

import { Customer, OTHER_TAGS } from "@/domain/customer";
import { SearchableTagSelector } from "@/components/shared/SearchableTagSelector";
import { Stichwort } from "@/types/laws";
import { MarketsAll, CountryName } from "@/types/counties";
import Image from "next/image";
import styles from "./CustomerDetails.module.scss";

interface CustomerDetailsProps {
  customer: Customer;
  onUpdate: (
    customerId: string,
    updates: Partial<
      Pick<Customer, "subscribedLaws" | "subscribedCountries" | "otherTags">
    >
  ) => void;
}

export function CustomerDetails({ customer, onUpdate }: CustomerDetailsProps) {
  // Get all law enum values
  const ALL_LAWS: Stichwort[] = Object.values(Stichwort);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.customerName}>{customer.name}</h1>
            <p className={styles.customerAddress}>{customer.address}</p>
            <p className={styles.customerMetadata}>{customer.metadata}</p>
          </div>
          <div className={styles.logoContainer}>
            <Image src="/assets/images/logo.png" alt="Logo" width={60} height={60} priority />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <SearchableTagSelector
            label="Abonnierte Rahmengesetze"
            options={ALL_LAWS}
            selected={customer.subscribedLaws}
            onChange={(newLaws) =>
              onUpdate(customer.id, { subscribedLaws: newLaws as Stichwort[] })
            }
          />
        </div>

        <div className={styles.section}>
          <SearchableTagSelector
            label="Abonnierte Länder"
            options={MarketsAll}
            optionNames={CountryName}
            selected={customer.subscribedCountries}
            onChange={(newCountries) =>
              onUpdate(customer.id, {
                subscribedCountries: newCountries as typeof MarketsAll[number][],
              })
            }
          />
        </div>

        <div className={styles.section}>
          <SearchableTagSelector
            label="Weitere Tags"
            options={OTHER_TAGS}
            selected={customer.otherTags}
            onChange={(newTags) =>
              onUpdate(customer.id, { otherTags: newTags })
            }
          />
        </div>
      </div>
    </div>
  );
}