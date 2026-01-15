import { WORLD_DATA } from "./world.js";

export const buildWorldMap = () => {
  return `
    <div class="overlay__section">
      <h3>World Map</h3>
      ${WORLD_DATA.map(
        (world, index) => `
          <p>
            <strong>${index + 1}. ${world.name}</strong><br />
            <span>${world.theme}</span><br />
            <em>Status: ${world.status}</em>
          </p>
        `
      ).join("")}
    </div>
  `;
};
