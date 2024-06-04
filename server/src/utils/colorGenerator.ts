export function colorGenerator(): string {
  const colors: string[] = [
    "#a83258",
    "#32a875",
    "#4232a8",
    "#c5e31e",
    "#a832a0",
    "#00308F",
    "#e3b21e",
    "#800080",
    "#008000",
    "#000080",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
