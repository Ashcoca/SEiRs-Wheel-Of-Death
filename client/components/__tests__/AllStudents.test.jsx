import { render, mount, shallow } from 'enzyme';
import * as React from 'react';
import AllStudents from '../AllStudents.jsx';
import App from '../App.jsx';

import dummyData from '../../../DB/dummyData.json';

describe('All Students Component', () => {
  const wrapper = render(<AllStudents items={dummyData}/>);

  it('Should render the floating Nav bar', () => {
    expect(wrapper.find('.floating-container').length).toEqual(1);
    expect(wrapper.find('i').length).toEqual(2);
    expect(wrapper.find('.search-form').length).toEqual(1);
    expect(wrapper.find('.select').length).toEqual(1);
  });
  it('Should render 12 student cards', () => {
    expect(wrapper.find('.student-card').length).toEqual(12);
  });
});

// Not sure if this is the best way to test this
// Should I be testing the render of AllStudents here or in the parent component (App)?
// Mount seems to be a better option than using shallow on App and AllStudents
describe('Back Button', () => {
  it('Should update state and render the home page', () => {
    const appComponent = mount(<App />, { disableLifecycleMethods: true });
    appComponent.setState({
      isLoading: false,
      view: 'all',
    });
    expect(appComponent.find('.btn-home').length).toEqual(1);
    appComponent.find('.btn-home').simulate('click');
    appComponent.update();

    expect(appComponent.state().view).toEqual('home');
    expect(appComponent.find('.btn-home').length).toEqual(0);
  });
});

describe('Next Button', () => {
  it('Should update state and render the next students', () => {
    const wrapper = shallow(<AllStudents items={dummyData}/>, { disableLifecycleMethods: true });
    wrapper.find('.btn-next').simulate('click');
    wrapper.update();

    expect(wrapper.state().studentsToShow).toEqual(24);
  });
});
