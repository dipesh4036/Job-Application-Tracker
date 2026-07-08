import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = 'Search by company or role...' }) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-10"
      />
    </div>
  );
};

export default SearchInput;
