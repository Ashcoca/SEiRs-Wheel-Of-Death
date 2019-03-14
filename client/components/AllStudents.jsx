import React from 'react';
import propTypes from 'prop-types';
import { animateScroll as scroll } from 'react-scroll';

import StudentCard from './StudentCard.jsx';
import Search from './Search.jsx';
import SortSelector from './SortSelector.jsx';
import ButtonIcon from './ButtonIcon.jsx';

// Component to display all student data to be scrolled through
// Could also allow for manual selection of students? Doubt it would ever be used, but it'd be nice to have the option I guess.


class AllStudents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: this.props.items,
      studentsToShow: 12,
      currentDisplay: this.props.items.slice(0, 12),
    };
    this.nextTenStudents = this.nextTenStudents.bind(this);
    this.searchStudents = this.searchStudents.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.sortStudents = this.sortStudents.bind(this);
  }

  // Load up the next 10 students when viewing All Students -- may consider adding prevTenStudents functionality
  nextTenStudents() {
    const shown = this.state.studentsToShow;
    if ((this.state.studentsToShow + 12) > this.state.students.length) {
      // I am open to better options than this alert box lol
      alert('Stop clicking, there are no more students!');
    } else {
      this.setState({
        studentsToShow: this.state.studentsToShow + 12,
        currentDisplay: this.state.students.slice(shown, shown + 12),
      });
      this.scrollToTop();
    }
  }

  // Library fn that adds scrolling animation
  scrollToTop() {
    scroll.scrollToTop({ duration: 500 });
  }

  searchStudents(event) {
    const query = event.target.value;
    const searchResults = this.state.students.filter((studentObj) => {
      return studentObj.name.toLowerCase().includes(query.toLowerCase());
    });
    this.setState({
      studentsToShow: 0,
      currentDisplay: searchResults.slice(0, 12),
    });
  }

  sortStudents(event) {
    const param = event.target.value;
    const sorted = this.state.students;
    if (param === 'timesCalled') {
      sorted.sort((a, b) => { return a[param] - b[param]; });
    }
    if (param === 'name') {
      sorted.sort((a, b) => { return a[param].toUpperCase() > b[param].toUpperCase() ? 1 : -1; });
    }
    if (param === 'lastCalled') {
      sorted.sort((a, b) => { return new Date(a[param]) - new Date(b[param]); });
    }
    this.setState({
      allStudents: sorted,
      currentDisplay: sorted.slice(0, 12),
    });
  }

  render() {
    const { onClose, addNotes } = this.props;
    return (
    <div className = "all-container">
      <div className = "floating-container">
        {/* <ButtonIcon classAndIconName={['home', 'btn-home'].join(' ')} onClick={onClose} title={'Home'}/> */}
        <i className={['fas fa-home', 'btn-home'].join(' ')} onClick={onClose} title="Home"></i>
        <Search search={this.searchStudents}/>
        <i className={['fas fa-arrow-circle-right', 'btn-next'].join(' ')} onClick={this.nextTenStudents} title="Next 12 Results"></i>
        <SortSelector sortSelect={this.sortStudents}/>
      </div>
        {this.state.currentDisplay.map(item => <StudentCard data={item} key={item.id} id={item.id} addNotes={addNotes}/> )}
    </div>
    );
  }
}


AllStudents.propTypes = {
  items: propTypes.arrayOf(propTypes.shape({
    id: propTypes.number.isRequired,
    name: propTypes.string.isRequired,
    profilePic: propTypes.string.isRequired,
    lastCalled: propTypes.string.isRequired,
    timesCalled: propTypes.number.isRequired,
  })),
  onClose: propTypes.func,
  addNotes: propTypes.func,
};

export default AllStudents;
