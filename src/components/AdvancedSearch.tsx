import React, { useState, useMemo, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Calendar,
  MapPin,
  Tag,
  FileText,
  Clock,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { Report } from '../App';

interface SearchFilters {
  keyword: string;
  category: string;
  status: string;
  dateRange: {
    from: string;
    to: string;
  };
  location: string;
  isEmergency: boolean | null;
  isConfidential: boolean | null;
}

interface SortOption {
  key: keyof Report;
  direction: 'asc' | 'desc';
  label: string;
}

interface AdvancedSearchProps {
  reports: Report[];
  onFilteredReports: (filteredReports: Report[]) => void;
  className?: string;
}

const INITIAL_FILTERS: SearchFilters = {
  keyword: '',
  category: '',
  status: '',
  dateRange: { from: '', to: '' },
  location: '',
  isEmergency: null,
  isConfidential: null
};

const SORT_OPTIONS: SortOption[] = [
  { key: 'dateSubmitted', direction: 'desc', label: 'Newest First' },
  { key: 'dateSubmitted', direction: 'asc', label: 'Oldest First' },
  { key: 'title', direction: 'asc', label: 'Title A-Z' },
  { key: 'title', direction: 'desc', label: 'Title Z-A' },
  { key: 'status', direction: 'asc', label: 'Status A-Z' },
  { key: 'category', direction: 'asc', label: 'Category A-Z' },
];

const STATUS_OPTIONS = [
  'Draft', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'
];

const CATEGORY_OPTIONS = [
  'Infrastructure', 'Emergency', 'Public Safety', 'Health Service', 
  'Environmental', 'Compliance', 'Others'
];

export function AdvancedSearch({ reports, onFilteredReports, className }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports.filter(report => {
      // Keyword search (title, description, location)
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const matchesKeyword = 
          report.title.toLowerCase().includes(keyword) ||
          report.description.toLowerCase().includes(keyword) ||
          (report.location && report.location.toLowerCase().includes(keyword)) ||
          report.trackingId.toLowerCase().includes(keyword);
        if (!matchesKeyword) return false;
      }

      // Category filter
      if (filters.category && report.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status && report.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const reportDate = new Date(report.dateSubmitted);
        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          if (reportDate < fromDate) return false;
        }
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          if (reportDate > toDate) return false;
        }
      }

      // Location filter
      if (filters.location && report.location) {
        const locationMatch = report.location.toLowerCase().includes(filters.location.toLowerCase());
        if (!locationMatch) return false;
      }

      // Emergency filter
      if (filters.isEmergency !== null && report.isEmergency !== filters.isEmergency) {
        return false;
      }

      // Confidential filter
      if (filters.isConfidential !== null && report.isConfidential !== filters.isConfidential) {
        return false;
      }

      return true;
    });

    // Sort results
    filtered = filtered.sort((a, b) => {
      const aValue = a[sortOption.key];
      const bValue = b[sortOption.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOption.direction === 'asc' ? comparison : -comparison;
      }

      if (aValue instanceof Date || typeof aValue === 'string') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        const comparison = aDate.getTime() - bDate.getTime();
        return sortOption.direction === 'asc' ? comparison : -comparison;
      }

      return 0;
    });

    return filtered;
  }, [reports, filters, sortOption]);

  // Update parent component when filters change
  React.useEffect(() => {
    onFilteredReports(filteredAndSortedReports);
  }, [filteredAndSortedReports, onFilteredReports]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleDateRangeChange = useCallback((field: 'from' | 'to', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSortOption(SORT_OPTIONS[0]);
  }, []);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.category) count++;
    if (filters.status) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.location) count++;
    if (filters.isEmergency !== null) count++;
    if (filters.isConfidential !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Keyword Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports by title, description, location, or tracking ID..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {CATEGORY_OPTIONS.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Advanced Filters Button */}
              <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced
                    {activeFiltersCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Advanced Search & Filters</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          From Date
                        </label>
                        <Input
                          type="date"
                          value={filters.dateRange.from}
                          onChange={(e) => handleDateRangeChange('from', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          To Date
                        </label>
                        <Input
                          type="date"
                          value={filters.dateRange.to}
                          onChange={(e) => handleDateRangeChange('to', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        Location
                      </label>
                      <Input
                        placeholder="Search by location..."
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                      />
                    </div>

                    {/* Special Flags */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-700">Report Type</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Emergency Reports</label>
                          <Select 
                            value={filters.isEmergency === null ? 'all' : filters.isEmergency.toString()}
                            onValueChange={(value) => handleFilterChange('isEmergency', value === 'all' ? null : value === 'true')}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Reports</SelectItem>
                              <SelectItem value="true">Emergency Only</SelectItem>
                              <SelectItem value="false">Non-Emergency Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Confidential Reports</label>
                          <Select 
                            value={filters.isConfidential === null ? 'all' : filters.isConfidential.toString()}
                            onValueChange={(value) => handleFilterChange('isConfidential', value === 'all' ? null : value === 'true')}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Reports</SelectItem>
                              <SelectItem value="true">Confidential Only</SelectItem>
                              <SelectItem value="false">Public Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <SortAsc className="h-4 w-4 mr-2" />
                        Sort By
                      </label>
                      <Select 
                        value={`${sortOption.key}-${sortOption.direction}`}
                        onValueChange={(value) => {
                          const [key, direction] = value.split('-');
                          const option = SORT_OPTIONS.find(opt => opt.key === key && opt.direction === direction);
                          if (option) setSortOption(option);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SORT_OPTIONS.map((option) => (
                            <SelectItem 
                              key={`${option.key}-${option.direction}`}
                              value={`${option.key}-${option.direction}`}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline" onClick={clearFilters} className="flex items-center">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                      <Button onClick={() => setShowAdvancedFilters(false)}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Sort Dropdown */}
              <Select 
                value={`${sortOption.key}-${sortOption.direction}`}
                onValueChange={(value) => {
                  const [key, direction] = value.split('-');
                  const option = SORT_OPTIONS.find(opt => opt.key === key && opt.direction === direction);
                  if (option) setSortOption(option);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem 
                      key={`${option.key}-${option.direction}`}
                      value={`${option.key}-${option.direction}`}
                    >
                      <div className="flex items-center">
                        {option.direction === 'asc' ? 
                          <SortAsc className="h-3 w-3 mr-2" /> : 
                          <SortDesc className="h-3 w-3 mr-2" />
                        }
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">Active filters:</span>
              
              {filters.keyword && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  "{filters.keyword}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('keyword', '')}
                  />
                </Badge>
              )}

              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {filters.category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('category', '')}
                  />
                </Badge>
              )}

              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {filters.status}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('status', '')}
                  />
                </Badge>
              )}

              {(filters.dateRange.from || filters.dateRange.to) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {filters.dateRange.from ? new Date(filters.dateRange.from).toLocaleDateString() : 'Any'} - 
                  {filters.dateRange.to ? new Date(filters.dateRange.to).toLocaleDateString() : 'Any'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleDateRangeChange('from', '') || handleDateRangeChange('to', '')}
                  />
                </Badge>
              )}

              {filters.location && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {filters.location}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('location', '')}
                  />
                </Badge>
              )}

              {filters.isEmergency === true && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  Emergency Only
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('isEmergency', null)}
                  />
                </Badge>
              )}

              {filters.isConfidential === true && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Confidential Only
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('isConfidential', null)}
                  />
                </Badge>
              )}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          Showing {filteredAndSortedReports.length} of {reports.length} reports
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Sorted by: {sortOption.label}</span>
        </div>
      </div>
    </div>
  );
}