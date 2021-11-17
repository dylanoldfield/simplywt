import { expect } from 'chai';
import { shallow } from "enzyme";


import React from "react";
import SortableTableHeader from "../components/SortableTableHeader";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

describe("SortableTableHeader", () => {
    const noop = () => {};


  it("checks if the title renders correctly", () => {
      const header = shallow(<SortableTableHeader title="title"/>);
      expect(header.text()).to.equal("title");
  });

  it("should render one <KeyboardArrowUpIcon /> components if not Activated", () => {
    const header = shallow(<SortableTableHeader title="title" active={false}/>);
    expect(header.find(KeyboardArrowUpIcon)).to.have.lengthOf(1);
  });

  it("should render one <KeyboardArrowDownIcon /> components if Activated and Direction Dsc", () => {
    const header = shallow(<SortableTableHeader title="title" active={true} sortDirection="Dsc"/>);
    expect(header.find(KeyboardArrowDownIcon)).to.have.lengthOf(1);
  });

  it("should render one <KeyboardArrowUpIcon /> components if Activated and Direction Asc", () => {
    const header = shallow(<SortableTableHeader title="title" active={true} sortDirection="Asc"/>);
    expect(header.find(KeyboardArrowUpIcon)).to.have.lengthOf(1);
  });

  it("shouldn't render <KeyboardArrowDownIcon /> components if Hover and not Activated", () => {
    const header = shallow(<SortableTableHeader title="title" active={false} hover={true} sortDirection="Dsc"/>);
    expect(header.find(KeyboardArrowDownIcon)).to.have.lengthOf(0);
  });

  it("should render <KeyboardArrowUpIcon /> components if Hover and not Activated", () => {
    const header = shallow(<SortableTableHeader title="title" active={false} hover={true} sortDirection="Dsc"/>);
    expect(header.find(KeyboardArrowUpIcon)).to.have.lengthOf(1);
  });

  it("should still render <KeyboardArrowDownIcon /> components if Hover and Activated Dsc", () => {
    const header = shallow(<SortableTableHeader title="title" active={true} hover={true} sortDirection="Dsc"/>);
    expect(header.find(KeyboardArrowDownIcon)).to.have.lengthOf(1);
    expect(header.find(KeyboardArrowUpIcon)).to.have.lengthOf(0);
  });

  
});