"use client";

import React, { useState } from "react";
import { useCustomerData } from "@/lib/hooks/useCustomerData";
import { Customer } from "@/domain/customer";
import { Button } from "@/components/ui/button";
import { DocumentArrowDownIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import styles from "./CustomerReportView.module.scss";

export function CustomerReportView() {
  const { customers } = useCustomerData();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (customerId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const handleDownloadReport = async (customer: Customer) => {
    try {
      // Get auth token
      const { auth } = await import('@/lib/auth');
      const token = await auth.currentUser?.getIdToken();

      // Prepare parameters for the PDF endpoint
      const gesetzeskuerzel = customer.subscribedLaws.join(',');
      const laenderkuerzel = customer.subscribedCountries.join(',');
      
      const params = new URLSearchParams({
        kundenname: customer.name,
        gesetzeskuerzel: gesetzeskuerzel,
        laenderkuerzel: laenderkuerzel,
        stichtag_from: '',
        stichtag_to: '',
        betroffene: '',
        produkte: ''
      });

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend.niceforest-23188099.westeurope.azurecontainerapps.io";
      const response = await fetch(`${baseUrl}/pflicht/search-pdf?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const cleanName = customer.name.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
      link.download = `Legal_Monitoring_${cleanName}_${timestamp}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Fehler beim Herunterladen des Berichts. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Kundenberichte</h1>
        <p>PDF-Berichte für alle Kunden herunterladen</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Kundenname</th>
              <th>Adresse</th>
              <th>Anmerkungen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const isExpanded = expandedRows.has(customer.id);
              return (
                <React.Fragment key={customer.id}>
                  <tr className={styles.mainRow}>
                    <td className={styles.expandCell}>
                      <button
                        onClick={() => toggleRow(customer.id)}
                        className={styles.expandButton}
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className={styles.chevronIcon} />
                        ) : (
                          <ChevronRightIcon className={styles.chevronIcon} />
                        )}
                      </button>
                    </td>
                    <td className={styles.customerName}>{customer.name}</td>
                    <td className={styles.address}>{customer.address}</td>
                    <td className={styles.metadata}>{customer.metadata}</td>
                    <td className={styles.actions}>
                      <Button
                        onClick={() => handleDownloadReport(customer)}
                        variant="outline"
                        size="sm"
                      >
                        <DocumentArrowDownIcon className={styles.icon} />
                        Bericht herunterladen
                      </Button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={styles.detailRow}>
                      <td></td>
                      <td colSpan={4} className={styles.detailCell}>
                        <div className={styles.detailsContainer}>
                          <div className={styles.detailSection}>
                            <h4>Abonnierte Gesetze</h4>
                            <div className={styles.tags}>
                              {customer.subscribedLaws.map((law, index) => (
                                <span key={index} className={styles.tag}>
                                  {law}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className={styles.detailSection}>
                            <h4>Länder</h4>
                            <div className={styles.tags}>
                              {customer.subscribedCountries.map((country, index) => (
                                <span key={index} className={styles.tag}>
                                  {country}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className={styles.detailSection}>
                            <h4>Weitere Tags</h4>
                            <div className={styles.tags}>
                              {customer.otherTags.map((tag, index) => (
                                <span key={index} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
