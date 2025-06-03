// src/components/RecipeCard.jsx
export default function RecipeCard({
  name,
  srm,
  style,
  abv,
  og,
  fg,
  ingredients = [],
  instructions,
}) {
  // Normalize ingredients to handle \r\n, \n, and trim everything
  const parsedIngredients = (
  typeof ingredients === 'string'
    ? ingredients.trim().split(/\r?\n/)
    : ingredients
)
  .map((item) => item.trim())
  .filter((item) => item.length > 0);

  return (
    <div className="p-6 bg-neutral-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-sm text-gray-400 mb-1">SRM {srm}</p>
      <p className="mb-2">{style}</p>
      <p className="mb-4 font-semibold">
        ABV: {abv} • OG: {og} • FG: {fg}
      </p>

      <ul className="list-disc list-inside mb-4">
        {parsedIngredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <p className="text-sm text-gray-300">{instructions}</p>
    </div>
  );
}
