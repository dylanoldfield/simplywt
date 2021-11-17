import {shallow} from 'enzyme';
import App from './App';

describe('Testing basic app rendering  ', () => {

  const wrapper = shallow(<App />);
  it('should have been called twice, once for count and once for stocks', () => {
    expect(wrapper.find('StockTable').length).toBe(1);
  });

});