import type { Category, Term } from '../types';
import { Card, CardContent } from '@/components/ui/card';

interface CategorySelectorProps {
  categories: Category[];
  terms: Term[];
  onCategorySelect: (category: Category, categoryTerms: Term[]) => void;
}

export default function CategorySelector({ categories, terms, onCategorySelect }: CategorySelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Choose a Category</h2>
        <p className="text-muted-foreground text-sm">Select a topic to start learning</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryTerms = terms.filter(t => t.categoryId === category.id);
          return (
            <Card 
              key={category.id}
              className="group cursor-pointer hover:shadow-2xl hover:border-lime-300 dark:hover:border-lime-600 transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-br hover:from-lime-50/80 hover:to-green-50/60 dark:hover:from-lime-900/20 dark:hover:to-green-900/15 border border-lime-200/30 dark:border-lime-700/30 backdrop-blur-sm"
              onClick={() => onCategorySelect(category, categoryTerms)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-2xl p-2 bg-gradient-to-br from-lime-100/50 to-green-100/50 dark:from-lime-900/30 dark:to-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                      {categoryTerms.length}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      terms
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-base leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Learn {categoryTerms.length} essential terms
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
