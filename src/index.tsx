import Omnibar from './Omnibar';
import { command } from './decorators';
import { compose } from './utils';
import { withExtensions, withVoice } from './hoc';
import { buildItemStyle } from './modifiers/anchor/AnchorRenderer';

export default Omnibar;

export { command, compose, withExtensions, withVoice, buildItemStyle };
