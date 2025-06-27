import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMPLAINT_CATEGORIES, CATEGORY_PRIORITY_SUGGESTIONS } from "@/lib/constants";

interface CategorySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  onPriorityChange?: (priority: string) => void;
  showDescription?: boolean;
}

export function CategorySelector({ 
  value, 
  onChange, 
  onPriorityChange,
  showDescription = false 
}: CategorySelectorProps) {
  const handleCategoryChange = (newValue: string) => {
    onChange(newValue);
    
    // Auto-suggest priority based on category
    if (onPriorityChange && newValue in CATEGORY_PRIORITY_SUGGESTIONS) {
      const suggestedPriority = CATEGORY_PRIORITY_SUGGESTIONS[newValue as keyof typeof CATEGORY_PRIORITY_SUGGESTIONS];
      onPriorityChange(suggestedPriority);
    }
  };

  const selectedCategory = COMPLAINT_CATEGORIES.find(c => c.value === value);

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={handleCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="เลือกประเภทปัญหา">
            {selectedCategory && (
              <div className="flex items-center gap-2">
                <selectedCategory.icon size={16} />
                <span>{selectedCategory.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COMPLAINT_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value} className="py-3">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <category.icon size={16} />
                  <span className="font-medium">{category.label}</span>
                </div>
                {showDescription && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedCategory && showDescription && (
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <p className="font-medium mb-2">{selectedCategory.description}</p>
          <p className="font-medium">ตัวอย่างปัญหา:</p>
          <ul className="list-disc list-inside mt-1">
            {selectedCategory.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
