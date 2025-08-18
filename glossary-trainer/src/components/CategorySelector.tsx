import type { Category, Term } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategorySelectorProps {
  categories: Category[];
  terms: Term[];
  onCategorySelect: (category: Category, categoryTerms: Term[]) => void;
}

export default function CategorySelector({ categories, terms, onCategorySelect }: CategorySelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-foreground text-center px-4 py-2 bg-muted/20 rounded-xl">Choose a Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const categoryTerms = terms.filter(t => t.categoryId === category.id);
          return (
            <Card 
              key={category.id}
              className="group cursor-pointer hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/10 hover:from-accent/20 hover:to-muted/20 border-border/50"
              onClick={() => onCategorySelect(category, categoryTerms)}
            >
              <CardContent className="p-6 text-left">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200 p-3 bg-background/40 rounded-xl w-fit">
                  {category.icon}
                </div>
                <div className="font-semibold text-foreground mb-2 text-sm leading-tight px-2 py-1 bg-background/30 rounded-lg">
                  {category.name}
                </div>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                  {categoryTerms.length} terms
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
