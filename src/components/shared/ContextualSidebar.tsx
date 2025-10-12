"use client";

import React, { useMemo } from 'react';
import { useSidebarStore } from '@/stores/sidebarStore';
import ChangeLogView from '@/components/laws/ChangeLogView';
import SourcesView from '@/components/laws/SourcesView';
import { AgentStreamProvider } from '@/context/AgentStreamProvider';
import LawMonitorChatPanel from '@/components/laws/LawMonitorChatPanel';
import { useChatStore } from '@/stores/chatStore';

export const ContextualSidebar: React.FC = () => {
  const { view, context, close, open } = useSidebarStore();
  const findOrCreateSession = useChatStore((s) => s.findOrCreateSession);

  const title = context?.title || '';

  const tabs = useMemo(() => {
    return [
      { key: 'chat' as const, label: 'Chat', enabled: true },
      { key: 'history' as const, label: 'Historie', enabled: !!(context?.objectType && context?.objectId !== undefined) },
      { key: 'sources' as const, label: 'Quellen', enabled: !!(context?.belege && context.belege.length > 0) },
    ];
  }, [context?.objectType, context?.objectId, context?.belege]);

  if (!view) return null;

  const truncate = (s: string, n = 60) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

  const renderContent = () => {
    switch (view) {
      case 'chat':
        return (
          <AgentStreamProvider>
            <LawMonitorChatPanel />
          </AgentStreamProvider>
        );
      case 'history':
        return context?.objectType && context.objectId !== undefined ? (
          <ChangeLogView objectType={context.objectType} objectId={context.objectId!} refreshKey={(context as any)?.refreshKey} />
        ) : null;
      case 'sources':
        return context?.belege ? <SourcesView belege={context.belege} /> : null;
      // Dokument summary is shown in its own overlay panel, not in the sidebar
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top tab bar (moved to very top, no separate close button) */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.25rem 0.5rem', borderBottom: '1px solid #e5e7eb' }}>
        {tabs.map((t) => {
          const isActive = view === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                if (!t.enabled && !isActive) return;
                const current = { ...(context || {}) };
                if (t.key === 'chat' && context) {
                  try {
                    const sessionId = findOrCreateSession(context);
                    current.chatSessionId = sessionId;
                  } catch {}
                }
                open(t.key as any, current as any);
              }}
              disabled={!t.enabled && !isActive}
              style={{
                padding: '0.35rem 0.5rem',
                fontSize: '0.85rem',
                color: isActive ? '#111827' : t.enabled ? '#4b5563' : '#9ca3af',
                border: 'none',
                background: 'transparent',
                borderBottom: `2px solid ${isActive ? '#3b82f6' : 'transparent'}`,
                fontWeight: isActive ? 600 : 500,
                cursor: t.enabled || isActive ? 'pointer' : 'not-allowed',
              }}
            >
              {t.label}
            </button>
          );
        })}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={close}
            aria-label="Schließen"
            title="Schließen"
            style={{
              padding: '0.25rem 0.5rem',
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Secondary context bar with smaller title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.35rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ fontSize: '0.85rem', color: '#374151' }}>{title ? truncate(title, 60) : ''}</div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        {renderContent()}
      </div>

      <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }} />
    </div>
  );
};

export default ContextualSidebar;
