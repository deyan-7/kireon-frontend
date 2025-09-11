"use client";

import { useState, useCallback, useMemo } from "react";
import { Customer, generateMockCustomers } from "@/domain/customer";

export interface UseCustomerDataReturn {
  customers: Customer[];
  selectedCustomerId: string | null;
  selectedCustomer: Customer | null;
  searchQuery: string;
  filteredCustomers: Customer[];
  selectCustomer: (customerId: string) => void;
  updateCustomer: (customerId: string, updates: Partial<Pick<Customer, "subscribedLaws" | "subscribedCountries" | "otherTags">>) => void;
  setSearchQuery: (query: string) => void;
}

export function useCustomerData(): UseCustomerDataReturn {
  const [customers, setCustomers] = useState<Customer[]>(() => generateMockCustomers());
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  );

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.address.toLowerCase().includes(query) ||
        customer.metadata.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  const selectCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
  }, []);

  const updateCustomer = useCallback(
    (
      customerId: string,
      updates: Partial<Pick<Customer, "subscribedLaws" | "subscribedCountries" | "otherTags">>
    ) => {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId
            ? { ...customer, ...updates }
            : customer
        )
      );
    },
    []
  );

  return {
    customers,
    selectedCustomerId,
    selectedCustomer,
    searchQuery,
    filteredCustomers,
    selectCustomer,
    updateCustomer,
    setSearchQuery,
  };
}