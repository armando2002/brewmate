// src/components/RecipeCard.jsx
export default function RecipeCard({ recipe, onDelete, showDelete = false }) {
  if (!recipe) return null;

  const getIngredientList = () => {
    if (!recipe.ingredients) return [];
    if (typeof recipe.ingredients === 'string') {
      return recipe.ingredients
        .split(/\r?\n/)
        .map((i) => i.trim())
        .filter(Boolean);
    }
    if (Array.isArray(recipe.ingredients)) {
      return recipe.ingredients
        .map((i) => (typeof i === 'string' ? i.trim() : ''))
        .filter(Boolean);
    }
    return [];
  };

  const isError = recipe.name === 'Error';

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in ${
        isError
          ? 'bg-red-900 border border-red-500'
          : 'bg-neutral-900 border border-neutral-700'
      }`}
    >
      <h3
        className={`text-2xl font-bold mb-1 ${
          isError ? 'text-red-300' : 'text-amber-400'
        }`}
      >
        {recipe.name}
      </h3>
      <p className="text-xs text-gray-400 mb-1">SRM {recipe.srm}</p>
      <p className="text-sm text-gray-300 mb-2">{recipe.style}</p>
      <p className="text-sm text-gray-300 mb-4">
        <strong>ABV:</strong> {recipe.abv} &nbsp;•&nbsp;
        <strong>OG:</strong> {recipe.og} &nbsp;•&nbsp;
        <strong>FG:</strong> {recipe.fg}
      </p>

      <ul className="list-disc list-inside space-y-1 text-sm mb-6">
        {getIngredientList().map((item, idx) => (
          <li key={idx} className="text-gray-200">
            {item}
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-300 whitespace-pre-line mb-6">
        {recipe.instructions}
      </p>

      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="text-sm text-red-400 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Delete Recipe
        </button>
      )}
    </div>
  );
}
