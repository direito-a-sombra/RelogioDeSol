function exportGridSVG(filename = "grid.svg", cellSize = 120) {
  const rows = [...document.querySelectorAll(".grid-row")].slice(1); // skip header
  const cols = rows[0].querySelectorAll(".grid-plot").length;
  const cellSizeWithPad = cellSize + 16;

  let svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cellSizeWithPad}" height="${rows.length * cellSizeWithPad}" viewBox="0 0 ${cols * cellSizeWithPad} ${rows.length * cellSizeWithPad}">`
  ];

  rows.forEach((row, r) => {
    const plots = row.querySelectorAll(".grid-plot");

    plots.forEach((plot, c) => {
      const shape = plot.querySelector(".plot-shape");
      if (!shape) return;

      const bg = getComputedStyle(plot).backgroundColor;
      const fg = getComputedStyle(shape).backgroundColor;

      const x0 = c * cellSizeWithPad;
      const y0 = r * cellSizeWithPad;

      svg.push(
        `<rect x="${x0}" y="${y0}" width="${cellSize}" height="${cellSize}" fill="${bg}"/>`
      );

      const clip = getComputedStyle(shape).clipPath;
      const mirrored = getComputedStyle(shape).transform !== "none";

      const body = clip.match(/^polygon\((.*)\)$/)[1];

      const points = body
        .split(/\s*,\s*/)
        .map(p => {
          let [x, y] = p.trim().split(/\s+/);

          x = parseFloat(x) / 100;
          y = parseFloat(y) / 100;

          if (mirrored)
            x = 1 - x;

          return `${(x0 + x * cellSize).toFixed(2)},${(y0 + y * cellSize).toFixed(2)}`;
        })
        .join(" ");

      svg.push(`<polygon points="${points}" fill="${fg}"/>`);
    });
  });

  svg.push("</svg>");

  const blob = new Blob([svg.join("\n")], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("sundial-grid-export-button").addEventListener("click", () => exportGridSVG());
});
