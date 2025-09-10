"use client";

import { Customer } from "@/domain/customer";
import styles from "./CustomerList.module.scss";

interface CustomerListProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  searchQuery: string;
  onSelectCustomer: (customerId: string) => void;
  onSearchChange: (query: string) => void;
}

export function CustomerList({
  customers,
  selectedCustomerId,
  searchQuery,
  onSelectCustomer,
  onSearchChange,
}: CustomerListProps) {
  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Kunden suchen..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.customerList}>
        {customers.map((customer) => (
          <div
            key={customer.id}
            className={`${styles.customerItem} ${
              selectedCustomerId === customer.id ? styles.selected : ""
            }`}
            onClick={() => onSelectCustomer(customer.id)}
          >
            <div className={styles.customerName}>{customer.name}</div>
            <div className={styles.customerMeta}>{customer.metadata}</div>
          </div>
        ))}
      </div>
    </div>
  );
}