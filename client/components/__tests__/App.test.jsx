import { render, mount } from 'enzyme';
import React from 'react';
import App from '../App.jsx';

import dummyData from '../../../DB/dummyData.json';

// Rename it blocks to be more agnostic
// Make sure tests only test that component
// Navigation component shouldn't be tested here, it should be in Navigation tests
// Can test the function that's passed to navigation here tho

describe('App Component', () => {
  const wrapper = render(<App />);
  it('Should render and match Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('Should not render anything besides the Spinner while isLoading state is active', () => {
    expect(wrapper.find('img').length).toEqual(1);
    expect(wrapper.find('i').length).toEqual(0);
    expect(wrapper.find('div').length).toEqual(0);
  });

  it('Should render Navigation Component after loading', () => {
    const appComponent = mount(<App />, { disableLifecycleMethods: true });
    appComponent.setState({
      isLoading: false,
    });
    expect(appComponent.find('i').length).toEqual(4);
  });
});


const properKeys = {
  id: expect.any(Number),
  name: expect.any(Array),
  profilePic: expect.any(String),
  lastCalled: expect.any(String),
  timesCalled: expect.any(Number),
};

describe('Random Student Button', () => {
  const appComponent = mount(<App />, { disableLifecycleMethods: true });
  appComponent.setState({
    isLoading: false,
    students: dummyData,
  });

  it('Should update state with an object containing the proper keys', () => {
    appComponent.find('.fa-user-graduate').simulate('click');
    appComponent.update();
    expect(appComponent.state().picked).toEqual(expect.objectContaining(properKeys));
  });
});

describe('Least Picked Student Button', () => {
  const appComponent = mount(<App />, { disableLifecycleMethods: true });
  appComponent.setState({
    isLoading: false,
    students: dummyData,
  });
  it('Should update state with an object containing the proper keys', () => {
    appComponent.find('.fa-user-clock').simulate('click');
    appComponent.update();
    expect(appComponent.state().picked).toEqual(expect.objectContaining(properKeys));
  });
});

describe('All Students Button', () => {
  it('Should update state', () => {
    const appComponent = mount(<App />, { disableLifecycleMethods: true });
    appComponent.setState({
      isLoading: false,
      students: dummyData,
    });
    appComponent.find('.fa-users').simulate('click');
    appComponent.update();
    expect(appComponent.state().view).toEqual('all');
  });
});
