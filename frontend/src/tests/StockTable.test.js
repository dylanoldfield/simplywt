import React from "react";
import { shallow, mount} from "enzyme";
import StockTable from '../components/StockTable';
import { __esModule } from 'enzyme/build/ReactWrapper';
import * as requests from '../components/getReq.js'

jest.mock('../components/getReq.js');

describe('StockTable: static page when backend down ', () => {
    let container;
    const wrapper = shallow(<div><StockTable /></div>);
    beforeAll(async () => {
        await requests.getReq.mockResolvedValue({});
    });
    beforeEach(() => {
      container = wrapper.find('StockTable').dive();
    });
    it('should have been called twice, once for count and once for stocks', async() => {
      expect(await requests.getReq).toBeCalledTimes(2);
    });

    /*
      In reality I would perform far more unit/integration testing on this 
      - Need to fully mock the axios calls 
      - test useStateHooks 
      - test filtering 
      - test sorting 
      etc.

    */

  });