import type { Category, Term } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  terms: Term[];
  onCategorySelect: (category: Category, categoryTerms: Term[]) => void;
}

export default function CategorySelector({ categories, terms, onCategorySelect }: CategorySelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Choose a Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const categoryTerms = terms.filter(t => t.categoryId === category.id);
          return (
            <button
              key={category.id}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left hover:shadow-md"
              onClick={() => onCategorySelect(category, categoryTerms)}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <div className="font-semibold text-gray-900 mb-1 text-sm leading-tight">
                {category.name}
              </div>
              <div className="text-xs text-gray-500">
                {categoryTerms.length} terms
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
