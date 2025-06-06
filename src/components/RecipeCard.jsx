// src/components/RecipeCard.jsx
const srmHex = [
  "#f3f993", "#f5f75c", "#f6f513", "#eae615", "#e0d01b", "#d5bc26", "#cdaa37",
  "#c1963c", "#be8c3a", "#be823a", "#c17a37", "#bf7138", "#bc6733", "#b26033",
  "#a85839", "#985336", "#8d4c32", "#7c452d", "#6b3a1e", "#5d341a", "#4e2a0c",
  "#4a2727", "#361f1b", "#261716", "#231716", "#19100f", "#16100f", "#120d0c",
  "#100b0a", "#050b0a"
];

export default function RecipeCard({ recipe, showDelete, onDelete }) {
  const getIngredientList = () => {
    const ing = recipe?.ingredients;

    if (Array.isArray(ing) && ing.every(i => typeof i === 'object' && i.name)) {
      return ing.map(i =>
        `${i.quantity ? `${i.quantity} ` : ''}${i.name}`.trim()
      );
    }

    if (Array.isArray(ing)) {
      return ing.map(i =>
        typeof i === 'string' ? i.trim() : ''
      ).filter(Boolean);
    }

    if (typeof ing === 'string') {
      return ing
        .split(/\r?\n/)
        .map(i => i.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getInstructionSteps = () => {
    const raw = recipe.instructions;
    if (!raw) return [];
    const steps = Array.isArray(raw) ? raw : raw.split(/\r?\n|(?<=\.)\s+(?=\S)/);
    return steps
      .map(s => s.replace(/^\[\d+\]\s*|\d+\.\s*/g, '').trim())
      .filter(Boolean);
  };

  const SRM = Math.max(1, Math.min(30, parseInt(recipe?.srm) || 10));
  const srmColor = srmHex[SRM - 1];

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-700 shadow-md text-white text-sm relative">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-amber-400">{recipe.name}</h3>
          <p className="text-xs text-gray-400">{recipe.style} • SRM {recipe.srm}</p>
          <p className="text-xs text-gray-300 mt-1">
            <strong>ABV:</strong> {recipe.abv} &nbsp;•&nbsp;
            <strong>OG:</strong> {recipe.og} &nbsp;•&nbsp;
            <strong>FG:</strong> {recipe.fg}
          </p>
          {recipe.ibu && (
            <p className="text-xs text-gray-300 mb-1">
              <strong>IBU:</strong> {recipe.ibu}
            </p>
          )}
        </div>

        {/* SRM Color Block */}
        <div className="flex flex-col items-center ml-4">
          <div
            className="w-6 h-12 rounded-md border border-neutral-700"
            style={{ backgroundColor: srmColor }}
          ></div>
          <span className="text-[10px] text-gray-400 mt-1">SRM</span>
        </div>
      </div>

      {getIngredientList().length > 0 && (
        <>
          <h4 className="text-xs font-bold text-white mt-3 mb-1">Ingredients</h4>
          <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
            {getIngredientList().map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {recipe.instructions && (
        <>
          <h4 className="text-xs font-bold text-white mt-4 mb-1">Instructions</h4>
          <ol className="text-xs text-gray-300 list-decimal list-inside space-y-1 mb-4">
            {getInstructionSteps().map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </>
      )}

      {showDelete && (
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
        >
          Delete Recipe
        </button>
      )}
    </div>
  );
}
