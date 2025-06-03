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
  // Normalize ingredients to handle \r\n, \n and trim only valid strings
  const parsedIngredients = (
    typeof ingredients === 'string'
      ? ingredients.trim().split(/\r?\n/)
      : Array.isArray(ingredients) ? ingredients : []
  )
    .map((item) => typeof item === 'string' ? item.trim() : '')
    .filter((item) => item.length > 0);

  return (
    <div className="p-6 bg-neutral-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2">
        {typeof name === 'string' ? name : 'Untitled'}
      </h2>
      <p className="text-sm text-gray-400 mb-1">SRM {srm}</p>
      <p className="mb-2">{typeof style === 'string' ? style : ''}</p>
      <p className="mb-4 font-semibold">
        ABV: {abv} • OG: {og} • FG: {fg}
      </p>

      <ul className="list-disc list-inside mb-4">
        {parsedIngredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <p className="text-sm text-gray-300">
        {typeof instructions === 'string' ? instructions : ''}
      </p>
    </div>
  );
}
