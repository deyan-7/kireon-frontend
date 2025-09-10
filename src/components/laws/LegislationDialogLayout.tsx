import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LegislationDialogLayoutProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  onClose: () => void;
  dialogFooter?: ReactNode;
  className?: string;
}

export function LegislationDialogLayout({ 
  title, 
  description, 
  children, 
  onClose, 
  dialogFooter,
  className
}: LegislationDialogLayoutProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("!max-w-[90vw] !w-[90vw] max-h-[85vh] h-[85vh] flex flex-col p-0 bg-white border-gray-200 sm:!max-w-6xl overflow-hidden", className)}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {children}
          </div>
        </ScrollArea>
        {dialogFooter && (
          <div className="px-6 py-4 border-t border-gray-100">
            {dialogFooter}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}