"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface SearchableTagSelectorProps {
  label: string;
  options: readonly string[];
  optionNames?: Record<string, string>;
  selected: string[];
  onChange: (newSelected: string[]) => void;
}

export function SearchableTagSelector({
  label,
  options,
  optionNames,
  selected,
  onChange,
}: SearchableTagSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    const newSelected = selected.includes(currentValue)
      ? selected.filter((item) => item !== currentValue)
      : [...selected, currentValue];
    onChange(newSelected);
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(selected.filter((item) => item !== valueToRemove));
  };

  const getDisplayName = (value: string) =>
    optionNames ? optionNames[value] || value : value;

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    const search = searchValue.toLowerCase();
    return options.filter((option) => {
      const displayName = getDisplayName(option).toLowerCase();
      return displayName.includes(search) || option.toLowerCase().includes(search);
    });
  }, [options, searchValue, optionNames]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300"
          >
            <span className="truncate text-gray-700">
              {selected.length === 0
                ? "Wählen Sie Tags aus..."
                : `${selected.length} ausgewählt`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 bg-white border-gray-200">
          <Command>
            <CommandInput
              placeholder={`Suche ${label.toLowerCase()}...`}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{getDisplayName(option)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-md border border-gray-200">
          {selected.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="cursor-pointer bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              onClick={() => handleRemove(item)}
            >
              {getDisplayName(item)}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}