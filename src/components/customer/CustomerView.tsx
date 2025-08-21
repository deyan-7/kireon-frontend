"use client";

import { useCustomerData } from "@/lib/hooks/useCustomerData";
import { CustomerList } from "./CustomerList";
import { CustomerDetails } from "./CustomerDetails";
import styles from "./CustomerView.module.scss";

export function CustomerView() {
  const {
    filteredCustomers,
    selectedCustomer,
    selectedCustomerId,
    searchQuery,
    selectCustomer,
    updateCustomer,
    setSearchQuery,
  } = useCustomerData();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <CustomerList
          customers={filteredCustomers}
          selectedCustomerId={selectedCustomerId}
          searchQuery={searchQuery}
          onSelectCustomer={selectCustomer}
          onSearchChange={setSearchQuery}
        />
      </aside>
      <main className={styles.main}>
        {selectedCustomer ? (
          <CustomerDetails
            customer={selectedCustomer}
            onUpdate={updateCustomer}
          />
        ) : (
          <div className={styles.placeholder}>
            <p>Wählen Sie einen Kunden aus, um Details anzuzeigen</p>
          </div>
        )}
      </main>
    </div>
  );
}