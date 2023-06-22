import { entries, size, values, keys } from 'lodash';
import resourceSpecs from '~/public/static/resource-specs.json';

export const resourceSpecsData = resourceSpecs.data;

const {
  hardware: hardwareSpecs, vm: vmSpecs, resources: { android, ios },
} = resourceSpecs.data;

function formatHardware(hardwares) {
  return (keys(hardwares).map(((hardware) => {
    const { cpu, memory, description } = hardwareSpecs[hardware];
    return `${cpu}, ${memory} (${description})`;
  })));
}

function formatVMs(hardwares) {
  return (entries(hardwares).map((([hardware, { vm, extra }]) => {
    const { cpu, memory } = vmSpecs[vm];
    if (size(hardwares) === 1) return `${cpu}, ${memory}, ${extra}`;
    return `${cpu}, ${memory}, ${extra} (for builds runnning on ${hardwareSpecs[hardware].name})`;
  })).join(' or '));
}
export const iosResourceClasses = values(ios).map(({ symbol }) => symbol);
export const iosResources = values(ios).map(({ symbol, hardware }) => `- \`${symbol}\`: ${formatVMs(hardware)}`);

export const androidResourceClasses = values(android).map(({ symbol }) => symbol);
export const androidResources = values(android).map(({ symbol, hardware }) => `- \`${symbol}\`: ${formatHardware(hardware)}`);
