// Curated Chart.js registration.
//
// Only line/bar/doughnut are used, so register just those controllers/
// elements/scales/plugins instead of `...registerables` so Rollup can
// tree-shake the rest of chart.js out of the bundle.
import {
	Chart,
	// controllers
	LineController,
	BarController,
	DoughnutController,
	// elements
	LineElement,
	PointElement,
	BarElement,
	ArcElement,
	// scales
	LinearScale,
	CategoryScale,
	// plugins
	Filler,
	Legend,
	Tooltip
} from 'chart.js';

Chart.register(
	LineController,
	BarController,
	DoughnutController,
	LineElement,
	PointElement,
	BarElement,
	ArcElement,
	LinearScale,
	CategoryScale,
	Filler,
	Legend,
	Tooltip
);

export { Chart };
export type { TooltipModel, ChartType } from 'chart.js';
