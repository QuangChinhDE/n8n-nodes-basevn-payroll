import * as list from './list';
import * as pushData from './pushData';

export { list, pushData };

export const description = [...list.description, ...pushData.description];
