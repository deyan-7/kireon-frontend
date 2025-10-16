import React from 'react';

interface InstructionCardProps {
  title: string;
  instructions: string | null;
}

const InstructionCard: React.FC<InstructionCardProps> = ({ title, instructions }) => {
  if (!instructions) return null;
  return (
    <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h4 className="mb-2 text-sm font-semibold text-slate-900">{title}</h4>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{instructions}</p>
    </div>
  );
};

export default InstructionCard;

