const stages = [
  "無明 (Ignorance)",
  "行 (Volitional Activities)",
  "識 (Consciousness)",
  "名色 (Name and Form)",
  "六入 (Six Sense Bases)",
  "觸 (Contact)",
  "受 (Feeling)",
  "愛 (Craving)",
  "取 (Grasping)",
  "有 (Becoming)",
  "生 (Birth)",
  "老死 (Aging and Death)"
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 0]
];

// Define an array of colors for the stages
const colors = ["#c9dce7", "#ffecb3", "#baf0bb", "#ffc1b3", "#e1cde6", "#dcc6b8", "#fad7e3", "#e2e2e2", "#f3f5cc", "#b2e3ed", "#e2e2e2", "#ffcec1"];

// Brighter colors for animation
const brighterColors = ["#92c5de", "#f7ba6b", "#8cd17d", "#f17575", "#b695c0", "#af988b", "#f2a3c7", "#b7b7b7", "#d4e67f", "#78c5d6", "#b7b7b7", "#f7ba6b"];

const svg = d3.select("#svg-container")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 800 800")
  .attr("preserveAspectRatio", "xMidYMid meet");

const radius = 330; // Original radius
const centerX = 400;
const centerY = 400;
const animationDuration = 200; // Animation duration in milliseconds
let cycleCounter = 0;
let isPlaying = true; // Flag to track animation state

// Original starting positions for circles and links
const linkLines = svg.selectAll(".link")
  .data(links)
  .enter()
  .append("line")
  .attr("class", "link")
  .attr("x1", (d) => centerX + radius * Math.cos((d[0] - 3) * 2 * Math.PI / stages.length))
  .attr("y1", (d) => centerY + radius * Math.sin((d[0] - 3) * 2 * Math.PI / stages.length))
  .attr("x2", (d) => centerX + radius * Math.cos((d[1] - 3) * 2 * Math.PI / stages.length))
  .attr("y2", (d) => centerY + radius * Math.sin((d[1] - 3) * 2 * Math.PI / stages.length))
  .attr("stroke", "#888") // Light gray for links
  .attr("stroke-width", 2);

const circle = svg.selectAll("circle")
  .data(stages)
  .enter()
  .append("circle")
  .attr("cx", (d, i) => centerX + radius * Math.cos((i - 3) * 2 * Math.PI / stages.length))
  .attr("cy", (d, i) => centerY + radius * Math.sin((i - 3) * 2 * Math.PI / stages.length))
  .attr("r", 35) // Original radius
  .attr("fill", (d, i) => colors[i]) // Original stage color
  .attr("stroke", "#333") // Circle stroke color
  .attr("stroke-width", 2)
  .style("filter", "url(#glow)"); // Apply glow filter

const descriptions = svg.selectAll(".description")
  .data(stages)
  .enter()
  .append("text")
  .attr("class", "description")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("x", (d, i) => centerX + (radius + 60) * Math.cos((i - 3) * 2 * Math.PI / stages.length))
  .attr("y", (d, i) => centerY + (radius + 60) * Math.sin((i - 3) * 2 * Math.PI / stages.length) + 20)
  .text(d => d)
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .attr("fill", "#333"); // Always visible, matches stage color

const cycleCountText = svg.append("text")
  .attr("id", "cycleCountText")
  .attr("x", centerX)
  .attr("y", centerY)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .text("Cycle Count: " + cycleCounter)
  .style("font-size", "20px")
  .attr("fill", "#333"); // Color for cycle count text

// Function to animate flow from stage i to stage j
function animateFlow(i, j) {
  let cycleComplete = false; // Flag to track if a cycle is complete

  circle.transition()
    .attr("fill", (d, idx) => idx === j ? brighterColors[j] : colors[idx]) // Change fill color for active stage
    .attr("stroke", (d, idx) => idx === j ? brighterColors[j] : "#333") // Change stroke color for active stage
    .attr("stroke-width", (d, idx) => idx === j ? 4 : 2) // Increase stroke width for active stage
    .duration(animationDuration)
    .on("end", function() {
      if (i === stages.length - 1 && j === 0 && !cycleComplete) { // Increment cycleCounter when loop completes from last to first
        cycleCounter++;
        cycleCountText.text("Cycle Count: " + cycleCounter);
        cycleComplete = true;
      }
      if (isPlaying) {
        animateFlow(j, (j + 1) % stages.length);
      }
    });

  linkLines.transition()
    .attr("stroke", (d) => (d[0] === i && d[1] === j) ? brighterColors[j] : "#888") // Change link color for active link
    .duration(animationDuration);
}

// Initial delay before starting the animation
setTimeout(() => {
  animateFlow(0, 1); // Start animation from stage 1
}, 2000); // Delay of 2 seconds (2000 milliseconds) before starting

// Event listener for the play/pause button
const playPauseBtn = document.getElementById("play-pause-btn");
playPauseBtn.addEventListener("click", function() {
  if (isPlaying) {
    isPlaying = false;
    playPauseBtn.textContent = "Play";
  } else {
    isPlaying = true;
    playPauseBtn.textContent = "Pause";
    animateFlow(0, 1); // Resume animation from the current stage
  }
});
