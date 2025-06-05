const getSrmColor = (srm) => {
  const srmInt = parseInt(srm, 10);
  if (srmInt <= 5) return '#F8F075'; // Blonde
  if (srmInt <= 10) return '#FBBF24'; // Pale Ale
  if (srmInt <= 20) return '#B45309'; // Amber
  if (srmInt <= 30) return '#78350F'; // Brown
  return '#1C1917'; // Stout
};

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
  const srmColor = getSrmColor(recipe.srm);

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in border transition-all duration-300 ${
        isError
          ? 'bg-red-900 border-red-500'
          : 'bg-neutral-900 border-neutral-800 hover:border-amber-400'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3
            className={`text-xl font-bold ${
              isError ? 'text-red-300' : 'text-amber-400'
            }`}
          >
            {recipe.name}
          </h3>
          <p className="text-sm text-gray-400">
            {recipe.style} • SRM {recipe.srm}
          </p>
        </div>

        {!isError && (
          <div className="flex flex-col items-center min-w-[1.5rem]">
            <div
              className="w-6 h-16 rounded-sm border border-gray-600 shadow-inner"
              style={{
                backgroundColor: srmColor,
                boxShadow: `0 0 6px ${srmColor}`,
              }}
              title={`SRM ${recipe.srm}`}
            />
            <span className="text-xs text-gray-500 mt-1">SRM</span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-300 mb-4">
        <strong>ABV:</strong> {recipe.abv} &nbsp;•&nbsp;
        <strong>OG:</strong> {recipe.og} &nbsp;•&nbsp;
        <strong>FG:</strong> {recipe.fg}
      </p>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 mb-1">Ingredients</p>
        <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
          {getIngredientList().map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 mb-1">Instructions</p>
        <p className="text-sm text-gray-400 whitespace-pre-line">
          {recipe.instructions}
        </p>
      </div>

      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="mt-4 text-sm text-red-400 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Delete Recipe
        </button>
      )}
    </div>
  );
}
